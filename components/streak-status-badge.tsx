import type { StreakStatus } from '@/types/gamification'
import { Badge } from './ui/badge'
import { Anchor, CheckCircle, CircleAlert } from 'lucide-react'

interface StreakStatusBadgeProps {
  streakStatus: StreakStatus
}

export default function StreakStatusBadge({
  streakStatus,
}: StreakStatusBadgeProps) {
  switch (streakStatus) {
    case 'completed': {
      return (
        <Badge className='bg-green-600'>
          <CheckCircle /> Completed
        </Badge>
      )
    }

    case 'missed': {
      return (
        <Badge variant='destructive'>
          <CircleAlert /> Missed
        </Badge>
      )
    }

    case 'anchored': {
      return (
        <Badge>
          <Anchor /> Anchored
        </Badge>
      )
    }
  }
}
