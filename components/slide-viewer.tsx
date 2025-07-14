"use client"

import { useState } from "react"

interface SlideViewerProps {
  src: string
  title: string
}

export function SlideViewer({ src, title }: SlideViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-none"
        onLoad={() => setIsLoaded(true)}
        style={{
          transform: "scale(1)",
          transformOrigin: "top left",
        }}
      />
    </div>
  )
}
