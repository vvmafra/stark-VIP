"use client";

import { ProofTicket } from "./ProofTicket";

interface SuccessSectionProps {
  proofData: any;
  onNewProof: () => void;
  walletAccount: any;
}

export const SuccessSection = ({
  proofData,
  onNewProof,
  walletAccount,
}: SuccessSectionProps) => {
  const formatStarknetAddress = (address: string) => {
    try {
      const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
      return `0x${cleanAddress.slice(0, 4)}...${cleanAddress.slice(-4)}`;
    } catch (error) {
      return address;
    }
  };

  const walletAddress = walletAccount
    ? formatStarknetAddress(walletAccount.address)
    : "0x0000...0000";
  
  const proofUrl = proofData.txHash 
    ? `https://testnet.starkscan.co/extrinsic/${proofData.txHash}`
    : `https://testnet.starkscan.co/extrinsic/no-hash-available`;

  return (
    <div className="flex justify-center">
      <ProofTicket
        title="APPROVED"
        wallet={walletAddress}
        proofUrl={proofUrl}
        date={proofData.verifiedDate || new Date().toLocaleDateString()}
        onNewProof={onNewProof}
      />
    </div>
  );
};
