'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type WelcomeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
}

export function WelcomeModal({ isOpen, onClose, onSignIn }: WelcomeModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="סגור"
                >
                  ×
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 mb-4"
                >
                  ברוכים הבאים לבשכונה! 🏘️
                </Dialog.Title>

                <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    פלטפורמה לשיתוף המלצות על ספקים ובעלי מקצוע בגבעות עדן
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-blue-900">מה כאן?</p>
                    <ul className="space-y-1 text-sm">
                      <li>✓ המלצות אמיתיות משכנים</li>
                      <li>✓ דירוגים מפורטים (איכות, מחיר, אמינות, תקשורת)</li>
                      <li>✓ חיפוש וסינון לפי מקצוע</li>
                      <li>✓ שיתוף קל בוואטסאפ</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-green-900">למה להתחבר?</p>
                    <ul className="space-y-1 text-sm">
                      <li>✓ להוסיף ספקים חדשים</li>
                      <li>✓ לדרג ולהמליץ על ספקים</li>
                      <li>✓ לערוך את ההמלצות שלך</li>
                      <li>✓ לעזור לשכנים למצוא שירות איכותי</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    אפשר לדפדף גם בלי להתחבר, אבל כדי להוסיף תוכן צריך להיכנס עם Google
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={onSignIn}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                  >
                    התחבר עם Google
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
                  >
                    המשך בלי התחברות
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
