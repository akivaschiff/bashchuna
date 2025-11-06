import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SupplierList } from '@/components/SupplierList'
import { SupplierWithCreator } from '@/types'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch suppliers with creator info and rating averages
  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select(`
      *,
      creator:users!suppliers_created_by_fkey(id, name, email, avatar_url, is_admin),
      ratings(quality, price, reliability, communication)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching suppliers:', error)
    return <div className="p-4">שגיאה בטעינת הספקים</div>
  }

  // Calculate averages and format data
  const suppliersWithAverages: SupplierWithCreator[] = (suppliers || []).map((supplier) => {
    const ratings = supplier.ratings as Array<{
      quality: number | null
      price: number | null
      reliability: number | null
      communication: number | null
    }> || []
    const ratingCount = ratings.length

    const calculateAvg = (field: 'quality' | 'price' | 'reliability' | 'communication') => {
      const values = ratings.map(r => r[field]).filter((v): v is number => v !== null)
      return values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : null
    }

    return {
      id: supplier.id,
      name: supplier.name,
      trade: supplier.trade,
      phone: supplier.phone,
      description: supplier.description,
      image_url: supplier.image_url,
      created_by: supplier.created_by,
      created_at: supplier.created_at,
      creator: supplier.creator,
      avg_quality: calculateAvg('quality'),
      avg_price: calculateAvg('price'),
      avg_reliability: calculateAvg('reliability'),
      avg_communication: calculateAvg('communication'),
      rating_count: ratingCount,
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">מצא ספקים מקומיים</h1>
      <SupplierList suppliers={suppliersWithAverages} userId={user?.id || null} />
    </div>
  )
}
