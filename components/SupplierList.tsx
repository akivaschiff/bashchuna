'use client'

import { useState, useEffect } from 'react'
import { SupplierCard } from './SupplierCard'
import { CreateSupplierModal } from './CreateSupplierModal'
import { SupplierModal } from './SupplierModal'
import { WelcomeModal } from './WelcomeModal'
import { RatingModal } from './RatingModal'
import { EditSupplierModal } from './EditSupplierModal'
import { SupplierWithCreator, TRADES } from '@/types'
import { createClient } from '@/lib/supabase'

type SupplierListProps = {
  suppliers: SupplierWithCreator[]
  userId: string | null
}

export function SupplierList({ suppliers, userId }: SupplierListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [supplierRatings, setSupplierRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [cachedSupplierForModal, setCachedSupplierForModal] = useState<any>(null)
  const [cachedUserRating, setCachedUserRating] = useState<any>(null)

  // Show welcome modal for non-authenticated users on first visit
  useEffect(() => {
    if (!userId) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true)
      }
    }
  }, [userId])

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false)
    localStorage.setItem('hasSeenWelcome', 'true')
  }

  const handleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTrade = selectedTrade === 'all' || supplier.trade === selectedTrade
    return matchesSearch && matchesTrade
  })

  const handleSupplierClick = async (supplier: SupplierWithCreator) => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Fetch full supplier details with creator
      const { data: fullSupplier } = await supabase
        .from('suppliers')
        .select(`
          *,
          creator:users!suppliers_created_by_fkey(id, name, email, avatar_url, is_admin)
        `)
        .eq('id', supplier.id)
        .single()

      // Fetch ratings with user info
      const { data: ratings } = await supabase
        .from('ratings')
        .select(`
          *,
          user:users!ratings_user_id_fkey(id, name, avatar_url)
        `)
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false })

      setSelectedSupplier(fullSupplier)
      setSupplierRatings(ratings || [])
    } catch (error) {
      console.error('Error fetching supplier details:', error)
    } finally {
      setLoading(false)
    }
  }

  const userRating = selectedSupplier && userId
    ? supplierRatings.find((r: any) => r.user_id === userId)
    : null

  const isCreator = selectedSupplier && userId
    ? selectedSupplier.created_by === userId
    : false

  return (
    <div>
      {/* Mobile-optimized search and filters */}
      <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
        <input
          type="text"
          placeholder="חפש ספקים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <select
          value={selectedTrade}
          onChange={(e) => setSelectedTrade(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">כל המקצועות</option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>

        {userId && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold whitespace-nowrap active:scale-[0.98] transition-transform"
          >
            הוסף ספק
          </button>
        )}
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          לא נמצאו ספקים. {userId && 'היה הראשון להוסיף!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onClick={() => handleSupplierClick(supplier)}
            />
          ))}
        </div>
      )}

      {showCreateModal && userId && (
        <CreateSupplierModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedSupplier && (
        <SupplierModal
          supplier={selectedSupplier}
          ratings={supplierRatings}
          userId={userId}
          isCreator={isCreator}
          userRating={userRating ? {
            quality: userRating.quality,
            price: userRating.price,
            reliability: userRating.reliability,
            communication: userRating.communication,
            comment: userRating.comment,
          } : null}
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onOpenRating={() => {
            setCachedSupplierForModal(selectedSupplier)
            setCachedUserRating(userRating)
            setSelectedSupplier(null)
            setShowRatingModal(true)
          }}
          onOpenEdit={() => {
            setCachedSupplierForModal(selectedSupplier)
            setSelectedSupplier(null)
            setShowEditModal(true)
          }}
        />
      )}

      {showRatingModal && userId && cachedSupplierForModal && (
        <RatingModal
          supplierId={cachedSupplierForModal.id}
          userId={userId}
          existingRating={cachedUserRating ? {
            quality: cachedUserRating.quality,
            price: cachedUserRating.price,
            reliability: cachedUserRating.reliability,
            communication: cachedUserRating.communication,
            comment: cachedUserRating.comment,
          } : undefined}
          onClose={() => {
            setShowRatingModal(false)
            setCachedSupplierForModal(null)
            setCachedUserRating(null)
          }}
        />
      )}

      {showEditModal && cachedSupplierForModal && (
        <EditSupplierModal
          supplier={cachedSupplierForModal}
          onClose={() => {
            setShowEditModal(false)
            setCachedSupplierForModal(null)
          }}
        />
      )}

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        onSignIn={handleSignIn}
      />
    </div>
  )
}
