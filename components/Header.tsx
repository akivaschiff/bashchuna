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
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-header backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-200 group">
          <img
            src="/icon.png"
            alt="בשכונה"
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
          />
          <span className="text-xl sm:text-2xl font-bold text-primary-600 tracking-tight">המומלצים שלנו</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm sm:text-base text-neutral-600 hover:text-primary-600 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary-600 after:transition-all after:duration-200"
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
