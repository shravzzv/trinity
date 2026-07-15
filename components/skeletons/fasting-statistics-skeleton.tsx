import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function FastingStatisticsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting statistics</CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-32 md:w-56' />
        </CardDescription>

        <CardAction>
          <Skeleton className='h-9 w-24 rounded-2xl' />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='flex h-[30vh] items-end justify-around gap-2'>
          <Skeleton className='h-16 flex-1 rounded-lg' />
          <Skeleton className='h-28 flex-1 rounded-lg' />
          <Skeleton className='h-20 flex-1 rounded-lg' />
          <Skeleton className='h-36 flex-1 rounded-lg' />
          <Skeleton className='h-24 flex-1 rounded-lg' />
          <Skeleton className='h-40 flex-1 rounded-lg' />
          <Skeleton className='h-30 flex-1 rounded-lg' />
        </div>

        <div className='flex items-center justify-center gap-5 py-2 text-xs'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='size-3 rounded-full' />
              <Skeleton className='h-3 w-14 md:w-16' />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        <div className='flex w-full flex-wrap items-center justify-evenly gap-6'>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-4 rounded-full' />
            <Skeleton className='h-4 w-16' />
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='size-4 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='size-4 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-2'>
          <Skeleton className='h-9 w-24 rounded-2xl' />
          <Skeleton className='h-9 w-24 rounded-2xl' />
        </div>
      </CardFooter>
    </Card>
  )
}
