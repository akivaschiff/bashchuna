import { createServerSupabaseClient } from '@/lib/supabase-server'
import { RatingDisplay } from '@/components/RatingDisplay'
import { SupplierProfileClient } from './SupplierProfileClient'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { RatingWithUser } from '@/types'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: supplier } = await supabase
    .from('suppliers')
    .select('name, trade, description, image_url')
    .eq('id', id)
    .single()

  if (!supplier) {
    return {
      title: 'Supplier Not Found',
    }
  }

  const description = supplier.description.slice(0, 160) + (supplier.description.length > 160 ? '...' : '')

  return {
    title: `${supplier.name} - ${supplier.trade} | BaShchuna`,
    description: description,
    openGraph: {
      title: `${supplier.name} - ${supplier.trade}`,
      description: description,
      images: supplier.image_url ? [supplier.image_url] : [],
    },
  }
}

export default async function SupplierProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch supplier with creator info
  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select(`
      *,
      creator:users!suppliers_created_by_fkey(id, name, email, avatar_url, is_admin)
    `)
    .eq('id', id)
    .single()

  if (error || !supplier) {
    notFound()
  }

  // Fetch all ratings with user info
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      *,
      user:users!ratings_user_id_fkey(id, name, avatar_url)
    `)
    .eq('supplier_id', id)
    .order('created_at', { ascending: false })

  const ratingsWithUsers: RatingWithUser[] = ratings || []

  // Calculate averages
  const calculateAvg = (field: 'quality' | 'price' | 'reliability' | 'communication') => {
    const values = ratingsWithUsers.map(r => r[field]).filter((v): v is number => v !== null)
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : null
  }

  const avgQuality = calculateAvg('quality')
  const avgPrice = calculateAvg('price')
  const avgReliability = calculateAvg('reliability')
  const avgCommunication = calculateAvg('communication')

  // Check if user has already rated
  const userRating = user
    ? ratingsWithUsers.find((r) => r.user_id === user.id)
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {supplier.image_url ? (
            <img
              src={supplier.image_url}
              alt={supplier.name}
              className="w-full md:w-64 h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-6xl">📋</span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{supplier.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{supplier.trade}</p>

            <div className="mb-4">
              <a
                href={`https://wa.me/${supplier.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                📱 WhatsApp: {supplier.phone}
              </a>
            </div>

            <p className="text-gray-700 mb-4">{supplier.description}</p>

            <p className="text-sm text-gray-500">
              Added by {supplier.creator.name} on {formatDate(supplier.created_at)}
            </p>
          </div>
        </div>
      </div>

      <SupplierProfileClient
        supplierId={id}
        userId={user?.id || null}
        userRating={userRating}
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Rating Summary</h2>
        <RatingDisplay
          quality={avgQuality}
          price={avgPrice}
          reliability={avgReliability}
          communication={avgCommunication}
          ratingCount={ratingsWithUsers.length}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Reviews ({ratingsWithUsers.length})
        </h2>

        {ratingsWithUsers.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to rate!</p>
        ) : (
          <div className="space-y-4">
            {ratingsWithUsers.map((rating) => (
              <div key={rating.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-3 mb-2">
                  {rating.user.avatar_url && (
                    <img
                      src={rating.user.avatar_url}
                      alt={rating.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{rating.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(rating.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mb-2 text-sm">
                  {rating.quality !== null && (
                    <span className="mr-4">Quality: {rating.quality}★</span>
                  )}
                  {rating.price !== null && (
                    <span className="mr-4">Price: {rating.price}★</span>
                  )}
                  {rating.reliability !== null && (
                    <span className="mr-4">Reliability: {rating.reliability}★</span>
                  )}
                  {rating.communication !== null && (
                    <span className="mr-4">Communication: {rating.communication}★</span>
                  )}
                </div>

                {rating.comment && (
                  <p className="text-gray-700">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
