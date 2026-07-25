'use client'

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldError, FieldLabel } from './ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from './ui/button'

interface PasswordInputProps<T extends FieldValues> {
  label?: string
  control: Control<T>
  name?: FieldPath<T>
  disabled?: boolean
  placeholder?: string
}

export default function PasswordInput<T extends FieldValues>({
  control,
  disabled = false,
  label = 'Password',
  name = 'password' as FieldPath<T>,
  placeholder = 'Enter password',
}: PasswordInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

          <InputGroup>
            <InputGroupInput
              {...field}
              id={field.name}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              type={isPasswordVisible ? 'text' : 'password'}
            />
            <InputGroupAddon align='inline-end'>
              <Button
                variant='ghost'
                size='icon-sm'
                type='button'
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                aria-label={
                  isPasswordVisible ? 'Hide password' : 'Show password'
                }
              >
                {isPasswordVisible ? <EyeClosed /> : <Eye />}
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
