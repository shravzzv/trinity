'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
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
import { Clock3, Flame, Plus, Trophy } from 'lucide-react'
import type {
  Fast,
  FastingPlanId,
  FastingStatisticsCadence,
  PreferredFastStartTime,
} from '@/types/fasting'
import {
  filterFastsByCadence,
  getFastDurationHours,
  getInitialFastDialogTimes,
} from '@/lib/fasting'
import EditFastsSheet from './edit-fasts-sheet'
import FastDialog from './fast-dialog'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { FASTING_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'
import { Button } from './ui/button'
import { getStreakStatus, getStreakStatusChartColor } from '@/lib/gamification'

interface FastingStatisticsContentProps {
  fasts: Fast[]
  planId: FastingPlanId | null
  addFast: (fast: Fast) => Promise<void>
  deleteFast: (id: string) => Promise<void>
  updateFast: (updatedFast: Fast) => Promise<void>
  preferredFastStartTime: PreferredFastStartTime | null
}

const chartConfig = {
  fasts: {
    label: 'Fasts',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export default function FastingStatisticsContent({
  fasts,
  planId,
  addFast,
  deleteFast,
  updateFast,
  preferredFastStartTime,
}: FastingStatisticsContentProps) {
  const [cadence, setCadence] = useState<FastingStatisticsCadence>('week')

  useEffect(() => {
    const hydrateCadence = () => {
      try {
        const saved = localStorage.getItem(
          FASTING_STATISTICS_CADENCE_STORAGE_KEY,
        )

        if (
          saved === 'week' ||
          saved === 'month' ||
          saved === 'year' ||
          saved === 'all'
        ) {
          setCadence(saved)
        }
      } catch (error) {
        console.error('Hydrating fasting statistics cadence failed', error)
        localStorage.removeItem(FASTING_STATISTICS_CADENCE_STORAGE_KEY)
      }
    }

    hydrateCadence()
  }, [])

  useEffect(() => {
    const syncCadence = () => {
      localStorage.setItem(FASTING_STATISTICS_CADENCE_STORAGE_KEY, cadence)
    }

    syncCadence()
  }, [cadence])

  const filteredFasts = filterFastsByCadence(fasts, cadence)
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
    length: Number(getFastDurationHours(fast).toFixed(1)),
    streakStatus: fast.streakStatus,
  }))

  const handleAddFast = async (startedAt: Date, endedAt: Date) => {
    if (!planId) return

    try {
      await addFast({
        id: uuidv4(),
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        planId,
        streakStatus: getStreakStatus({
          planId,
          startedAt,
          endedAt,
          isAnchored: false,
        }),
      })
      toast.success('Fast added')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const initialFastDialogTimes = getInitialFastDialogTimes({
    planId,
    preferredFastStartTime,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting statistics</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
        <CardAction>
          <Select
            value={cadence}
            onValueChange={(v) => setCadence(v as FastingStatisticsCadence)}
          >
            <SelectTrigger aria-label='Fasting statistics cadence.'>
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
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null

                const data = payload[0].payload

                return (
                  <div className='bg-background rounded-lg border px-3 py-2 shadow-lg'>
                    <p className='font-medium'>{data.date}</p>

                    <p className='text-muted-foreground text-xs'>
                      {data.length.toFixed(1)} hours
                    </p>
                    <div className='mt-2 flex items-center gap-2'>
                      <div
                        className='size-2 rounded-full'
                        style={{
                          background: getStreakStatusChartColor(
                            data.streakStatus,
                          ),
                        }}
                      />

                      <span className='text-xs capitalize'>
                        {data.streakStatus}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            <Bar
              dataKey='length'
              shape={(props) => {
                const { x, y, width, height, payload } = props

                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={10}
                    ry={10}
                    fill={getStreakStatusChartColor(payload.streakStatus)}
                  />
                )
              }}
            >
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

        <FastingStatisticsChartLegend />
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
          <EditFastsSheet
            fasts={fasts}
            deleteFast={deleteFast}
            updateFast={updateFast}
          />

          <FastDialog
            dialogTitle='Add past fast'
            dialogDescription='Manually add a completed fast to your fasting history. Choose a start and end time in the past. To keep your history accurate, fasts cannot overlap with existing entries.'
            existingFasts={fasts}
            onSubmit={handleAddFast}
            submitLabel='Add fast'
            initialStartedAt={initialFastDialogTimes?.startedAt ?? undefined}
            initialEndedAt={initialFastDialogTimes?.endedAt ?? undefined}
          >
            <Button variant='secondary'>
              <Plus />
              Add fast
            </Button>
          </FastDialog>
        </div>
      </CardFooter>
    </Card>
  )
}

const FastingStatisticsChartLegend = () => {
  return (
    <div className='flex items-center justify-center gap-5 py-2 text-xs'>
      <div className='flex items-center gap-2'>
        <div className='bg-primary size-3 rounded-full' />
        <span>Completed</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='bg-destructive size-3 rounded-full' />
        Missed
      </div>
      <div className='flex items-center gap-2'>
        <div className='bg-anchor size-3 rounded-full' />
        Anchored
      </div>
    </div>
  )
}
