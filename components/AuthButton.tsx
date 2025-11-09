'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function AuthButton({ user }: { user: User | null }) {
  const supabase = createClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 sm:gap-4">
        {user.user_metadata.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || user.email}
            className="w-9 h-9 rounded-full ring-2 ring-neutral-200 shadow-sm"
          />
        )}
        <span className="hidden sm:inline text-sm font-medium text-neutral-700 max-w-[120px] truncate">
          {user.user_metadata.full_name || user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 rounded-input transition-all duration-200 border border-neutral-200 hover:border-neutral-300"
        >
          התנתק
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-5 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-input transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      התחברות
    </button>
  )
}
