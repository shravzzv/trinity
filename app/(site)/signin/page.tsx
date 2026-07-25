import { SigninForm } from '@/components/signin-form'

export default function Page() {
  return (
    <div className='bg-background flex items-start justify-center py-8 md:py-24'>
      <div className='w-full max-w-sm'>
        <SigninForm />
      </div>
    </div>
  )
}
