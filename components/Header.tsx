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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          BaShchuna
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Admin
            </Link>
          )}
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
}
