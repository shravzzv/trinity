/**
 * Server Actions used throughout the application.
 *
 * This module contains server-only functions that encapsulate
 * operations requiring access to server-side resources, such as
 * authentication, database interactions, redirects, and other
 * privileged logic that should never run on the client.
 *
 * Each action is responsible for validating its inputs, invoking the
 * appropriate server-side APIs, and returning a serializable result or
 * performing a server-side redirect where appropriate.
 */

'use server'

import { getSiteURL } from '@/lib/links'
import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'
import type { OAuthProvider } from '@/types/oauth'

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

/**
 * Creates a new user account using email + password.
 *
 * After signup, Supabase sends a confirmation email.
 * The confirmation link redirects the user back to the app,
 * landing on `/home` once the email is verified.
 *
 * This function does NOT create a session immediately —
 * the user must confirm their email first.
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const emailRedirectTo = new URL('home', getSiteURL())

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: emailRedirectTo.toString() },
  })

  if (!error) return

  switch (error.code) {
    case 'user_already_exists':
      return {
        error: 'An account with this email already exists.',
      }

    default:
      console.error(error)
      redirect('/auth-error')
  }
}

/**
 * Initiates OAuth sign-in with a supported provider.
 *
 * The user is redirected to the provider's authentication page. After
 * successfully authenticating, the provider redirects back to
 * `/auth/callback`, where the authorization code is exchanged for a
 * Supabase session before the user is finally redirected to `/home`.
 *
 * If the OAuth flow cannot be started, the user is redirected to the
 * generic authentication error page.
 *
 * @param provider - The OAuth provider to authenticate with.
 */
export async function signInWithProvider(provider: OAuthProvider) {
  const supabase = await createClient()

  const redirectTo = new URL('auth/callback', getSiteURL())
  redirectTo.searchParams.set('next', '/home')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo.toString(),
    },
  })

  if (error) {
    console.error(error)
    redirect('/auth-error')
  }

  redirect(data.url)
}

/**
 * Sends a password reset email to the user.
 *
 * The email contains a secure link that redirects the user
 * back to the app’s `/update-password` page.
 *
 * The actual password change happens only after the user
 * follows the link and submits a new password.
 *
 * Errors are returned to the caller to allow inline UI handling.
 */
export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const redirectTo = new URL('update-password', getSiteURL())

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(),
  })

  if (error) {
    return { error: error.message }
  }
}

/**
 * Updates the authenticated user’s password.
 *
 * This action is typically reached via a password reset
 * or recovery flow, where Supabase has already verified
 * the user via a secure token.
 *
 * On success, the user is redirected to the home page.
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  redirect('/home')
}
