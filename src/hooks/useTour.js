import { useEffect, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const useTour = (currentView, currentUser, onLogout) => {
  const startTour = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: 'body',
          popover: {
            title: '¡Bienvenido a CotizApp! 🎉',
            description: isMobile 
              ? 'Este es un tour demo. Te mostraremos las funciones principales. En móvil, la navegación está en la barra inferior.'
              : 'Este es un tour demo. Te mostraremos las funcionalidades principales del sistema de cotizaciones.',
            side: 'center',
            align: 'center'
          }
        },
        {
          element: '[data-tour="quotations-nav"]',
          popover: {
            title: 'Cotizaciones',
            description: 'Aquí puedes ver, crear y gestionar todas tus cotizaciones. Es el corazón del sistema.',
            side: isMobile ? 'top' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const quotationsButton = document.querySelector('[data-tour="quotations-nav"]');
            if (quotationsButton) {
              setTimeout(() => quotationsButton.click(), 300);
            }
          }
        },
        {
          element: '[data-tour="clients-nav"]',
          popover: {
            title: 'Clientes',
            description: 'Gestiona toda la información de tus clientes. Puedes agregar, editar y organizar tu base de datos de clientes.',
            side: isMobile ? 'top' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const clientsButton = document.querySelector('[data-tour="clients-nav"]');
            if (clientsButton) {
              setTimeout(() => clientsButton.click(), 300);
            }
          }
        },
        // En móvil, mostrar el botón "Más" antes de las opciones que están dentro
        ...(isMobile ? [{
          element: '[data-tour="more-menu-nav"]',
          popover: {
            title: 'Menú Más Opciones',
            description: 'Toca aquí para ver más opciones: Servicios, Mantenimientos, Estado de Pagos y Configuración.',
            side: 'top',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Abrir el menú automáticamente en móvil
            const moreButton = document.querySelector('[data-tour="more-menu-nav"]');
            if (moreButton && !document.querySelector('[data-tour="services-nav"]')?.offsetParent) {
              setTimeout(() => moreButton.click(), 300);
            }
          }
        }] : []),
        {
          element: '[data-tour="services-nav"]',
          popover: {
            title: 'Servicios',
            description: 'Administra el catálogo de servicios que ofreces. Configura precios, categorías y disponibilidad.',
            side: isMobile ? 'bottom' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const servicesButton = document.querySelector('[data-tour="services-nav"]');
            if (servicesButton) {
              setTimeout(() => servicesButton.click(), 300);
            }
          }
        },
        {
          element: '[data-tour="maintenance-nav"]',
          popover: {
            title: 'Mantenimientos',
            description: 'Programa y gestiona los mantenimientos de equipos. Lleva un control detallado de cada intervención.',
            side: isMobile ? 'bottom' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const maintenanceButton = document.querySelector('[data-tour="maintenance-nav"]');
            if (maintenanceButton) {
              setTimeout(() => maintenanceButton.click(), 300);
            }
          }
        },
        {
          element: '[data-tour="payment-status-nav"]',
          popover: {
            title: 'Estado de Pagos',
            description: 'Monitorea el estado de los pagos de tus cotizaciones. Ve quién ha pagado y quién está pendiente.',
            side: isMobile ? 'bottom' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const paymentButton = document.querySelector('[data-tour="payment-status-nav"]');
            if (paymentButton) {
              setTimeout(() => paymentButton.click(), 300);
            }
          }
        },
        {
          element: '[data-tour="settings-nav"]',
          popover: {
            title: 'Configuración',
            description: 'Personaliza la aplicación. Configura tu empresa, logo, temas y preferencias.',
            side: isMobile ? 'bottom' : 'right',
            align: 'start'
          },
          onHighlightStarted: () => {
            // Hacer clic automático para mostrar la vista
            const settingsButton = document.querySelector('[data-tour="settings-nav"]');
            if (settingsButton) {
              setTimeout(() => settingsButton.click(), 300);
            }
          }
        },
        {
          element: 'body',
          popover: {
            title: '¡Tour Completado! ✅',
            description: 'Ya conoces las funciones principales. Por seguridad, cerraremos la sesión demo automáticamente. ¡Gracias por usar CotizApp!',
            side: 'center',
            align: 'center'
          },
          onHighlightStarted: () => {
            // Cerrar el menú Más si está abierto
            if (isMobile) {
              const overlay = document.querySelector('.fixed.inset-0.z-40.bg-black.bg-opacity-50');
              if (overlay) {
                overlay.click();
              }
            }
          }
        }
      ],
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      onDestroyStarted: () => {
        driverObj.destroy();
        // Cerrar sesión automáticamente al finalizar el tour (seguridad)
        if (onLogout) {
          setTimeout(() => {
            onLogout();
          }, 500);
        }
      },
      // Configuración responsive optimizada
      popoverClass: 'driverjs-theme',
      overlayOpacity: 0.15, // Muy transparente para ver el fondo
      smoothScroll: true,
      disableActiveInteraction: false, // Permitir interacción en todos los dispositivos
      allowClose: true,
      overlayClickNext: false,
      stagePadding: isMobile ? 6 : 10,
      stageRadius: isMobile ? 8 : 10,
      animate: isMobile // Animaciones solo en móvil para mejor feedback visual
    });

    driverObj.drive();
  }, [currentView, onLogout]);

  return { startTour };
};
