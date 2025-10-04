// Script para manejar pantalla completa en dispositivos móviles/tablets
(function() {
  // Función para configurar altura del viewport
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Función para activar pantalla completa
  async function activateFullscreen() {
    try {
      const element = document.documentElement;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.log('Pantalla completa no disponible:', error);
    }
  }

  // Función para detectar si estamos en dispositivo móvil
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent);
  }

  // Configuraciones iniciales
  if (isMobileDevice()) {
    // Configurar altura del viewport
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });

    // Agregar clase para pantallas completas
    document.body.classList.add('fullscreen-mode');
    document.documentElement.classList.add('fullscreen-mode');

    // Activar pantalla completa automáticamente
    setTimeout(activateFullscreen, 500);

    // Monitor para mantener pantalla completa
    function handleFullscreenChange() {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );

      // Reactivar automáticamente si se salió de pantalla completa
      if (!isCurrentlyFullscreen) {
        setTimeout(activateFullscreen, 200);
      }
    }

    // Escuchar cambios de pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Prevenir acciones que podrían sacar de pantalla completa
    document.addEventListener('keydown', function(event) {
      // Bloquear tecla Escape en móviles
      if (event.key === 'Escape') {
        event.preventDefault();
        activateFullscreen();
      }
    });

    // Prevenir zoom doble tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Prevenir scroll hacia arriba que podría mostrar la barra del navegador
    let startY = 0;
    document.addEventListener('touchstart', function(event) {
      startY = event.touches[0].clientY;
    });

    document.addEventListener('touchmove', function(event) {
      // Solo permitir scroll hacia abajo
      const currentY = event.touches[0].clientY;
      if (currentY < startY) {
        window.scrollTo(0, 1);
      }
    });

    // Forzar scroll inicial para ocultar barras del navegador
    setTimeout(function() {
      window.scrollTo(0, 1);
    }, 100);
  }

  console.log('Script de pantalla completa inicializado');
})();
