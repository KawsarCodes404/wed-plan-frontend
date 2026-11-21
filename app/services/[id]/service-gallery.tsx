"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

export function ServiceGallery({
  images,
  category,
  premium,
}: {
  images: string[]
  category: string
  premium?: boolean
}) {
  const gallery = images.length ? images : [""]
  const [selected, setSelected] = useState(0)

  return (
    <div className="detail-gallery">
      <div
        className="detail-cover"
        role="img"
        aria-label={`${category} service photo ${selected + 1} of ${gallery.length}`}
        style={{
          backgroundImage: gallery[selected]
            ? `url(${gallery[selected]})`
            : undefined,
        }}
      >
        <span className="category-pill">{category}</span>
        {premium && (
          <span className="partner-pill">
            <Sparkles size={13} /> Premium Vendor
          </span>
        )}
      </div>
      {gallery.length > 1 && (
        <div
          className="detail-thumbnails"
          role="group"
          aria-label="Choose service photo"
        >
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
