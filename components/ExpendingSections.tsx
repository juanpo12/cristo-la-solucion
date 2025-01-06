'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Section {
  id: number
  title: string
  image: string
}

const sections: Section[] = [
  { id: 1, title: 'INVICTOS KIDS', image: '/invictoskids.png' },
  { id: 2, title: 'INVICTOS TEENS', image: '/invictosTeens.png' },
  { id: 3, title: 'INVICTOS', image: '/invictos.png' },
  { id: 4, title: 'GDC', image: '/gdc.png' }
]

export default function ExpandingSections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="flex h-full w-screen bg-black overflow-hidden">
      {sections.map((section) => (
        <div
          key={section.id}
          className={cn(
            "relative flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer border border-white",
            hoveredId === section.id ? "flex-grow-[2]" : "flex-grow-[1]"
          )}
          style={{
            flexBasis: '15%',
            backgroundImage: `url(${section.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onMouseEnter={() => setHoveredId(section.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2
              className={cn(
                "text-white font-bold text-4xl transition-all duration-500 whitespace-nowrap",
                hoveredId === section.id ? "scale-110" : "scale-100"
              )}
            >
              {section.title}
            </h2>
          </div>
        </div>
      ))}
    </div>
  )
}
