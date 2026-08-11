'use client'

import { UserX } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
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
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { deleteAccount } from '@/app/actions'
import { Spinner } from './ui/spinner'
import { signOut } from '@/lib/auth'
import { useNetworkContext } from '@/providers/network-provider'

export default function SettingsDangerZone() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const { isOnline } = useNetworkContext()

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      await deleteAccount()
      await signOut('local')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className='space-y-6'>
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

            <AlertDialog
              open={open}
              onOpenChange={(open) => {
                if (isDeleting) return
                setOpen(open)
              }}
            >
              <AlertDialogTrigger asChild>
                <Button variant='destructive' size='sm' disabled={!isOnline}>
                  <UserX />
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <UserX />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant='destructive'
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                  >
                    {isDeleting ? (
                      <>
                        <Spinner />
                        Deleting account...
                      </>
                    ) : (
                      <span>Delete account</span>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
