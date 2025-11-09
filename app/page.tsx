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

    // Filter out empty ratings (where all fields are null)
    const nonEmptyRatings = ratings.filter(r =>
      r.quality !== null || r.price !== null || r.reliability !== null || r.communication !== null
    )

    const calculateAvgAndCount = (field: 'quality' | 'price' | 'reliability' | 'communication') => {
      const values = nonEmptyRatings.map(r => r[field]).filter((v): v is number => v !== null)
      return {
        avg: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null,
        count: values.length
      }
    }

    const qualityData = calculateAvgAndCount('quality')
    const priceData = calculateAvgAndCount('price')
    const reliabilityData = calculateAvgAndCount('reliability')
    const communicationData = calculateAvgAndCount('communication')

    return {
      id: supplier.id,
      name: supplier.name,
      trades: supplier.trades || [],
      phone: supplier.phone,
      description: supplier.description,
      image_url: supplier.image_url,
      created_by: supplier.created_by,
      created_at: supplier.created_at,
      creator: supplier.creator,
      avg_quality: qualityData.avg,
      avg_price: priceData.avg,
      avg_reliability: reliabilityData.avg,
      avg_communication: communicationData.avg,
      quality_count: qualityData.count,
      price_count: priceData.count,
      reliability_count: reliabilityData.count,
      communication_count: communicationData.count,
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <SupplierList suppliers={suppliersWithAverages} userId={user?.id || null} />
    </div>
  )
}
