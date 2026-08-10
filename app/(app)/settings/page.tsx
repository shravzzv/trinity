'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import TargetWeightCard from '@/components/target-weight-card'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { siteLinks } from '@/constants/navigation'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/providers/auth-provider'
import {
  FileUp,
  LogIn,
  LogOut,
  RotateCcw,
  UserX,
  Link as LinkIcon,
  Pen,
} from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

export default function Page() {
  const { isAuthenticated } = useAuthContext()

  return (
    <div className='mx-auto w-full max-w-xl space-y-6'>
      <h2 className='font-semibold'>Preferences</h2>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Theme</p>
            <ThemeToggle />
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Notifications</p>
              <p className='text-muted-foreground text-xs'>
                Notifications may not be available on all devices.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <h2 className='font-semibold'>Fasting</h2>
      <FastingPlanCard />

      <h2 className='font-semibold'>Weight</h2>
      <TargetWeightCard />

      <h2 className='font-semibold'>Account</h2>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          {!isAuthenticated ? (
            <>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-base font-medium'>Sign in to Trinity</p>
                  <p className='text-muted-foreground text-xs'>
                    Enable cloud saving, cross device syncing and much more.
                  </p>
                </div>
                <Button size='sm' asChild>
                  <Link href='/signin'>
                    <LogIn /> Sign in
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-base font-medium'>Sign out of Trinity</p>
                  <p className='text-muted-foreground text-xs'>
                    Trinity continues to work offline. Any unsynced data will
                    sync the next time you sign in.
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  <LogOut />
                  Sign out
                </Button>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <p className='text-base font-medium'>Sign out everywhere</p>
                <Button variant='outline' size='sm'>
                  <LogOut />
                  Sign out
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && (
        <Card>
          <CardContent className='flex flex-col gap-4'>
            <div className='flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-0'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>Email</p>
                <p className='text-muted-foreground text-xs'>
                  Your email has been verified and is active.
                </p>
              </div>

              <InputGroup className='flex-1'>
                <InputGroupInput
                  type='email'
                  className='flex-1 text-sm'
                  value='saishravan384@gmail.com'
                  onChange={() => {}}
                />
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton
                    size='xs'
                    variant='outline'
                    onClick={() => {}}
                  >
                    <Pen />
                    <span className='hidden md:inline'>Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Separator />

            <div className='flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-0'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>Password</p>
                <p className='text-muted-foreground text-xs'>
                  Changing your password will sign you out of other sessions.
                </p>
              </div>

              <InputGroup className='flex-1'>
                <InputGroupInput type='password' className='flex-1 text-sm' />
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton
                    size='xs'
                    variant='outline'
                    onClick={() => {}}
                  >
                    <Pen />
                    <span className='hidden md:inline'>Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {isAuthenticated && (
        <Card>
          <CardContent className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>Google</p>
                <p className='text-muted-foreground text-xs'>
                  You&apos;ll be able to sign in with Google once connected.
                </p>
              </div>
              <Button variant='outline' size='sm'>
                <LinkIcon />
                Connect
              </Button>
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>GitHub</p>
                <p className='text-muted-foreground text-xs'>
                  You&apos;ll be able to sign in with GitHub once connected.
                </p>
              </div>
              <Button variant='outline' size='sm'>
                <LinkIcon />
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className='font-semibold'>Data</h2>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Reset fasting progress</p>
            <Button variant='outline' size='sm'>
              <RotateCcw />
              Reset
            </Button>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Reset weight progress</p>
            <Button variant='outline' size='sm'>
              <RotateCcw />
              Reset
            </Button>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Export your data</p>
            <Button variant='outline' size='sm'>
              <FileUp />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className='text-destructive font-semibold'>Danger zone</h2>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Delete your account</p>
              <p className='text-muted-foreground text-xs'>
                All of your trinity data will be deleted. This is irreversible.
              </p>
            </div>

            <Button variant='destructive' size='sm'>
              <UserX />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-2'>
        {siteLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className='hover:text-primary text-sm underline underline-offset-2'
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
