'use client'

import { useState } from 'react'

export default function VideoPreloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)

  const endVideo = () => {
    setVisible(false)
    setTimeout(onComplete, 300)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        onEnded={endVideo}
        className="w-full h-full object-cover"
      >
        <source src="/images/Beforelanding.mp4" type="video/mp4" />
      </video>
      <button
        onClick={endVideo}
        className="absolute bottom-10 right-10 z-10 bg-black/50 hover:bg-black/70 text-white px-6 py-3 text-sm tracking-widest uppercase"
      >
        Skip &gt;
      </button>
    </div>
  )
}
