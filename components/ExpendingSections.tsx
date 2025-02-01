'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Section {
  id: number
  title: string
  image: string
  href: string
}

export default function ExpandingSections({sections}: {sections: Section[]}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="flex h-full w-screen flex-col md:flex-row bg-black overflow-hidden">
      {sections.map((section) => (
        <a
        href={section.href}
        key={section.id}
          className={cn(
            "relative flex items-center flex-col md:flex-row justify-center transition-all duration-500 ease-in-out cursor-pointer border border-white",
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
        </a>
      ))}
    </div>
  )
}
