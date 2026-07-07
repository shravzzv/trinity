import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { levelsInfo } from '@/constants/gamification'
import LevelsDialog from '@/components/levels-dialog'

const renderComponent = () => {
  render(<LevelsDialog />)

  return {
    user: userEvent.setup(),
  }
}

const openDialog = async () => {
  const { user } = renderComponent()
  await user.click(screen.getByRole('button', { name: /level/i }))
}

describe('LevelsDialog', () => {
  it('renders the trigger button', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: /level/i })).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    await openDialog()

    expect(screen.getByRole('heading', { name: 'Levels' })).toBeInTheDocument()
  })

  it('renders the description', async () => {
    await openDialog()

    expect(
      screen.getByText(
        /celebrate your long-term progress by earning XP and reaching new levels/i,
      ),
    ).toBeInTheDocument()
  })

  it('renders the current level', async () => {
    await openDialog()

    expect(screen.getAllByText('0')).toHaveLength(3)
  })

  it('renders the earned XP', async () => {
    await openDialog()

    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText(/xp earned/i)).toBeInTheDocument()
  })

  it('renders the levels progress bar', async () => {
    await openDialog()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the remaining XP message', async () => {
    await openDialog()

    expect(screen.getByText(/next level in 75 xp/i)).toBeInTheDocument()
  })

  it('renders all help topics', async () => {
    await openDialog()

    for (const item of levelsInfo) {
      expect(
        screen.getByRole('button', {
          name: item.trigger,
        }),
      ).toBeInTheDocument()
    }
  })

  it('expands a help topic', async () => {
    await openDialog()

    await userEvent.click(
      screen.getByRole('button', {
        name: levelsInfo[0].trigger,
      }),
    )

    expect(screen.getByText(levelsInfo[0].content)).toBeInTheDocument()
  })

  it('collapses an expanded help topic', async () => {
    const { user } = renderComponent()
    await user.click(screen.getByRole('button', { name: /level/i }))

    const trigger = screen.getByRole('button', {
      name: levelsInfo[0].trigger,
    })

    await user.click(trigger)

    expect(screen.getByText(levelsInfo[0].content)).toBeInTheDocument()

    await user.click(trigger)

    expect(screen.queryByText(levelsInfo[0].content)).not.toBeInTheDocument()
  })
})
