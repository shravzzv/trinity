import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function FastingTimerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardDescription>
          <Skeleton className='h-5 w-18' />
        </CardDescription>

        <CardAction>
          <Skeleton className='h-8 w-24' />
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-10 w-32'></Skeleton>
          <Skeleton className='h-4 w-28'></Skeleton>
        </div>

        <Skeleton className='h-2.5 w-full' />
      </CardContent>
    </Card>
  )
}
