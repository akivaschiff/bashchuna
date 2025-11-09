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
    .select('name, trades, description, image_url')
    .eq('id', id)
    .single()

  if (!supplier) {
    return {
      title: 'ספק לא נמצא',
    }
  }

  const description = supplier.description.slice(0, 160) + (supplier.description.length > 160 ? '...' : '')
  const tradesString = supplier.trades.join(', ')

  return {
    title: `${supplier.name} - ${tradesString} | בשכונה`,
    description: description,
    openGraph: {
      title: `${supplier.name} - ${tradesString}`,
      description: description,
      images: supplier.image_url ? [
        {
          url: supplier.image_url,
          width: 1200,
          height: 630,
          alt: `${supplier.name} - ${tradesString}`,
        }
      ] : [],
      type: 'website',
      siteName: 'בשכונה',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${supplier.name} - ${tradesString}`,
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

  // Filter out empty ratings (where all rating fields are null)
  const nonEmptyRatings = ratingsWithUsers.filter(r =>
    r.quality !== null || r.price !== null || r.reliability !== null || r.communication !== null
  )

  // Calculate averages and counts for each dimension
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

  // Check if user has already rated
  const userRatingData = user
    ? ratingsWithUsers.find((r) => r.user_id === user.id)
    : null

  const userRating = userRatingData ? {
    quality: userRatingData.quality,
    price: userRatingData.price,
    reliability: userRatingData.reliability,
    communication: userRatingData.communication,
    comment: userRatingData.comment,
  } : null

  // Check if current user is the creator
  const isCreator = user ? supplier.created_by === user.id : false

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
            <div className="flex flex-wrap gap-2 mb-4">
              {supplier.trades.map((trade: string) => (
                <span
                  key={trade}
                  className="inline-block bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full font-semibold text-sm border border-primary-200"
                >
                  {trade}
                </span>
              ))}
            </div>

            <div className="mb-4">
              <a
                href={`https://wa.me/972${supplier.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                📱 וואטסאפ: {supplier.phone}
              </a>
            </div>

            <p className="text-gray-700 mb-4">{supplier.description}</p>

            <p className="text-sm text-gray-500">
              נוסף על ידי {supplier.creator.name} בתאריך {formatDate(supplier.created_at)}
            </p>
          </div>
        </div>
      </div>

      <SupplierProfileClient
        supplier={supplier}
        userId={user?.id || null}
        isCreator={isCreator}
        userRating={userRating}
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">סיכום דירוגים</h2>
        <RatingDisplay
          quality={qualityData.avg}
          price={priceData.avg}
          reliability={reliabilityData.avg}
          communication={communicationData.avg}
          qualityCount={qualityData.count}
          priceCount={priceData.count}
          reliabilityCount={reliabilityData.count}
          communicationCount={communicationData.count}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          ביקורות ({nonEmptyRatings.length})
        </h2>

        {nonEmptyRatings.length === 0 ? (
          <p className="text-gray-500">אין ביקורות עדיין. היה הראשון לדרג!</p>
        ) : (
          <div className="space-y-4">
            {nonEmptyRatings.map((rating) => (
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
                    <span className="ml-4">איכות: {rating.quality}★</span>
                  )}
                  {rating.price !== null && (
                    <span className="ml-4">מחיר: {rating.price}★</span>
                  )}
                  {rating.reliability !== null && (
                    <span className="ml-4">אמינות: {rating.reliability}★</span>
                  )}
                  {rating.communication !== null && (
                    <span className="ml-4">תקשורת: {rating.communication}★</span>
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
