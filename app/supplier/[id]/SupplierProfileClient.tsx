'use client'

import { useState } from 'react'
import { RatingModal } from '@/components/RatingModal'
import { EditSupplierModal } from '@/components/EditSupplierModal'
import { Supplier } from '@/types'

type SupplierProfileClientProps = {
  supplier: Supplier
  userId: string | null
  isCreator: boolean
  userRating: {
    quality: number | null
    price: number | null
    reliability: number | null
    communication: number | null
    comment: string | null
  } | null
}

export function SupplierProfileClient({
  supplier,
  userId,
  isCreator,
  userRating,
}: SupplierProfileClientProps) {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {isCreator && (
        <button
          onClick={() => setShowEditModal(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          ערוך ספק
        </button>
      )}

      {userId && (
        <button
          onClick={() => setShowRatingModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {userRating ? 'עדכן את הדירוג שלך' : 'דרג את הספק'}
        </button>
      )}

      <button
        onClick={handleShare}
        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
      >
        {copied ? 'הקישור הועתק!' : 'שתף'}
      </button>

      {showRatingModal && userId && (
        <RatingModal
          supplierId={supplier.id}
          userId={userId}
          existingRating={userRating || undefined}
          onClose={() => setShowRatingModal(false)}
        />
      )}

      {showEditModal && (
        <EditSupplierModal
          supplier={supplier}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}
