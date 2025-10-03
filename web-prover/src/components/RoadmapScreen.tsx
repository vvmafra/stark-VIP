"use client"

import { Card } from "./Card"
import { Button } from "./Button"

interface RoadmapScreenProps {
    onBack: () => void
}

export const RoadmapScreen = ({ onBack }: RoadmapScreenProps) => {
    const roadmapItems = [
        {
            phase: "Phase 1 - Proof of Wealth",
            title: "ZK Status MVP",
            description: "Build the MVP fully on Starknet. Users prove they hold a minimum balance in STRK through a zero-knowledge proof, without exposing their wallet or full history. This version already generates the proof and provides access to exclusive Telegram groups. First demonstration of Starknet as the backbone for private status.",
            status: "completed",
            date: "Q3 2025"
        },
        {
            phase: "Phase 2 - SaaS Dashboard",
            title: "Starknet Status Console",
            description: "Launch a SaaS dashboard where communities can configure access rules (e.g., STRK balance, Starknet tokens, Starknet NFTs). No-code interface, but 100% Starknet-native.",
            status: "in-progress",
            date: "Q4 2025"
        },
        {
            phase: "Phase 3 - Community Integration",
            title: "Telegram & Discord on Starknet",
            description: "Enhanced native integration with Telegram and Discord bots, where all zero-knowledge proof verifications run on Starknet. Each verification triggers Starknet transactions, boosting network usage. Automated bot responses and advanced group management features.",
            status: "planned",
            date: "Q4 2025"
        },
        {
            phase: "Phase 4 - Starknet Badges",
            title: "ZK Badges & Reputation",
            description: "Create on-chain private status badges (wealth, holding time, NFT rarity). All badges are minted on Starknet and can be used cross-dapps as social identity.",
            status: "planned",
            date: "Q1 2026"
        },
        {
            phase: "Phase 5 - Ecosystem Expansion",
            title: "Starknet-Native Perks",
            description: "Brands, DAOs, and games already on Starknet can offer exclusive perks (discounts, invites, premium access) based on the badges and ZK proofs generated on-chain.",
            status: "planned",
            date: "Q2 2026"
        },
        {
            phase: "Phase 6 - Starknet Passport",
            title: "Universal Status Layer",
            description: "Build the ‘ZK Status Passport’, a cross-app identity aggregating status proofs (wealth, badges, achievements) natively on Starknet. Exportable to other chains, but with verification anchored on Starknet.",
            status: "planned",
            date: "Q3 2026"
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500"
            case "in-progress":
                return "bg-yellow-500"
            case "planned":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Completed"
            case "in-progress":
                return "In Progress"
            case "planned":
                return "Planned"
            default:
                return "Unknown"
        }
    }

    return (
        <div className="space-y-5">
            <div className="text-center">
                <Button onClick={onBack} className="mb-4">
                    ← BACK TO LOGIN
                </Button>
            </div>

            <div className="space-y-4">
                {roadmapItems.map((item, index) => (
                    <Card key={index}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 mb-1">{item.phase}</div>
                                <div className="text-lg font-bold text-white mb-2">{item.title}</div>
                                <div className="text-sm text-gray-400 mb-3">{item.description}</div>
                            </div>
                            <div className="flex flex-col items-end ml-4">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)} mb-2`}></div>
                                <div className="text-xs text-gray-500">{item.date}</div>
                                <div className="text-xs text-gray-400">{getStatusText(item.status)}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

        </div>
    )
}
