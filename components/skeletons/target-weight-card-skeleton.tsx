import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function TargetWeightCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight target</CardTitle>
        <CardAction>
          <Skeleton className='h-9 w-24 rounded-2xl' />
        </CardAction>
      </CardHeader>

      <CardContent>
        <Skeleton className='h-11 w-32 rounded-xl' />
      </CardContent>
    </Card>
  )
}
