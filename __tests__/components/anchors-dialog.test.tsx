import AnchorsDialog from '@/components/anchors-dialog'
import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { anchorsAccordionInfo } from '@/constants/gamification'

const renderComponent = () => {
  render(<AnchorsDialog />)

  return {
    user: userEvent.setup(),
  }
}

const openDialog = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', { name: /anchors/i }))
}

describe('AnchorsDialog', () => {
  it('renders the trigger button', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: /anchors/i })).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByRole('heading', { name: 'Anchors' })).toBeInTheDocument()
  })

  it('renders the description', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(
      screen.getByText(
        /preserve your streak when life gets in the way of your fasting routine/i,
      ),
    ).toBeInTheDocument()
  })

  it('renders the current number of available anchors', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByText(/available/i)).toBeInTheDocument()
  })

  it('renders the next Anchor progress message', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(
      screen.getByText(/next anchor in 6 completed fasts/i),
    ).toBeInTheDocument()
  })

  it('renders the progress summary', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('1/7 fasts')).toBeInTheDocument()
  })

  it('renders all help topics', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    for (const item of anchorsAccordionInfo) {
      expect(
        screen.getByRole('button', { name: item.trigger }),
      ).toBeInTheDocument()
    }
  })

  it('expands a help topic', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    await user.click(
      screen.getByRole('button', {
        name: anchorsAccordionInfo[0].trigger,
      }),
    )

    expect(
      screen.getByText(anchorsAccordionInfo[0].content),
    ).toBeInTheDocument()
  })

  it('collapses an expanded help topic', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    const trigger = screen.getByRole('button', {
      name: anchorsAccordionInfo[0].trigger,
    })

    await user.click(trigger)

    expect(
      screen.getByText(anchorsAccordionInfo[0].content),
    ).toBeInTheDocument()

    await user.click(trigger)

    expect(
      screen.queryByText(anchorsAccordionInfo[0].content),
    ).not.toBeInTheDocument()
  })
})
