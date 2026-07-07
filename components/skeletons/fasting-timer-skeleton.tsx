import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

export default function FastingTimerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardAction>
          <Skeleton className='h-8 w-24' />
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <Skeleton className='mx-auto h-4 w-24' />
        <Skeleton className='mx-auto h-12 w-38' />
        <Skeleton className='mx-auto h-8 w-24' />
        <Skeleton className='h-2.5 w-full' />
      </CardContent>

      <Separator />

      <CardFooter className='flex flex-col items-stretch gap-4'>
        <div className='flex w-full items-center justify-evenly'>
          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>Started</p>
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-4 w-8' />
          </div>

          <Separator orientation='vertical' />

          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>Ends</p>
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-4 w-8' />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
