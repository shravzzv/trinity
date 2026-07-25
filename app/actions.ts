'use server'

import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'

/**
 * Signs in a user using email + password credentials.
 *
 * On success, Supabase sets the session cookie and the user
 * is redirected directly to the home page.
 *
 * Authentication failures (invalid credentials, etc.)
 * are returned as user-facing errors instead of redirecting,
 * allowing the UI to display inline feedback.
 */
export async function signin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error(error)

    switch (error.code) {
      case 'invalid_credentials':
        return {
          error: 'Invalid email or password.',
        }

      default:
        return {
          error: 'Unable to sign in. Please try again.',
        }
    }
  }

  redirect('/home')
}
