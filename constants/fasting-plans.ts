import type { FastingPlan } from '@/types/fasting'

export const fastingPlans: FastingPlan[] = [
  {
    id: '12:12',
    title: '12:12',
    fastingHours: 12,
    eatingHours: 12,
  },
  {
    id: '14:10',
    title: '14:10',
    fastingHours: 14,
    eatingHours: 10,
  },
  {
    id: '16:8',
    title: '16:8',
    fastingHours: 16,
    eatingHours: 8,
  },
  {
    id: '18:6',
    title: '18:6',
    fastingHours: 18,
    eatingHours: 6,
  },
  {
    id: '20:4',
    title: '20:4',
    fastingHours: 20,
    eatingHours: 4,
  },
  {
    id: '23:1',
    title: '23:1',
    fastingHours: 23,
    eatingHours: 1,
  },
] as const
