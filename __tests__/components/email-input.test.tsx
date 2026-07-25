import EmailInput from '@/components/email-input'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  recoveryEmail: string
}

interface RenderComponentOptions {
  defaultValues?: Partial<FormValues>
  disabled?: boolean
  placeholder?: string
  name?: 'email' | 'recoveryEmail'
}

const renderComponent = ({
  defaultValues,
  disabled,
  placeholder,
  name,
}: RenderComponentOptions = {}) => {
  function TestForm() {
    const { control } = useForm<FormValues>({
      mode: 'onBlur',
      defaultValues: {
        email: '',
        recoveryEmail: '',
        ...defaultValues,
      },
    })

    return (
      <EmailInput
        control={control}
        disabled={disabled}
        placeholder={placeholder}
        name={name}
      />
    )
  }

  return render(<TestForm />)
}

describe('EmailInput', () => {
  it('renders an email input', () => {
    renderComponent()

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('uses the default placeholder', () => {
    renderComponent()

    expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument()
  })

  it('renders a custom placeholder', () => {
    renderComponent({
      placeholder: 'john@example.com',
    })

    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
  })

  it('is enabled by default', () => {
    renderComponent()

    expect(screen.getByRole('textbox', { name: /email/i })).toBeEnabled()
  })

  it('can be disabled', () => {
    renderComponent({
      disabled: true,
    })

    expect(screen.getByRole('textbox', { name: /email/i })).toBeDisabled()
  })

  it('renders the default email value', () => {
    renderComponent({
      defaultValues: {
        email: 'john@example.com',
      },
    })

    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  })

  it('updates its value when the user types', async () => {
    const user = userEvent.setup()

    renderComponent()

    const input = screen.getByRole('textbox', {
      name: /email/i,
    })

    await user.type(input, 'john@example.com')

    expect(input).toHaveValue('john@example.com')
  })

  it('supports a custom field name', () => {
    renderComponent({
      name: 'recoveryEmail',
      defaultValues: {
        recoveryEmail: 'recover@example.com',
      },
    })

    expect(screen.getByDisplayValue('recover@example.com')).toBeInTheDocument()
  })
})
