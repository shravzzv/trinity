'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { LogIn, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth'
import { Separator } from './ui/separator'
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
import { Skeleton } from './ui/skeleton'

export default function SettingsAccountAuthCard() {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-40 md:w-64' />
              <Skeleton className='h-4 w-40 md:w-64' />
            </div>
            <Skeleton className='h-8 w-24' />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
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
                  Trinity continues to work offline. Any unsynced data will sync
                  the next time you sign in.
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
                      This will sign you out everywhere, including this session.
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
  )
}
