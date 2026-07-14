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

export default function WeightStatisticsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight statistics</CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-32 md:w-56' />
        </CardDescription>

        <CardAction className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 rounded-full md:w-24 md:rounded-2xl' />
          <Skeleton className='h-9 w-20 rounded-2xl md:w-24' />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col items-center space-y-1 text-center'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-10 w-36' />
        </div>

        <div className='h-[35vh]'>
          <svg
            className='h-full w-full animate-pulse'
            viewBox='0 0 100 40'
            preserveAspectRatio='none'
          >
            <path
              d='M0 30 C10 20, 20 18, 30 22 S50 30, 60 20 S80 8, 90 12 S98 14, 100 10 L100 40 L0 40 Z'
              className='fill-muted'
            />
          </svg>
        </div>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        <div className='flex w-full items-center justify-evenly'>
          <Skeleton className='h-4 w-36' />
        </div>

        <div className='flex w-full flex-wrap items-center justify-evenly'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
        </div>

        <div className='flex items-center justify-center'>
          <Skeleton className='h-9 w-28 rounded-2xl' />
        </div>
      </CardFooter>
    </Card>
  )
}
