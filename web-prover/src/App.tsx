import { useState, useEffect } from "react";
import { connect, disconnect } from "@starknet-io/get-starknet";
import { WalletAccount, RpcProvider } from "starknet";
import { generateProof, generateProofAlternative, ProofGenerationService } from "./services/generateProof";
import type { ProofInputs, ProofResult, ProgressCallback } from "./services/generateProof";
import { Header } from "./components/Header";
import { Card } from "./components/Card";
import { Button } from "./components/Button";
import { GameOfLife } from "./components/GameOfLife";
import { LoginScreen } from "./components/LoginScreen";
import { RoadmapScreen } from "./components/RoadmapScreen";
import { WalletStatus } from "./components/WalletStatus";
import { GenerateProofForm } from "./components/GenerateProofForm";
import { SuccessSection } from "./components/SuccessSection";

type Status =
  | "idle" | "initializing" | "generatingProof" 
  | "verifyingLocal" | "verifyingOnChain" | "done" | "error";

export default function App() {
  // Real wallet state
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(null);
  const [currentView, setCurrentView] = useState<"main" | "roadmap" | "generate" | "success">("main");
  const [isConnecting, setIsConnecting] = useState(false);
  
  // ZK Proof states
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("");
  const [threshold, setThreshold] = useState<string>("100"); // público
  const [nonce, setNonce] = useState<string>(() => ProofGenerationService.generateRandomNonce()); // público (client-side)
  const [balance, setBalance] = useState<string>("1000");     // privado (será atualizado com saldo real)
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);
  const [proofData, setProofData] = useState<any>(null);

  // Check for saved proof data on wallet connection
  useEffect(() => {
    if (walletAccount?.address) {
      try {
        const savedTxHash = localStorage.getItem(walletAccount.address);
        if (savedTxHash) {
          setProofData({ txHash: savedTxHash });
          setCurrentView("success");
        }
      } catch (error) {
        console.error("Error checking localStorage", error);
      }
    }
  }, [walletAccount]);

  async function generateProofHandler() {
    try {
      setStatus("initializing");
      setProgress(0);
      setProgressText("Iniciando...");

      console.log("🔍 Inputs:", { threshold, nonce, balance });
      
      const inputs: ProofInputs = {
        threshold: Number(threshold),   // u64 público
        nonce: nonce,                   // Field público (string)
        balance: Number(balance),       // u64 privado
        secret_nonce: nonce             // Field privado (deve ser igual ao nonce)
      };

      const onProgress: ProgressCallback = (progress, text) => {
        setProgress(progress);
        setProgressText(text);
        if (progress >= 40) setStatus("generatingProof");
        if (progress >= 80) setStatus("verifyingLocal");
      };

      console.log("🔄 Tentando método principal...");
      let result;
      try {
        result = await generateProof(inputs, onProgress);
        console.log("✅ Método principal funcionou!");
      } catch (mainError) {
        // Corrigido: 'mainError' é do tipo 'unknown', então precisamos tratar antes de acessar 'message'
        let errorMsg = "";
        if (mainError instanceof Error) {
          errorMsg = mainError.message;
        } else if (typeof mainError === "string") {
          errorMsg = mainError;
        } else {
          errorMsg = JSON.stringify(mainError);
        }
        console.log("❌ Método principal falhou:", errorMsg);
        console.log("🔄 Tentando método alternativo...");
        result = await generateProofAlternative(inputs, onProgress);
        console.log("✅ Método alternativo funcionou!");
      }
      
      if (!result.isValid) {
        throw new Error("Verificação local falhou");
      }

      setProofResult(result);
      setStatus("done");
      setMessage("✅ Prova gerada e verificada localmente");
    } catch (e: any) {
      setStatus("error");
      setMessage(`❌ ${e.message || String(e)}`);
      console.error("💔 Erro completo:", e);
    }
  }

  async function verifyOnChain() {
    try {
      if (!proofResult) {
        throw new Error("Nenhuma prova disponível para verificação");
      }

      // placeholder: quando tiver o verificador Cairo deployado, faça o calldata aqui
      // e chame o RPC da StarkNet (starknet.js ou fetch JSON-RPC).
      setStatus("verifyingOnChain");
      // Exemplo (pseudocódigo):
      // const feltArray = proofB64ToFelts(proofResult.proofB64) // implementar: split em 31 bytes → felts
      // const calldata = [proofResult.publicInputs.threshold, proofResult.publicInputs.nonce, feltArray.length, ...feltArray]
      // const result = await starknetCall(VERIFIER_ADDR, "verify", calldata)
      // if (result === true) setMessage("✅ On-chain verified")
      setTimeout(() => {
        setStatus("done");
        setMessage("⚠️ On-chain placeholder (aguardando deploy do verificador Cairo)");
      }, 500);
    } catch (e: any) {
      setStatus("error");
      setMessage(`❌ ${e.message || String(e)}`);
    }
  }

  function regenerateNonce() {
    setNonce(ProofGenerationService.generateRandomNonce());
  }

  const handleNewProof = () => {
    if (walletAccount?.address) {
      try {
        localStorage.removeItem(walletAccount.address);
      } catch (error) {
        console.error("Error clearing localStorage", error);
      }
    }
    setStatus("idle");
    setMessage("");
    setProgress(0);
    setProgressText("");
    setProofResult(null);
    setProofData(null);
    setCurrentView("main");
    setNonce(ProofGenerationService.generateRandomNonce());
  };

  const handleProofGenerated = (data: any) => {
    setProofData(data);
    setCurrentView("success");
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const starknet = await connect({ 
        modalMode: "alwaysAsk", 
        modalTheme: "dark" 
      });
      
      if (starknet) {
        const provider = new RpcProvider({ 
          nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_8" 
        });
        const walletAccount = await WalletAccount.connect(provider, starknet);
        setWalletAccount(walletAccount);
        
        // Balance will be set manually or use default
        console.log("Wallet connected:", walletAccount.address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      setWalletAccount(null);
      setCurrentView("main");
      setProofData(null);
      // Clear saved data
      if (walletAccount?.address) {
        localStorage.removeItem(walletAccount.address);
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const handleViewRoadmap = () => {
    setCurrentView("roadmap");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
  };


  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case "roadmap":
        return <RoadmapScreen onBack={handleBackToMain} />;
      
      case "generate":
        return (
          <div className="space-y-5">
            <Card>
              <div className="text-base font-medium mb-3">Generate STRK Balance Proof</div>
              <div className="text-sm text-gray-400 leading-relaxed mb-5">
                Prove that you have more $STRK to join the Crypto Lar Telegram group.
                Generate a zero-knowledge proof of your $STRK balance without revealing the exact amount.
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Threshold (public):
                  </label>
                  <input 
                    value={threshold} 
                    onChange={e => setThreshold(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Nonce (public):
                  </label>
                  <div className="flex gap-2">
                    <input 
                      value={nonce} 
                      onChange={e => setNonce(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded p-3 text-white"
                    />
                    <Button 
                      onClick={regenerateNonce}
                      variant="secondary"
                      className="px-4 py-3"
                    >
                      Random
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Balance (private):
                  </label>
                  <input 
                    value={balance} 
                    onChange={e => setBalance(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={generateProofHandler}
                  disabled={status === "generatingProof" || status === "initializing"}
                >
                  {status === "generatingProof" || status === "initializing" ? "GENERATING..." : "GENERATE PROOF"}
                </Button>
                
                {proofResult && (
                  <Button 
                    onClick={verifyOnChain}
                    variant="secondary"
                    className="w-full"
                  >
                    Verify On-Chain (placeholder)
                  </Button>
                )}
              </div>

              {(status === "generatingProof" || status === "initializing") && (
                <div className="mt-5">
                  <div className="w-full h-0.5 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {progressText}
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-5 p-3 bg-red-900/20 border border-red-700 rounded">
                  <div className="text-red-400 text-sm font-mono">{message}</div>
                </div>
              )}
            </Card>

            {proofResult && (
              <Card>
                <details>
                  <summary className="cursor-pointer text-white font-medium mb-3">Proof Details</summary>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div><strong>Public Inputs:</strong></div>
                    <div>Threshold: {threshold}</div>
                    <div>Nonce: {nonce}</div>
                    <div>Public Inputs Array: [{proofResult.publicInputs.join(", ")}]</div>
                    <div><strong>Proof (base64):</strong></div>
                    <textarea 
                      readOnly 
                      value={proofResult.proofB64} 
                      className="w-full h-32 bg-gray-800 border border-gray-600 rounded p-3 text-white text-xs"
                    />
                  </div>
                </details>
              </Card>
            )}
          </div>
        );
      
      case "success":
        return proofData && walletAccount && (
          <SuccessSection 
            proofData={proofData} 
            onNewProof={handleNewProof} 
            walletAccount={walletAccount} 
          />
        );
      
      default: // "main"
        return (
          <div className="space-y-5">
            <WalletStatus 
              walletAccount={walletAccount} 
              onDisconnect={handleDisconnectWallet} 
            />
            <GenerateProofForm 
              onProofGenerated={handleProofGenerated}
              onVerifyOnChain={verifyOnChain}
              walletAccount={walletAccount}
              balance={balance}
              threshold={threshold}
              nonce={nonce}
              proofResult={proofResult}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
      <GameOfLife />
      
      <div className="relative z-10 max-w-md mx-auto p-5 min-h-screen flex flex-col">
        <Header />

        {!walletAccount ? (
          <LoginScreen 
            onConnectWallet={handleConnectWallet} 
            isConnecting={isConnecting}
            onViewRoadmap={handleViewRoadmap}
          />
        ) : (
          <div className="flex-1 flex flex-col gap-5">
            {/* Add roadmap button for connected users */}
            {currentView === "main" && (
              <div className="text-center">
                <Button 
                  onClick={handleViewRoadmap} 
                  variant="secondary" 
                  className="mb-4"
                >
                  VIEW ROADMAP
                </Button>
              </div>
            )}
            
            {renderCurrentView()}
          </div>
        )}
      </div>
    </div>
  );
}