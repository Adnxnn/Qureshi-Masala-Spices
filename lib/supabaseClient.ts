import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return dummy client if not configured, won't be used in mock mode
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve(),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null })
      }
    } as any
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}