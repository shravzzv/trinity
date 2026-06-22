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
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock3, Flame, Trophy } from 'lucide-react'

interface Fast {
  id: string
  startedAt: string
  endedAt: string
}
type Cadence = 'week' | 'month' | 'year' | 'all'

const generateFakeFasts = (count: number): Fast[] => {
  const fasts: Fast[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const daysAgo = count - i

    const startedAt = new Date(now)
    startedAt.setDate(now.getDate() - daysAgo)
    startedAt.setHours(20, 0, 0, 0)

    const durationHours = 16 + Math.floor(Math.random() * 8)

    const endedAt = new Date(startedAt)
    endedAt.setHours(endedAt.getHours() + durationHours)

    fasts.push({
      id: `fast-${i + 1}`,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
    })
  }

  return fasts
}

const getFastDurationHours = (fast: Fast) =>
  (new Date(fast.endedAt).getTime() - new Date(fast.startedAt).getTime()) /
  (1000 * 60 * 60)

export default function FastingStatistics() {
  const [cadence, setCadence] = useState<Cadence>('week')
  const [fasts, setFasts] = useState<Fast[]>([])

  useEffect(() => {
    const initialize = () => {
      setFasts(
        generateFakeFasts(10).sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
        ),
      )
    }

    initialize()
  }, [])

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

  const dateRange =
    firstFast && lastFast
      ? `${new Date(firstFast.startedAt).toLocaleDateString('en-US', { dateStyle: 'long' })} - ${new Date(
          lastFast.startedAt,
        ).toLocaleDateString('en-US', { dateStyle: 'long' })}`
      : 'No fasting data'

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
    length: getFastDurationHours(fast),
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
                  offset={12}
                  className='fill-foreground'
                  fontSize={12}
                />
              )}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex flex-wrap items-center justify-evenly gap-2 text-sm'>
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
      </CardFooter>
    </Card>
  )
}
