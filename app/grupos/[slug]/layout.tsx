import type React from "react"

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pt-20">
      {children}
    </div>
  )
}
