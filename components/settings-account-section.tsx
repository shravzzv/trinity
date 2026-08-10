'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { LinkIcon, LogIn, LogOut, Pen, Send, Unlink } from 'lucide-react'
import { Separator } from './ui/separator'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group'
import { signOut } from '@/lib/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { toast } from 'sonner'

export default function SettingsAccountSection() {
  const { isAuthenticated } = useAuthContext()
  const isEmailVerified = true
  const isPasswordSet = true
  const isGoogleLinked = false
  const isGitHubLinked = false

  return (
    <section className='space-y-6'>
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
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => signOut('local')}
                >
                  <LogOut />
                  Sign out
                </Button>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <p className='text-base font-medium'>Sign out everywhere</p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <LogOut />
                      Sign out
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <LogOut />
                      </AlertDialogMedia>

                      <AlertDialogTitle>
                        Sign out of all sessions?
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        This will sign you out everywhere, including this
                        session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <section className='space-y-4 text-center md:text-left'>
                      <p className='text-muted-foreground text-sm'>
                        Prefer to stay signed in here? You can log out of all
                        other sessions instead.
                      </p>

                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          signOut('others')
                          toast.success('Signed out of all other sessions')
                        }}
                      >
                        <LogOut />
                        Sign out of all other sessions
                      </Button>
                    </section>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => signOut('global')}>
                        Sign out everywhere
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                  {isEmailVerified
                    ? 'Your email has been verified and is active.'
                    : 'Your email is unverified.'}
                </p>

                {!isEmailVerified && (
                  <Button variant='outline' size='xs'>
                    <Send />
                    Send verification email
                  </Button>
                )}
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
                    <span className='hidden md:inline'>Edit</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Separator />

            <div className='flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-0'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>Password</p>
                <p className='text-muted-foreground text-xs'>
                  {isPasswordSet
                    ? 'Changing your password will sign you out of other sessions. No one except you (even us) can know your password.'
                    : `You haven't set a password for your account yet.`}
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
                    <span className='hidden md:inline'>Edit</span>
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
                  {isGoogleLinked
                    ? 'You can sign in to Trinity using Google.'
                    : `You'll be able to sign in with Google once connected.`}
                </p>
              </div>
              {isGoogleLinked ? (
                <Button variant='outline' size='sm'>
                  <Unlink />
                  Disconnect
                </Button>
              ) : (
                <Button variant='outline' size='sm'>
                  <LinkIcon />
                  Connect
                </Button>
              )}
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div className='flex-1 space-y-1'>
                <p className='text-base font-medium'>GitHub</p>
                <p className='text-muted-foreground text-xs'>
                  {isGitHubLinked
                    ? 'You can sign in to Trinity using GitHub.'
                    : `You'll be able to sign in with GitHub once connected.`}
                </p>
              </div>
              {isGitHubLinked ? (
                <Button variant='outline' size='sm'>
                  <Unlink />
                  Disconnect
                </Button>
              ) : (
                <Button variant='outline' size='sm'>
                  <LinkIcon />
                  Connect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
