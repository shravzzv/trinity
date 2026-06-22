'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock3, Flame, Pen, Trophy } from 'lucide-react'
import { Fast } from '@/types/fasting'
import { getFastDurationHours } from '@/lib/fasting'
import { Button } from './ui/button'
import AddFastDialog from './add-fast-dialog'

type Cadence = 'week' | 'month' | 'year' | 'all'

interface FastingStatisticsProps {
  fasts: Fast[]
}

export default function FastingStatistics({ fasts }: FastingStatisticsProps) {
  const [cadence, setCadence] = useState<Cadence>('week')

  const filteredFasts = fasts.filter((fast) => {
    if (cadence === 'all') return true

    const startedAt = new Date(fast.startedAt)
    const cutoff = new Date()

    switch (cadence) {
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7)
        break

      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1)
        break

      case 'year':
        cutoff.setFullYear(cutoff.getFullYear() - 1)
        break
    }

    return startedAt >= cutoff
  })

  const firstFast = filteredFasts[0]
  const lastFast = filteredFasts.at(-1)

  const dateRange: string =
    firstFast && lastFast
      ? `${new Date(firstFast.startedAt).toLocaleDateString('en-US', { dateStyle: 'long' })} - ${new Date(
          lastFast.startedAt,
        ).toLocaleDateString('en-US', { dateStyle: 'long' })}`
      : 'No fasting data available.'

  const averageFastHours =
    filteredFasts.length === 0
      ? 0
      : filteredFasts.reduce((sum, fast) => {
          return sum + getFastDurationHours(fast)
        }, 0) / filteredFasts.length

  const longestFastHours =
    filteredFasts.length === 0
      ? 0
      : Math.max(...filteredFasts.map((fast) => getFastDurationHours(fast)))

  const chartData = filteredFasts.map((fast) => ({
    date: new Date(fast.startedAt).toLocaleDateString(
      'en-US',
      cadence === 'week'
        ? { weekday: 'short' }
        : cadence === 'all'
          ? { day: 'numeric', month: 'short', year: 'numeric' }
          : { day: 'numeric', month: 'short' },
    ),
    length: getFastDurationHours(fast).toFixed(),
  }))

  const chartConfig = {
    fasts: {
      label: 'Fasts',
      color: 'var(--chart-3)',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting statistics</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
        <CardAction>
          <Select
            value={cadence}
            onValueChange={(v) => setCadence(v as Cadence)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Cadence' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectGroup>
                <SelectItem value='week'>Week</SelectItem>
                <SelectItem value='month'>Month</SelectItem>
                <SelectItem value='year'>Year</SelectItem>
                <SelectItem value='all'>All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-[25vh] w-full'>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='length' fill='var(--color-fasts)' radius={10}>
              {cadence === 'week' && (
                <LabelList
                  position='top'
                  offset={6}
                  className='fill-foreground'
                  fontSize={12}
                />
              )}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        <div className='flex w-full flex-wrap items-center justify-evenly gap-2 text-sm'>
          <div className='flex items-center gap-2'>
            <Flame className='size-4' />
            <span>
              {filteredFasts.length} fast{filteredFasts.length !== 1 && 's'}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Clock3 className='size-4' />
            <span>{averageFastHours.toFixed(1)}h average</span>
          </div>

          <div className='flex items-center gap-2'>
            <Trophy className='size-4' />
            <span>{longestFastHours.toFixed(1)}h longest</span>
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-2'>
          <Button variant='secondary'>
            <Pen />
            Edit fasts
          </Button>

          <AddFastDialog />
        </div>
      </CardFooter>
    </Card>
  )
}
