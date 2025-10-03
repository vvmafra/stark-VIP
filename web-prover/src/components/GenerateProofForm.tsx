"use client";

import { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { generateProof, generateProofAlternative } from "../services/generateProof";
import type { ProofInputs, ProgressCallback } from "../services/generateProof";
import type { WalletAccount } from "starknet";

interface GenerateProofFormProps {
  onProofGenerated: (proofData: any) => void;
  onVerifyOnChain?: () => void;
  walletAccount: WalletAccount | null;
  balance: string;
  threshold: string;
  nonce: string;
  proofResult?: any;
}

export const GenerateProofForm = ({
  onProofGenerated,
  onVerifyOnChain,
  walletAccount,
  balance,
  threshold,
  nonce,
  proofResult,
}: GenerateProofFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const [realBalance, setRealBalance] = useState(balance);

  // Get real balance from wallet
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAccount) {
        try {
          // Use the balance prop passed from parent instead of fetching
          setRealBalance(balance);
        } catch (error) {
          console.error("Error setting balance:", error);
        }
      }
    };

    fetchBalance();
  }, [walletAccount, balance]);

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    setProgress(0);
    setProgressText("Iniciando...");
    setError("");

    try {
      console.log("🔍 Inputs:", { threshold, nonce, balance: realBalance });
      
      const inputs: ProofInputs = {
        threshold: Number(threshold),   // u64 público
        nonce: nonce,                   // Field público (string)
        balance: Number(realBalance),   // u64 privado (saldo real)
        secret_nonce: nonce             // Field privado (deve ser igual ao nonce)
      };

      const onProgress: ProgressCallback = (progress, text) => {
        setProgress(progress);
        setProgressText(text);
      };

      console.log("🔄 Tentando método principal...");
      let result;
      try {
        result = await generateProof(inputs, onProgress);
        console.log("✅ Método principal funcionou!");
      } catch (mainError) {
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

      console.log("✅ Prova gerada com sucesso:", {
        isValid: result.isValid,
        publicInputs: result.publicInputs
      });

      // Criar dados da prova no formato esperado pelo frontend
      const proofData = {
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
        verified: result.isValid,
        message: result.isValid 
          ? "STRK balance proof verified successfully" 
          : "Proof verification failed",
        verifiedDate: new Date().toISOString().split("T")[0],
        proofType: "STRK_BALANCE",
        balance: `${realBalance}+ STRK`,
        // Dados reais da prova ZK
        zkProof: {
          proofB64: result.proofB64,
          publicInputs: result.publicInputs,
          isValid: result.isValid,
          threshold,
          nonce: result.publicInputs[1]?.toString() || "unknown"
        }
      };

      // Save proof data to localStorage
      if (walletAccount?.address) {
        try {
          localStorage.setItem(walletAccount.address, proofData.txHash);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      }

      setIsGenerating(false);
      onProofGenerated(proofData);
    } catch (error: any) {
      console.error("💔 Erro na geração de prova:", error);
      setError(error.message || "An unexpected error occurred during proof generation");
      setIsGenerating(false);
    }
  };



  return (
    <Card>
      <div className="text-base font-medium mb-3">Generate STRK Balance Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Prove that you have more $STRK to join the Crypto Lar Telegram group.
        Generate a zero-knowledge proof of your $STRK balance without revealing the exact amount.
      </div>
      
      {walletAccount && (
        <div className="mb-4 p-3 bg-gray-800/50 border border-gray-600 rounded">
          <div className="text-xs text-gray-400 mb-1">Current Balance</div>
          <div className="text-white font-mono text-sm">
            {realBalance} STRK
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleGenerateProof}
          disabled={isGenerating}
        >
          {isGenerating ? "GENERATING..." : "GENERATE PROOF"}
        </Button>

        {proofResult && onVerifyOnChain && (
          <Button 
            onClick={onVerifyOnChain}
            variant="secondary"
            className="w-full"
          >
            Verify On-Chain (placeholder)
          </Button>
        )}
      </div>

      {isGenerating && (
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

      {error && (
        <div className="mt-5 p-3 bg-red-900/20 border border-red-700 rounded">
          <div className="text-red-400 text-sm font-mono">Error: {error}</div>
        </div>
      )}
    </Card>
  );
};
