import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function FastingPlanCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting plan</CardTitle>

        <CardAction>
          <Skeleton className='h-8 w-20' />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-24 rounded-2xl' />
          <Skeleton className='h-4 w-[70%] rounded-2xl' />
        </div>
      </CardContent>
    </Card>
  )
}
