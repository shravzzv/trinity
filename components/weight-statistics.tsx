'use client'

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts'
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
} from './ui/select'
import {
  ArrowDownRight,
  MapPin,
  PartyPopper,
  Pen,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Button } from './ui/button'
import type { WeightStatisticsCadence } from '@/types/weight'

const chartData = [
  { date: 'Mon', weight: 61.8 },
  { date: 'Tue', weight: 51.6 },
  { date: 'Wed', weight: 61.7 },
  { date: 'Thu', weight: 51.4 },
  { date: 'Fri', weight: 61.2 },
  { date: 'Sat', weight: 51.3 },
  { date: 'Sun', weight: 61.0 },
]

const chartConfig = {
  weights: {
    label: 'Weight',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export default function WeightStatistics() {
  const [cadence, setCadence] = useState<WeightStatisticsCadence>('week')

  const hasTargetReached = false

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight statistics</CardTitle>

        <CardDescription className='flex items-center gap-2'>
          {hasTargetReached ? (
            <>
              <PartyPopper className='size-4 shrink-0' />
              <span>Target 58 kg reached</span>
            </>
          ) : (
            <>
              <Target className='size-4 shrink-0' />
              <span>1.4 kg remaining to reach 58 kg</span>
            </>
          )}
        </CardDescription>

        <CardAction className='flex items-center gap-2'>
          <Button className='size-8 p-0 md:w-auto md:gap-1.5 md:px-3'>
            <Plus />
            <span className='hidden md:inline'>Add</span>
          </Button>

          <Select
            value={cadence}
            onValueChange={(v) => setCadence(v as WeightStatisticsCadence)}
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
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              dataKey='weight'
              type='natural'
              fill='var(--color-weights)'
              fillOpacity={0.35}
              stroke='var(--color-weights)'
              strokeWidth={2}
              dot={
                cadence === 'week'
                  ? {
                      r: 4,
                      strokeWidth: 2,
                      fill: 'var(--background)',
                    }
                  : false
              }
            >
              {cadence === 'week' && (
                <LabelList
                  dataKey='weight'
                  position='top'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                  formatter={(value) =>
                    typeof value === 'number' ? value.toFixed(1) : value
                  }
                />
              )}
            </Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        <div className='flex w-full flex-wrap items-center justify-evenly text-sm'>
          <div className='flex items-center gap-2'>
            <MapPin className='size-4' />
            <span>60.1 kg</span>
          </div>

          <div className='flex items-center gap-2'>
            <ArrowDownRight className='size-4' />
            0.7 kg lost {cadence === 'all' ? 'all time' : `this ${cadence}`}
          </div>
        </div>

        <div className='flex w-full flex-wrap items-center justify-evenly text-sm'>
          <div className='flex items-center gap-2'>
            <TrendingDown className='size-4' />
            60.7 kg lowest
          </div>

          <div className='flex items-center gap-2'>
            <TrendingUp className='size-4' />
            80.4 kg highest
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-2'>
          <Button variant='secondary'>
            <Pen />
            Edit weights
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
