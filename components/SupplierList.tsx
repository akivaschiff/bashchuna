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
      <div className="mb-8 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="חפש ספקים לפי שם..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-11"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <select
          value={selectedTrade}
          onChange={(e) => setSelectedTrade(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 border border-neutral-300 rounded-input text-base bg-white text-neutral-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-neutral-400"
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
            className="btn-primary w-full sm:w-auto whitespace-nowrap active:scale-[0.98]"
          >
            + הוסף ספק
          </button>
        )}
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white rounded-card shadow-card border border-neutral-200 p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">לא נמצאו ספקים</h3>
            <p className="text-neutral-600">
              {userId ? 'היה הראשון להוסיף ספק לרשימה!' : 'נסה לשנות את הסינון או החיפוש'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
          onSuccess={() => {
            // Re-fetch the supplier data to update the modal
            if (cachedSupplierForModal) {
              handleSupplierClick(cachedSupplierForModal)
            }
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
