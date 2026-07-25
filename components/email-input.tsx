import {
  Controller,
  type FieldPath,
  type Control,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

interface EmailInputProps<T extends FieldValues> {
  control: Control<T>
  name?: FieldPath<T>
  disabled?: boolean
  placeholder?: string
}

export default function EmailInput<T extends FieldValues>({
  control,
  disabled = false,
  placeholder = 'm@example.com',
  name = 'email' as FieldPath<T>,
}: EmailInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Email</FieldLabel>

          <Input
            {...field}
            type='email'
            id={field.name}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
