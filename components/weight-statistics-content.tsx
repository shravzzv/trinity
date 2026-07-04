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
import { useEffect, useState } from 'react'
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
  ArrowUpRight,
  MapPin,
  PartyPopper,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Button } from './ui/button'
import type { WeightEntry, WeightStatisticsCadence } from '@/types/weight'
import { WEIGHT_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'
import {
  getTargetProgress,
  getWeightStatistics,
  formatWeight,
} from '@/lib/weight'
import WeightDialog from './weight-dialog'
import { toast } from 'sonner'
import EditWeightsSheet from './edit-weights-sheet'

const chartConfig = {
  weights: {
    label: 'Weight',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

interface WeightStatisticsContentProps {
  entries: WeightEntry[]
  targetWeight: number | null
  addWeight: (weightKg: number, recordedAt: Date) => Promise<void>
  updateWeight: (updatedWeightEntry: WeightEntry) => Promise<void>
  deleteWeight: (id: string) => Promise<void>
}

export default function WeightStatisticsContent({
  entries,
  addWeight,
  targetWeight,
  updateWeight,
  deleteWeight,
}: WeightStatisticsContentProps) {
  const [cadence, setCadence] = useState<WeightStatisticsCadence>('week')

  useEffect(() => {
    const hydrateCadence = () => {
      try {
        const saved = localStorage.getItem(
          WEIGHT_STATISTICS_CADENCE_STORAGE_KEY,
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
        console.error('Hydrating weight statistics cadence failed', error)
        localStorage.removeItem(WEIGHT_STATISTICS_CADENCE_STORAGE_KEY)
      }
    }

    hydrateCadence()
  }, [])

  useEffect(() => {
    const syncCadence = () => {
      localStorage.setItem(WEIGHT_STATISTICS_CADENCE_STORAGE_KEY, cadence)
    }

    syncCadence()
  }, [cadence])

  const {
    filteredEntries,
    currentWeight,
    highestWeight,
    lowestWeight,
    weightChange,
  } = getWeightStatistics(entries, cadence)

  const targetProgress = getTargetProgress(currentWeight, targetWeight)

  const chartData = filteredEntries.map((entry) => ({
    date: new Date(entry.recordedAt).toLocaleDateString(
      'en-US',
      cadence === 'week'
        ? { weekday: 'short' }
        : cadence === 'all'
          ? { day: 'numeric', month: 'short', year: 'numeric' }
          : { day: 'numeric', month: 'short' },
    ),
    weightKg: entry.weightKg,
  }))

  const handleAddWeight = async (weightKg: number, recordedAt: Date) => {
    try {
      await addWeight(weightKg, recordedAt)
      toast.success('Weight added')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight statistics</CardTitle>

        <CardDescription className='flex items-center gap-2'>
          {targetProgress ? (
            <>
              {targetProgress.reached ? (
                <PartyPopper className='size-4 shrink-0' />
              ) : (
                <Target className='size-4 shrink-0' />
              )}

              <span className='flex-1'>
                {targetProgress.reached
                  ? `Target ${targetWeight!.toFixed(1)} kg reached!`
                  : `${targetProgress.remainingWeight.toFixed(1)} kg remaining to reach ${targetWeight} kg.`}
              </span>
            </>
          ) : (
            <>
              <Target className='size-4 shrink-0' />
              <span className='flex-1'>
                Set a target weight to track your progress.
              </span>
            </>
          )}
        </CardDescription>

        <CardAction className='flex items-center gap-2'>
          <WeightDialog
            dialogTitle='Add weight'
            dialogDescription='Record your body weight for a specific date. You can edit or remove this entry later.'
            submitLabel='Save'
            onSave={handleAddWeight}
          >
            <Button className='size-8 p-0 md:w-auto md:gap-1.5 md:px-3'>
              <Plus />
              <span className='hidden md:inline'>Add</span>
            </Button>
          </WeightDialog>

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
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={12}
              interval='preserveEnd'
              padding={{ left: 8, right: 8 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              dataKey='weightKg'
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
                  dataKey='weightKg'
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
            <span>{formatWeight(currentWeight)}</span>
          </div>

          <div className='flex items-center gap-2'>
            {weightChange === null ? (
              <>
                <ArrowDownRight className='size-4 opacity-40' />
                <span>—</span>
              </>
            ) : (
              <>
                {weightChange < 0 ? (
                  <ArrowDownRight className='size-4' />
                ) : (
                  <ArrowUpRight className='size-4' />
                )}

                <span>
                  {Math.abs(weightChange).toFixed(1)} kg
                  {weightChange < 0 ? ' lost' : ' gained'}{' '}
                  {cadence === 'all' ? 'all time' : `this ${cadence}`}
                </span>
              </>
            )}
          </div>
        </div>

        <div className='flex w-full flex-wrap items-center justify-evenly text-sm'>
          <div className='flex items-center gap-2'>
            <TrendingDown className='size-4' />
            {formatWeight(lowestWeight)} lowest
          </div>

          <div className='flex items-center gap-2'>
            <TrendingUp className='size-4' />
            {formatWeight(highestWeight)} highest
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-2'>
          <EditWeightsSheet
            weightEntries={entries}
            updateWeight={updateWeight}
            deleteWeight={deleteWeight}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
