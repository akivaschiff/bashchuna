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
      <div className="flex items-center gap-4">
        {user.user_metadata.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || user.email}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="hidden sm:inline text-sm">
          {user.user_metadata.full_name || user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        >
          התנתק
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
    >
      התחבר עם Google
    </button>
  )
}
