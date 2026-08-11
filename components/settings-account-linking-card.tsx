'use client'

import { Unlink, Link as LinkIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { OAuthProvider } from '@/types/oauth'
import { createClient } from '@/supabase/client'
import { toast } from 'sonner'
import { getSiteURL } from '@/lib/links'
import { useEffect, useState } from 'react'
import { type UserIdentity } from '@supabase/supabase-js'

export default function SettingsAccountLinkingCard() {
  const [identities, setIdentities] = useState<UserIdentity[]>([])

  useEffect(() => {
    const loadIdentities = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getUserIdentities()

      if (error) {
        console.error(error)
        return
      }

      setIdentities(data.identities)
    }

    void loadIdentities()
  }, [])

  const isGoogleLinked = identities.some(
    (identity) => identity.provider === 'google',
  )

  const isGitHubLinked = identities.some(
    (identity) => identity.provider === 'github',
  )

  const linkIdentity = async (provider: OAuthProvider) => {
    const supabase = createClient()

    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: `${getSiteURL()}settings`,
      },
    })

    if (error) {
      toast.error(`Failed to link with ${provider}`)
    }
  }

  const unlinkIdentity = async (provider: OAuthProvider) => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getUserIdentities()
      if (error) throw error

      const identity = data.identities.find(
        (identity) => identity.provider === provider,
      )

      if (!identity) {
        throw new Error(`No ${provider} identity is linked.`)
      }

      const { error: unlinkError } =
        await supabase.auth.unlinkIdentity(identity)

      if (unlinkError) throw unlinkError

      setIdentities((identities) =>
        identities.filter((current) => current.id !== identity.id),
      )

      toast.success(`Unlinked from ${provider}`)
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : `Failed to unlink ${provider}`,
      )
    }
  }

  return (
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
            <Button
              variant='outline'
              size='sm'
              onClick={() => unlinkIdentity('google')}
            >
              <Unlink />
              Disconnect
            </Button>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() => linkIdentity('google')}
            >
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
            <Button
              variant='outline'
              size='sm'
              onClick={() => unlinkIdentity('github')}
            >
              <Unlink />
              Disconnect
            </Button>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() => linkIdentity('github')}
            >
              <LinkIcon />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
