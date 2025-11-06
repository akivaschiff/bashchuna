import Link from 'next/link'
import { RatingDisplay } from './RatingDisplay'
import { SupplierWithCreator } from '@/types'

export function SupplierCard({ supplier }: { supplier: SupplierWithCreator }) {
  return (
    <Link href={`/supplier/${supplier.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
        {supplier.image_url ? (
          <img
            src={supplier.image_url}
            alt={supplier.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">📋</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-1">{supplier.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{supplier.trade}</p>

        <div className="mb-3">
          <RatingDisplay
            quality={supplier.avg_quality}
            price={supplier.avg_price}
            reliability={supplier.avg_reliability}
            communication={supplier.avg_communication}
            ratingCount={supplier.rating_count}
            compact
          />
        </div>

        <p className="text-xs text-gray-500">
          Added by {supplier.creator.name}
        </p>
      </div>
    </Link>
  )
}
