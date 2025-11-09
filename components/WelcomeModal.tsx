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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-card bg-white p-8 text-right align-middle shadow-modal transition-all border border-neutral-200">
                <button
                  onClick={onClose}
                  className="absolute left-4 top-4 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg p-2 transition-all duration-200"
                  aria-label="סגור"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold text-neutral-900 mb-3 tracking-tight"
                >
                  ברוכים הבאים לבשכונה! 🏘️
                </Dialog.Title>

                <div className="mt-5 space-y-5 text-neutral-700 leading-relaxed">
                  <p className="text-lg font-medium text-neutral-800">
                    פלטפורמה לשיתוף המלצות על ספקים ובעלי מקצוע בגבעות עדן
                  </p>

                  <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-lg p-5 space-y-3 border border-primary-200">
                    <p className="font-bold text-primary-900 flex items-center gap-2">
                      <span className="text-xl">✨</span> מה כאן?
                    </p>
                    <ul className="space-y-2 text-sm text-neutral-700">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold mt-0.5">✓</span>
                        <span>המלצות אמיתיות משכנים</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold mt-0.5">✓</span>
                        <span>דירוגים מפורטים (איכות, מחיר, אמינות, תקשורת)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold mt-0.5">✓</span>
                        <span>חיפוש וסינון לפי מקצוע</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold mt-0.5">✓</span>
                        <span>שיתוף קל בוואטסאפ</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-lg p-5 space-y-3 border border-accent-200">
                    <p className="font-bold text-accent-900 flex items-center gap-2">
                      <span className="text-xl">🔑</span> למה להתחבר?
                    </p>
                    <ul className="space-y-2 text-sm text-neutral-700">
                      <li className="flex items-start gap-2">
                        <span className="text-accent-600 font-bold mt-0.5">✓</span>
                        <span>להוסיף ספקים חדשים</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-600 font-bold mt-0.5">✓</span>
                        <span>לדרג ולהמליץ על ספקים</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-600 font-bold mt-0.5">✓</span>
                        <span>לערוך את ההמלצות שלך</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-600 font-bold mt-0.5">✓</span>
                        <span>לעזור לשכנים למצוא שירות איכותי</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200 font-medium">
                    💡 אפשר לדפדף גם בלי להתחבר, אבל כדי להוסיף תוכן צריך להיכנס עם Google
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={onSignIn}
                    className="btn-primary w-full"
                  >
                    התחבר עם Google
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-secondary w-full"
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
