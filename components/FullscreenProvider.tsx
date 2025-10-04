"use client"

import { useEffect, useState } from "react"

interface FullscreenProviderProps {
  children: React.ReactNode
}

export default function FullscreenProvider({ children }: FullscreenProviderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Detectar si estamos en dispositivo móvil/tablet
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Auto-activar pantalla completa en tablets/móviles
      requestFullscreen()
      
      // Mantener en pantalla completa incluso si el usuario intenta salir
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      }
    }
  }, [])

  const requestFullscreen = async () => {
    try {
      const element = document.documentElement
      
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
      
      setIsFullscreen(true)
    } catch (error) {
      console.log('No se pudo activar pantalla completa:', error)
    }
  }

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    )
    
    if (!isCurrentlyFullscreen && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Re-activar pantalla completa automáticamente en móviles
      setTimeout(requestFullscreen, 100)
    }
  }

  // Botón manual para activar pantalla completa
  const toggleFullscreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      }
      setIsFullscreen(false)
    } else {
      requestFullscreen()
    }
  }

  return (
    <div className="relative">
      {/* Botón flotante para pantalla completa (solo visible en desktop) */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors md:block hidden"
          title="Pantalla completa"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      )}
      
      {children}
    </div>
  )
}
