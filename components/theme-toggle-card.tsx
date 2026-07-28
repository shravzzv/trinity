import { ThemeToggle } from './theme-toggle'
import { Card, CardContent } from './ui/card'

export default function ThemeToggleCard() {
  return (
    <Card>
      <CardContent className='flex items-center justify-between'>
        <p className='text-base font-medium'>Theme</p>
        <ThemeToggle />
      </CardContent>
    </Card>
  )
}
