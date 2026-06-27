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
  ChevronDownIcon,
  MapPin,
  PartyPopper,
  Pen,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Button } from './ui/button'
import type { WeightEntry, WeightStatisticsCadence } from '@/types/weight'
import { WEIGHT_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { MAX_TARGET_WEIGHT_KG, MIN_TARGET_WEIGHT_KG } from '@/constants/weight'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { filterWeightEntriesByCadence } from '@/lib/weight'

const chartConfig = {
  weights: {
    label: 'Weight',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

interface WeightStatisticsProps {
  isLoading: boolean
  entries: WeightEntry[]
  targetWeight: number | null
  addWeight: (weightKg: number, recordedAt: Date) => void
}

export default function WeightStatistics({
  isLoading,
  addWeight,
  entries,
  targetWeight,
}: WeightStatisticsProps) {
  const [recordedAt, setRecordedAt] = useState(new Date())
  const [weight, setWeight] = useState<number | null>(null)
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false)
  const [cadence, setCadence] = useState<WeightStatisticsCadence>('week')
  const [isRecordedAtPopoverOpen, setIsRecordedAtPopoverOpen] = useState(false)

  const isValidWeight =
    weight !== null &&
    Number.isFinite(weight) &&
    weight >= MIN_TARGET_WEIGHT_KG &&
    weight <= MAX_TARGET_WEIGHT_KG

  const hasInvalidWeight = weight !== null && !isValidWeight

  const chartData = filterWeightEntriesByCadence(entries, cadence).map(
    (entry) => ({
      date: format(new Date(entry.recordedAt), 'MMM d'),
      weightKg: entry.weightKg,
    }),
  )

  const currentWeight = entries.at(-1)?.weightKg

  const handleSave = () => {
    if (!isValidWeight || weight === null) return

    addWeight(weight, recordedAt)
    setIsWeightDialogOpen(false)
    toast.success('Weight added')
  }

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

  const hasTargetReached = false

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight statistics</CardTitle>

        <CardDescription className='flex items-center gap-2'>
          {hasTargetReached ? (
            <>
              <PartyPopper className='size-4 shrink-0' />
              <span>Target {targetWeight} kg reached!</span>
            </>
          ) : (
            <>
              <Target className='size-4 shrink-0' />
              <span>1.4 kg remaining to reach {targetWeight} kg</span>
            </>
          )}
        </CardDescription>

        <CardAction className='flex items-center gap-2'>
          <Dialog
            open={isWeightDialogOpen}
            onOpenChange={(open) => {
              setIsWeightDialogOpen(open)

              if (open) {
                setWeight(null)
                setRecordedAt(new Date())
              }
            }}
          >
            <DialogTrigger asChild disabled={isLoading}>
              <Button
                className='size-8 p-0 md:w-auto md:gap-1.5 md:px-3'
                disabled={isLoading}
              >
                <Plus />
                <span className='hidden md:inline'>Add</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add weight</DialogTitle>

                <DialogDescription>
                  Record your body weight for a specific date. You can edit or
                  remove this entry later.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className='flex flex-row'>
                <Field data-invalid={hasInvalidWeight}>
                  <FieldLabel htmlFor='weight'>Weight</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      id='weight'
                      type='number'
                      step={0.1}
                      min={MIN_TARGET_WEIGHT_KG}
                      max={MAX_TARGET_WEIGHT_KG}
                      placeholder='Weight'
                      autoFocus
                      aria-invalid={hasInvalidWeight}
                      value={weight ?? ''}
                      onChange={(e) =>
                        setWeight(
                          e.target.value === '' ? null : Number(e.target.value),
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSave()
                        }
                      }}
                    />

                    <InputGroupAddon align='inline-end'>
                      <InputGroupText>kg</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {hasInvalidWeight && (
                    <FieldDescription
                      className={cn(!isValidWeight && 'text-destructive')}
                    >
                      Weight must be between {MIN_TARGET_WEIGHT_KG} and{' '}
                      {MAX_TARGET_WEIGHT_KG} kg.
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor='recordedAt'>Date</FieldLabel>

                  <Popover
                    open={isRecordedAtPopoverOpen}
                    onOpenChange={setIsRecordedAtPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        id='start-date-picker'
                        className='justify-between font-normal'
                      >
                        {format(recordedAt, 'PP')}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={recordedAt}
                        onSelect={(date) => {
                          if (!date) return
                          setRecordedAt(date)
                          setIsRecordedAtPopoverOpen(false)
                        }}
                        disabled={{ after: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    Close
                  </Button>
                </DialogClose>

                <Button disabled={!isValidWeight} onClick={handleSave}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
              interval={0}
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
            <span>{currentWeight} kg</span>
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
