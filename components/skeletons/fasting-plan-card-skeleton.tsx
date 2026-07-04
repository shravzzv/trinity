import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../ui/card'
import { Separator } from '../ui/separator'
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
        <div className='flex flex-col items-center justify-center gap-4'>
          <Skeleton className='h-10 w-24 rounded-2xl' />
          <Skeleton className='h-4 w-[70%] rounded-2xl' />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className='flex flex-col items-stretch gap-4'>
        <p className='text-muted-foreground text-center text-sm font-medium'>
          Preferred schedule
        </p>

        <div className='flex w-full items-center justify-evenly'>
          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>Fasting starts</p>
            <Skeleton className='h-6 w-18' />
          </div>

          <Separator orientation='vertical' />

          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>Eating starts</p>
            <Skeleton className='h-6 w-18' />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
