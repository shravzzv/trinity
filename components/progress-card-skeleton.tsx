import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function ProgressCardSkeleton() {
  return (
    <Card className='py-2'>
      <CardContent className='grid grid-cols-3 justify-center gap-2 px-2'>
        <Skeleton className='h-16 rounded-2xl' />
        <Skeleton className='h-16 rounded-2xl' />
        <Skeleton className='h-16 rounded-2xl' />
      </CardContent>
    </Card>
  )
}
