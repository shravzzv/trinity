/**
 * Client-side authentication helpers.
 *
 * This module contains utilities for managing the authenticated user's session
 * from the browser. These helpers wrap the Supabase client and provide a
 * consistent API for authentication-related actions throughout the application.
 */

import { createClient } from '@/supabase/client'
import { redirect } from 'next/navigation'

/**
 * Signs the user out of their current session.
 *
 * By default, only the current session is terminated (`local` scope). Other
 * scopes can be used to sign out all sessions or every session except the
 * current one.
 *
 * On success, the user is redirected to the sign-in page. Unexpected failures
 * are logged and redirected to the generic authentication error page.
 *
 * @param scope - Determines which sessions should be signed out.
 */
export async function signOut(scope: 'global' | 'local' | 'others' = 'local') {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut({ scope })

  if (error) {
    console.error(error)
    redirect('/auth-error')
  }

  redirect('/signin')
}
