import { render, screen } from '@testing-library/react'
import type { Achievement } from '@/types/gamification'
import AchievementCelebrationDialog from '@/components/achievement-celebration-dialog'

const renderComponent = (
  achievement: Achievement | null = {
    type: 'level',
    title: 'Level 2 reached!',
    description: 'Keep going!',
  },
) => {
  return render(
    <AchievementCelebrationDialog
      open
      achievement={achievement}
      close={jest.fn()}
      onOpenChange={jest.fn()}
    />,
  )
}

describe('AchivementCelebrationDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when there is no achievement', () => {
    renderComponent(null)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the achievement title', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', { name: 'Level 2 reached!' }),
    ).toBeInTheDocument()
  })

  it('renders the achievement description', () => {
    renderComponent()

    expect(screen.getByText('Keep going!')).toBeInTheDocument()
  })

  it('renders the level achievement icon', () => {
    renderComponent({
      type: 'level',
      title: 'Level',
      description: '',
    })

    expect(screen.getByLabelText('level achievement')).toBeInTheDocument()
  })

  it('renders the streak achievement icon', () => {
    renderComponent({
      type: 'streak',
      title: 'Streak',
      description: '',
    })

    expect(screen.getByLabelText('streak achievement')).toBeInTheDocument()
  })

  it('renders the anchor achievement icon', () => {
    renderComponent({
      type: 'anchor',
      title: 'Anchor',
      description: '',
    })

    expect(screen.getByLabelText('anchor achievement')).toBeInTheDocument()
  })
})
