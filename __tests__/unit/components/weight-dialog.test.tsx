import WeightDialog from '@/components/weight-dialog'
import { MAX_TARGET_WEIGHT_KG, MIN_TARGET_WEIGHT_KG } from '@/constants/weight'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof WeightDialog>> = {},
) => {
  const onSave = jest.fn()

  render(
    <WeightDialog
      dialogTitle='Add weight'
      dialogDescription='Record your body weight.'
      submitLabel='Save'
      onSave={onSave}
      {...props}
    >
      <button type='button'>Open</button>
    </WeightDialog>,
  )

  return {
    onSave,
    user: userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    }),
  }
}

describe('WeightDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the trigger', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('heading', { name: 'Add weight' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Record your body weight.')).toBeInTheDocument()
  })

  it('starts with an empty weight field by default', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByLabelText(/^weight$/i)).toHaveValue(null)
  })

  it('uses the provided initial weight', async () => {
    const { user } = renderComponent({
      initialWeight: 72.5,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByLabelText(/^weight$/i)).toHaveValue(72.5)
  })

  it('uses the provided initial recording date', async () => {
    const initialRecordedAt = new Date('2026-01-10T12:00:00Z')

    const { user } = renderComponent({
      initialRecordedAt,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('button', { name: /jan 10, 2026/i }),
    ).toBeInTheDocument()
  })

  it('disables save when no weight is entered', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('enables save when a valid weight is entered', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, '72.5')

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('shows a validation error for weights below the minimum', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, `${MIN_TARGET_WEIGHT_KG - 1}`)

    expect(screen.getByText(/weight must be between/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('shows a validation error for weights above the maximum', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, `${MAX_TARGET_WEIGHT_KG + 1}`)

    expect(screen.getByText(/weight must be between/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('calls onSave with the entered weight and date', async () => {
    const { user, onSave } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, '72.5')

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledTimes(1)

    expect(onSave).toHaveBeenCalledWith(72.5, new Date('2026-01-15T12:00:00Z'))
  })

  it('submits when enter is pressed inside the weight input', async () => {
    const { user, onSave } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, '72.5{enter}')

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith(72.5, new Date('2026-01-15T12:00:00Z'))
  })

  it('does not call onSave for invalid weights', async () => {
    const { user, onSave } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, '999')

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('closes after a successful save', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.type(input, '72.5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      screen.queryByRole('heading', { name: 'Add weight' }),
    ).not.toBeInTheDocument()
  })

  it('closes when the close button is clicked', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)

    expect(
      screen.queryByRole('heading', { name: 'Add weight' }),
    ).not.toBeInTheDocument()
  })

  it('resets weight to its initial value when reopened', async () => {
    const { user } = renderComponent({
      initialWeight: 70,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.clear(input)
    await user.type(input, '75')

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByLabelText(/^weight$/i)).toHaveValue(70)
  })

  it('resets the date to its initial value when reopened', async () => {
    const initialRecordedAt = new Date('2026-01-10T12:00:00Z')

    const { user } = renderComponent({
      initialRecordedAt,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('button', { name: /jan 10, 2026/i }),
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)
    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('button', { name: /jan 10, 2026/i }),
    ).toBeInTheDocument()
  })
})
