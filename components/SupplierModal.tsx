'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { RatingDisplay } from '@/components/RatingDisplay'
import { formatDate } from '@/lib/utils'
import { Supplier, RatingWithUser } from '@/types'

type SupplierModalProps = {
  supplier: Supplier & {
    creator: {
      id: string
      name: string
      email: string
      avatar_url: string | null
      is_admin: boolean
    }
  }
  ratings: RatingWithUser[]
  userId: string | null
  isCreator: boolean
  userRating: {
    quality: number | null
    price: number | null
    reliability: number | null
    communication: number | null
    comment: string | null
  } | null
  isOpen: boolean
  onClose: () => void
  onOpenRating: () => void
  onOpenEdit: () => void
}

export function SupplierModal({
  supplier,
  ratings,
  userId,
  isCreator,
  userRating,
  isOpen,
  onClose,
  onOpenRating,
  onOpenEdit,
}: SupplierModalProps) {
  const [copied, setCopied] = useState(false)

  // Calculate averages
  const calculateAvg = (field: 'quality' | 'price' | 'reliability' | 'communication') => {
    const values = ratings.map(r => r[field]).filter((v): v is number => v !== null)
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : null
  }

  const avgQuality = calculateAvg('quality')
  const avgPrice = calculateAvg('price')
  const avgReliability = calculateAvg('reliability')
  const avgCommunication = calculateAvg('communication')

  const handleShare = async () => {
    const url = `${window.location.origin}/supplier/${supplier.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-full sm:max-w-2xl">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      {/* Header with close button */}
                      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-neutral-200 px-4 sm:px-6 py-5 flex items-center justify-between shadow-sm">
                        <Dialog.Title className="text-xl font-bold text-neutral-900 tracking-tight">
                          פרטי ספק
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          onClick={onClose}
                        >
                          <span className="sr-only">סגור</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="relative flex-1 px-4 sm:px-6 py-6 sm:py-8">
                        {/* Supplier Image and Basic Info */}
                        <div className="mb-8">
                          {supplier.image_url ? (
                            <div className="relative overflow-hidden rounded-card mb-6">
                              <img
                                src={supplier.image_url}
                                alt={supplier.name}
                                className="w-full h-72 object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-72 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-card flex items-center justify-center mb-6 border border-neutral-200">
                              <span className="text-neutral-400 text-7xl">📋</span>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div>
                              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-3">{supplier.name}</h1>
                              <span className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-semibold text-base border border-primary-200">
                                {supplier.trade}
                              </span>
                            </div>

                            {/* WhatsApp Button - Mobile Optimized */}
                            <a
                              href={`https://wa.me/972${supplier.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full sm:inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-input hover:bg-green-700 active:bg-green-800 font-semibold text-center transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <span className="text-xl">📱</span> וואטסאפ: {supplier.phone}
                            </a>

                            <p className="text-neutral-700 text-base leading-relaxed bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                              {supplier.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-neutral-500 pt-2 border-t border-neutral-100">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">נוסף על ידי {supplier.creator.name}</span>
                              <span className="text-neutral-400">•</span>
                              <span>{formatDate(supplier.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-8 flex flex-col sm:flex-row gap-3">
                          {isCreator && (
                            <button
                              onClick={onOpenEdit}
                              className="w-full sm:flex-1 px-6 py-3 bg-accent-600 text-white rounded-input hover:bg-accent-700 active:bg-accent-800 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              ערוך ספק
                            </button>
                          )}

                          {userId && (
                            <button
                              onClick={onOpenRating}
                              className="btn-primary w-full sm:flex-1"
                            >
                              {userRating ? 'עדכן את הדירוג שלך' : 'דרג את הספק'}
                            </button>
                          )}

                          <button
                            onClick={handleShare}
                            className="btn-secondary w-full sm:flex-1"
                          >
                            {copied ? '✓ הקישור הועתק!' : 'שתף'}
                          </button>
                        </div>

                        {/* Ratings Summary */}
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-card p-6 sm:p-8 mb-6 border border-primary-200">
                          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-5 flex items-center gap-2">
                            <span className="text-2xl">⭐</span> סיכום דירוגים
                          </h2>
                          <RatingDisplay
                            quality={avgQuality}
                            price={avgPrice}
                            reliability={avgReliability}
                            communication={avgCommunication}
                            ratingCount={ratings.length}
                          />
                        </div>

                        {/* Reviews */}
                        <div className="bg-neutral-50 rounded-card p-6 sm:p-8 border border-neutral-200">
                          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-6 flex items-center gap-2">
                            <span className="text-2xl">💬</span> ביקורות ({ratings.length})
                          </h2>

                          {ratings.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="text-5xl mb-3">📝</div>
                              <p className="text-neutral-600 font-medium">אין ביקורות עדיין. היה הראשון לדרג!</p>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {ratings.map((rating) => (
                                <div key={rating.id} className="bg-white rounded-lg p-5 border border-neutral-200 last:mb-0 shadow-sm">
                                  <div className="flex items-center gap-3 mb-3">
                                    {rating.user.avatar_url && (
                                      <img
                                        src={rating.user.avatar_url}
                                        alt={rating.user.name}
                                        className="w-11 h-11 rounded-full ring-2 ring-neutral-200"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="font-semibold text-neutral-900">{rating.user.name}</p>
                                      <p className="text-sm text-neutral-500">
                                        {formatDate(rating.created_at)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-3 mb-3 text-sm">
                                    {rating.quality !== null && (
                                      <span className="inline-flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                                        <span className="font-medium text-neutral-700">איכות:</span>
                                        <span className="star-rating font-bold">{rating.quality}★</span>
                                      </span>
                                    )}
                                    {rating.price !== null && (
                                      <span className="inline-flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                                        <span className="font-medium text-neutral-700">מחיר:</span>
                                        <span className="star-rating font-bold">{rating.price}★</span>
                                      </span>
                                    )}
                                    {rating.reliability !== null && (
                                      <span className="inline-flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                                        <span className="font-medium text-neutral-700">אמינות:</span>
                                        <span className="star-rating font-bold">{rating.reliability}★</span>
                                      </span>
                                    )}
                                    {rating.communication !== null && (
                                      <span className="inline-flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                                        <span className="font-medium text-neutral-700">תקשורת:</span>
                                        <span className="star-rating font-bold">{rating.communication}★</span>
                                      </span>
                                    )}
                                  </div>

                                  {rating.comment && (
                                    <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                      {rating.comment}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
