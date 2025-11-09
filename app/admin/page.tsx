import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AdminClient } from './AdminClient'
import { SupplierWithCreator } from '@/types'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">גישה נדחתה</h1>
          <p className="text-gray-600">אין לך הרשאה לגשת לעמוד זה.</p>
        </div>
      </div>
    )
  }

  // Fetch suppliers from last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select(`
      *,
      creator:users!suppliers_created_by_fkey(id, name, email, avatar_url, is_admin)
    `)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching suppliers:', error)
    return <div className="p-4">שגיאה בטעינת ספקים</div>
  }

  const recentSuppliers: SupplierWithCreator[] = (suppliers || []).map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    trades: supplier.trades || [],
    phone: supplier.phone,
    description: supplier.description,
    image_url: supplier.image_url,
    created_by: supplier.created_by,
    created_at: supplier.created_at,
    creator: supplier.creator,
    avg_quality: null,
    avg_price: null,
    avg_reliability: null,
    avg_communication: null,
    quality_count: 0,
    price_count: 0,
    reliability_count: 0,
    communication_count: 0,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">פאנל ניהול</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          ספקים אחרונים (30 יום אחרונים)
        </h2>

        {recentSuppliers.length === 0 ? (
          <p className="text-gray-500">לא נוספו ספקים ב-30 הימים האחרונים.</p>
        ) : (
          <AdminClient suppliers={recentSuppliers} />
        )}
      </div>
    </div>
  )
}
