"use client"

import { OfflineQRCode } from "./OfflineQRCode"
import { useState } from "react"

interface ProofTicketProps {
  title: string
  wallet: string
  proofUrl: string
  date: string
  onNewProof: () => void
}

export const ProofTicket = ({ title, wallet, proofUrl, date, onNewProof }: ProofTicketProps) => {
  const [copied, setCopied] = useState(false)
  const telegramGroupLink = "https://t.me/c/cryptolarbrasil/1"

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    const cleanAddress = address.startsWith("0x") ? address : `0x${address}`
    return `${cleanAddress.slice(0, 8)}...${cleanAddress.slice(-6)}`
  }

  const checkProof = () => {
    window.open(proofUrl, "_blank")
  }

  const copyGroupLink = async () => {
    try {
      await navigator.clipboard.writeText(telegramGroupLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openTelegramGroup = () => {
    window.open(telegramGroupLink, "_blank")
  }

  const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )

  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  const TelegramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  )

  return (
    <div className="relative max-w-md w-full">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Dark header - minimal design */}
        <div className="bg-gray-900 px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-gray-400 text-xs font-semibold tracking-widest mb-1">StarkVIP-Proof</div>
              <div className="text-white text-2xl font-bold tracking-tight">Access Pass</div>
            </div>
            <div className="bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <div className="text-white text-xs font-bold tracking-wide">VERIFIED</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-gray-400 text-xs font-medium mb-2">DESTINATION</div>
            <div className="flex items-center gap-3">
              <div className="text-white text-3xl font-bold tracking-tight">CryptoLar</div>
              <div className="text-gray-500 text-xl">→</div>
              <div className="text-gray-400 text-sm font-medium">Telegram</div>
            </div>
          </div>

          {/* Wallet info in header */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-700/50">
            <div className="text-gray-400 text-xs font-medium mb-1">Wallet Address</div>
            <div className="text-white font-mono text-sm font-semibold tracking-tight">{truncateAddress(wallet)}</div>
          </div>
        </div>

        {/* White card body - like airline pass */}
        <div className="bg-white px-6 py-6">
          {/* QR Code and verification info */}
          <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <OfflineQRCode text={proofUrl} size={120} />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
              <div>
                <div className="text-gray-500 text-xs font-semibold tracking-wide mb-1">VERIFICATION</div>
                <div className="text-gray-900 text-sm font-bold">Group Access</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-semibold tracking-wide mb-1">DATE</div>
                <div className="text-gray-900 text-sm font-bold">{date}</div>
              </div>
            </div>
          </div>

          {/* Action buttons section */}
          <div className="space-y-3">
            <div>
              <div className="text-gray-500 text-xs font-semibold tracking-wide mb-2">ACTIONS</div>

              {/* Check Proof */}
              <button
                onClick={checkProof}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between transition-all duration-200 mb-2"
              >
                <span>Check Proof on Explorer</span>
                <ExternalLinkIcon />
              </button>

              {/* Copy Link */}
              <button
                onClick={copyGroupLink}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between transition-all duration-200 mb-2"
              >
                <span>{copied ? "Link Copied!" : "Copy Telegram Link"}</span>
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>

              <button
                onClick={openTelegramGroup}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
              >
                <TelegramIcon />
                Enter Telegram Group
              </button>
            </div>
          </div>
        </div>

        
      </div>

      {/* Generate Another Proof */}
      <button
        onClick={onNewProof}
        className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border border-gray-200"
      >
        Generate Another Proof
      </button>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-400">StarkVIP-Proof</p>
      </div>
    </div>
  )
}
