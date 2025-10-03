import { useState } from "react";
import { generateProof, generateProofAlternative, ProofGenerationService } from "./services/generateProof";
import type { ProofInputs, ProofResult, ProgressCallback } from "./services/generateProof";

type Status =
  | "idle" | "initializing" | "generatingProof" 
  | "verifyingLocal" | "verifyingOnChain" | "done" | "error";

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("");
  const [threshold, setThreshold] = useState<string>("100"); // público
  const [nonce, setNonce] = useState<string>(() => ProofGenerationService.generateRandomNonce()); // público (client-side)
  const [balance, setBalance] = useState<string>("250");     // privado
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);

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

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2>ZK VIP – Web Prover (No API)</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Threshold (public):{" "}
          <input value={threshold} onChange={e => setThreshold(e.target.value)} />
        </label>
        <label>
          Nonce (public):{" "}
          <input value={nonce} onChange={e => setNonce(e.target.value)} style={{ width: "80%" }} />
          <button onClick={regenerateNonce} style={{ marginLeft: 8 }}>random</button>
        </label>
        <label>
          Balance (private):{" "}
          <input value={balance} onChange={e => setBalance(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={generateProofHandler} disabled={status === "generatingProof" || status === "initializing"}>
            Generate Proof
          </button>
          <button onClick={verifyOnChain} disabled={!proofResult}>
            Verify On-Chain (placeholder)
          </button>
        </div>

        <div>
          <strong>Status:</strong> {status}
        </div>
        {(status === "generatingProof" || status === "initializing") && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>Progresso:</strong> {progress}% - {progressText}
            </div>
            <div style={{ 
              width: "100%", 
              height: 8, 
              backgroundColor: "#e0e0e0", 
              borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
        )}
        {message && <div>{message}</div>}
        {proofResult && (
          <details>
            <summary>Proof Details</summary>
            <div style={{ marginTop: 8 }}>
              <div><strong>Public Inputs:</strong></div>
              <div>Threshold: {threshold}</div>
              <div>Nonce: {nonce}</div>
              <div>Public Inputs Array: [{proofResult.publicInputs.join(", ")}]</div>
              <div><strong>Proof (base64):</strong></div>
              <textarea readOnly value={proofResult.proofB64} style={{ width: "100%", height: 120 }} />
            </div>
          </details>
        )}
        <small>
          ⚠️ Sem backend/API: o challenge (threshold/nonce) é gerado aqui no cliente.
          Depois, basta portar este código para o Telegram WebApp e trocar o
          <em>verifyOnChain</em> para chamar o contrato verificador Cairo.
        </small>
      </div>
    </div>
  );
}