'use client'

import { useState } from 'react'
import { RatingModal } from '@/components/RatingModal'

type SupplierProfileClientProps = {
  supplierId: string
  userId: string | null
  userRating: {
    quality: number | null
    price: number | null
    reliability: number | null
    communication: number | null
    comment: string | null
  } | null
}

export function SupplierProfileClient({
  supplierId,
  userId,
  userRating,
}: SupplierProfileClientProps) {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {userId && (
        <button
          onClick={() => setShowRatingModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {userRating ? 'Update Your Rating' : 'Rate This Supplier'}
        </button>
      )}

      <button
        onClick={handleShare}
        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
      >
        {copied ? 'Link Copied!' : 'Share'}
      </button>

      {showRatingModal && userId && (
        <RatingModal
          supplierId={supplierId}
          userId={userId}
          existingRating={userRating || undefined}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  )
}
