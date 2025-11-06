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
                      <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          פרטי ספק
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={onClose}
                        >
                          <span className="sr-only">סגור</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="relative flex-1 px-4 sm:px-6 py-6">
                        {/* Supplier Image and Basic Info */}
                        <div className="mb-6">
                          {supplier.image_url ? (
                            <img
                              src={supplier.image_url}
                              alt={supplier.name}
                              className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                              <span className="text-gray-400 text-6xl">📋</span>
                            </div>
                          )}

                          <h1 className="text-3xl font-bold mb-2">{supplier.name}</h1>
                          <p className="text-xl text-gray-600 mb-4">{supplier.trade}</p>

                          {/* WhatsApp Button - Mobile Optimized */}
                          <a
                            href={`https://wa.me/972${supplier.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full sm:inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-center mb-4"
                          >
                            📱 וואטסאפ: {supplier.phone}
                          </a>

                          <p className="text-gray-700 mb-4 leading-relaxed">{supplier.description}</p>

                          <p className="text-sm text-gray-500">
                            נוסף על ידי {supplier.creator.name} בתאריך {formatDate(supplier.created_at)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-3">
                          {isCreator && (
                            <button
                              onClick={onOpenEdit}
                              className="w-full sm:flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                              ערוך ספק
                            </button>
                          )}

                          {userId && (
                            <button
                              onClick={onOpenRating}
                              className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                              {userRating ? 'עדכן את הדירוג שלך' : 'דרג את הספק'}
                            </button>
                          )}

                          <button
                            onClick={handleShare}
                            className="w-full sm:flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                          >
                            {copied ? 'הקישור הועתק!' : 'שתף'}
                          </button>
                        </div>

                        {/* Ratings Summary */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <h2 className="text-2xl font-bold mb-4">סיכום דירוגים</h2>
                          <RatingDisplay
                            quality={avgQuality}
                            price={avgPrice}
                            reliability={avgReliability}
                            communication={avgCommunication}
                            ratingCount={ratings.length}
                          />
                        </div>

                        {/* Reviews */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h2 className="text-2xl font-bold mb-4">
                            ביקורות ({ratings.length})
                          </h2>

                          {ratings.length === 0 ? (
                            <p className="text-gray-500">אין ביקורות עדיין. היה הראשון לדרג!</p>
                          ) : (
                            <div className="space-y-4">
                              {ratings.map((rating) => (
                                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
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
