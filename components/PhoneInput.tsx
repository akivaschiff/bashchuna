'use client'

import { useState, useEffect } from 'react'

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
  placeholder?: string
}

export function PhoneInput({
  value,
  onChange,
  required = false,
  className = '',
  placeholder = '05XXXXXXXX',
}: PhoneInputProps) {
  const [supportsContacts, setSupportsContacts] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  // Check if Contact Picker API is supported
  useEffect(() => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      setSupportsContacts(true)
    }
  }, [])

  // Format phone number for display
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')

    // Handle different formats
    if (digits.startsWith('972')) {
      // +972 or 972 format
      const local = digits.slice(3)
      if (local.length === 0) return '+972'
      if (local.length <= 2) return `+972 ${local}`
      if (local.length <= 5) return `+972 ${local.slice(0, 2)}-${local.slice(2)}`
      return `+972 ${local.slice(0, 2)}-${local.slice(2, 5)}-${local.slice(5, 9)}`
    } else if (digits.startsWith('05')) {
      // Israeli mobile format
      if (digits.length <= 3) return digits
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }

    return phone
  }

  // Normalize phone number to storage format (05XXXXXXXX)
  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')

    // Convert from international format
    if (digits.startsWith('972')) {
      return '0' + digits.slice(3, 12) // Take up to 9 digits after 972
    }

    // Already in local format
    if (digits.startsWith('05')) {
      return digits.slice(0, 10) // Take exactly 10 digits
    }

    return digits
  }

  // Validate Israeli phone number
  const isValidIsraeliPhone = (phone: string): boolean => {
    const normalized = normalizePhoneNumber(phone)
    // Israeli mobile: 05X-XXX-XXXX (10 digits total)
    return /^05\d{8}$/.test(normalized)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const normalized = normalizePhoneNumber(rawValue)
    const formatted = formatPhoneNumber(rawValue)

    setDisplayValue(formatted)
    onChange(normalized)
  }

  // Handle contact picker
  const handlePickContact = async () => {
    if (!('contacts' in navigator)) {
      alert('בחירת אנשי קשר אינה נתמכת בדפדפן זה')
      return
    }

    try {
      const contacts = await (navigator as any).contacts.select(
        ['tel'],
        { multiple: false }
      )

      if (contacts && contacts.length > 0 && contacts[0].tel && contacts[0].tel.length > 0) {
        const phoneNumber = contacts[0].tel[0]
        const normalized = normalizePhoneNumber(phoneNumber)
        const formatted = formatPhoneNumber(phoneNumber)

        setDisplayValue(formatted)
        onChange(normalized)
      }
    } catch (error) {
      console.error('Error picking contact:', error)
      // User cancelled or error occurred - do nothing
    }
  }

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value))
    }
  }, [value])

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="tel"
          dir="ltr"
          required={required}
          value={displayValue}
          onChange={handleInputChange}
          className={`input-field text-left flex-1 ${className}`}
          placeholder={placeholder}
          pattern="05[0-9]{8}"
          title="פורמט: 05 ואחריו 8 ספרות"
          autoComplete="tel"
          name="phone"
        />

        {supportsContacts && (
          <button
            type="button"
            onClick={handlePickContact}
            className="px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-input hover:bg-primary-100 hover:border-primary-300 active:bg-primary-200 transition-all duration-200 whitespace-nowrap"
            title="בחר מאנשי קשר"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs text-neutral-500 mt-1.5 mr-1">
        פורמט: 05 ואחריו 8 ספרות
        {supportsContacts && ' • לחץ על האייקון לבחירה מאנשי קשר'}
      </p>
    </div>
  )
}
