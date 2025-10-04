"use client"

import { useEffect } from "react"

export default function MobileViewport() {
  useEffect(() => {
    // Detectar si estamos en dispositivo móvil/tablet
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Configurar viewport para pantalla completa
      const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
      if (viewport) {
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      }

      // Prevenir zoom al hacer doble tap
      let lastTouchEnd = 0
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      }, false)

      // Activar pantalla completa automáticamente
      const activateFullscreen = async () => {
        try {
          const element = document.documentElement
          
          if (element.requestFullscreen) {
            await element.requestFullscreen()
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen()
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen()
          }
        } catch (error) {
          console.log('Pantalla completa no disponible:', error)
        }
      }

      // Activar inmediatamente
      activateFullscreen()

      // Detecta cuando se sale de pantalla completa y la reactiva
      const handleFullscreenChange = () => {
        const currentDate = new Date()
        const hour = currentDate.getHours()
        
        // Solo mantener pantalla completa durante horas de trabajo (6 AM - 11 PM)
        // para permitir uso normal fuera de horario comercial
        if (hour >= 6 && hour <= 23) {
          setTimeout(() => {
            const isCurrentlyFullscreen = !!(
              document.fullscreenElement ||
              (document as any).webkitFullscreenElement ||
              (document as any).msFullscreenElement
            )
            
            if (!isCurrentlyFullscreen) {
              activateFullscreen()
            }
          }, 500)
        }
      }

      // Monitorear cambios de pantalla completa
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      
      // Prevenir acciones que puedan sacar de pantalla completa
      document.addEventListener('keydown', (event) => {
        // Bloquear tecla Escape en tablets (no en desktop)
        if (event.key === 'Escape' && /Android|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
          event.preventDefault()
          activateFullscreen()
        }
      })

      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      }
    }
  }, [])

  return null
}
