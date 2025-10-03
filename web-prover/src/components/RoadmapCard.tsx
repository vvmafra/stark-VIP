"use client"

import { Card } from "./Card"
import { Button } from "./Button"

interface RoadmapCardProps {
  onViewRoadmap: () => void
}

export const RoadmapCard = ({ onViewRoadmap }: RoadmapCardProps) => {
  return (
    <Card>
      <div className="text-center">
        <div className="text-lg font-bold mb-3 text-white">Roadmap Starknet Status</div>
        <div className="text-sm text-gray-400 mb-4">
          Discover our development journey and future plans for StarkVIP-Proof.
        </div>
        <Button onClick={onViewRoadmap} className="w-full">
          VIEW ROADMAP
        </Button>
      </div>
    </Card>
  )
}
