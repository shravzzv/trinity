import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

/**
 * Creates a Supabase client with elevated privileges for trusted
 * server-side operations.
 *
 * This client uses the project's secret key and must never be used
 * in browser code.
 */
export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
