import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AuthButton } from './AuthButton'
import Link from 'next/link'

export async function Header() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = userData?.is_admin || false
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="בשכונה" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-xl sm:text-2xl font-bold text-blue-600">המומלצים שלנו</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium"
            >
              ניהול
            </Link>
          )}
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
}
