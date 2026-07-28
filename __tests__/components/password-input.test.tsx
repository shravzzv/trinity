import PasswordInput from '@/components/password-input'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

type FormValues = {
  password: string
  confirmPassword: string
}

interface RenderComponentOptions {
  defaultValues?: Partial<FormValues>
  disabled?: boolean
  placeholder?: string
  label?: string
  name?: keyof FormValues
}

const renderComponent = ({
  defaultValues,
  disabled,
  placeholder,
  label,
  name,
}: RenderComponentOptions = {}) => {
  function TestForm() {
    const { control } = useForm<FormValues>({
      defaultValues: {
        password: '',
        confirmPassword: '',
        ...defaultValues,
      },
    })

    return (
      <PasswordInput
        control={control}
        disabled={disabled}
        placeholder={placeholder}
        label={label}
        name={name}
      />
    )
  }

  return render(<TestForm />)
}

describe('PasswordInput', () => {
  it('renders a password textbox', () => {
    renderComponent()

    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('uses the default label', () => {
    renderComponent()

    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('uses a custom label', () => {
    renderComponent({
      label: 'Confirm password',
    })

    expect(screen.getByText('Confirm password')).toBeInTheDocument()
  })

  it('uses the default placeholder', () => {
    renderComponent()

    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('uses a custom placeholder', () => {
    renderComponent({
      placeholder: 'Type your secret',
    })

    expect(screen.getByPlaceholderText('Type your secret')).toBeInTheDocument()
  })

  it('is enabled by default', () => {
    renderComponent()

    expect(screen.getByLabelText('Password')).toBeEnabled()
  })

  it('can be disabled', () => {
    renderComponent({
      disabled: true,
    })

    expect(screen.getByLabelText('Password')).toBeDisabled()
  })

  it('renders the default value', () => {
    renderComponent({
      defaultValues: {
        password: 'hunter2',
      },
    })

    expect(screen.getByDisplayValue('hunter2')).toBeInTheDocument()
  })

  it('updates its value when typed into', async () => {
    const user = userEvent.setup()

    renderComponent()

    const input = screen.getByLabelText('Password')

    await user.type(input, 'secret123')

    expect(input).toHaveValue('secret123')
  })

  it('supports a custom field name', async () => {
    const user = userEvent.setup()

    renderComponent({
      name: 'confirmPassword',
    })

    const input = screen.getByLabelText('Password')

    await user.type(input, 'secret123')

    expect(input).toHaveValue('secret123')
  })

  it('hides the password by default', () => {
    renderComponent()

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('shows the password when the visibility button is clicked', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'Show password',
      }),
    )

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('hides the password again when clicked twice', async () => {
    const user = userEvent.setup()

    renderComponent()

    const button = screen.getByRole('button', {
      name: 'Show password',
    })

    await user.click(button)

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')

    await user.click(
      screen.getByRole('button', {
        name: 'Hide password',
      }),
    )

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })
})
