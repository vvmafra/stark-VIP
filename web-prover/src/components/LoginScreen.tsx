"use client"

import { Button } from "./Button"

interface LoginScreenProps {
  onConnectWallet: () => void
  isConnecting: boolean
  onViewRoadmap: () => void
}

export const LoginScreen = ({ onConnectWallet, isConnecting, onViewRoadmap }: LoginScreenProps) => {
  return (
    <div className="text-center">
      <div className="text-xl font-bold mb-4 text-white">Verify Your Starknet Balance</div>
      <div className="text-gray-400 mb-6">
        This app verifies if you have STRK balance on Starknet to grant access to our exclusive Telegram group.
        Connect your wallet to check your eligibility.
      </div>
      
      <div className="space-y-3">
        <Button onClick={onConnectWallet} disabled={isConnecting} className="w-full">
          {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
        </Button>
        
        <Button onClick={onViewRoadmap} variant="secondary" className="w-full">
          VIEW ROADMAP
        </Button>
      </div>
    </div>
  )
}
