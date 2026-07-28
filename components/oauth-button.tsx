'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { signInWithProvider } from '@/app/actions'
import type { OAuthProvider } from '@/types/oauth'

type OAuthButtonProps = {
  disabled?: boolean
  provider: OAuthProvider
  children: React.ReactNode
}

function SubmitButton({
  disabled,
  children,
}: {
  disabled?: boolean
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      variant='outline'
      className='w-full'
      disabled={disabled || pending}
    >
      {pending ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export default function OAuthButton({
  provider,
  disabled,
  children,
}: OAuthButtonProps) {
  return (
    <form action={() => signInWithProvider(provider)} className='w-full'>
      <SubmitButton disabled={disabled}>{children}</SubmitButton>
    </form>
  )
}
