import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Pen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function FastingPlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting plan</CardTitle>

        <CardAction>
          <Button variant='outline' size='sm'>
            <Pen />
            Edit
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='space-y-2'>
          <Badge className='bg-sky-50 px-4 py-4 text-xl text-sky-700 dark:bg-sky-950 dark:text-sky-300'>
            OMAD
          </Badge>

          <p className='text-muted-foreground text-sm'>
            23 hours fasting • 1 hour eating
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
