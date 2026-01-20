# Guía de Uso Rápido - Tour Demo CotizApp

## 🚀 Inicio Rápido

### Paso 1: Acceder al Demo
1. Abre la aplicación CotizApp
2. En la página de login, busca el botón **"🎯 MODO DEMO"**
3. Haz clic en el botón

![Botón Demo](./docs/demo-button.png)

### Paso 2: Explorar el Tour
El tour se iniciará automáticamente y te guiará por:
- ✅ Dashboard
- ✅ Gestión de Cotizaciones
- ✅ Base de Datos de Clientes
- ✅ Catálogo de Servicios
- ✅ Sistema de Mantenimientos
- ✅ Control de Pagos
- ✅ Configuración

## 📱 Uso en Dispositivos Móviles

### iPhone/iOS
1. El tour se adapta automáticamente al tamaño de pantalla
2. Los popovers son más compactos
3. Los botones se apilan verticalmente para mejor accesibilidad
4. Funciona en modo portrait y landscape

### Android
1. Optimizado para diferentes tamaños de pantalla Android
2. Compatible con navegadores Chrome Mobile y Firefox
3. Touch-friendly con áreas de toque amplias

## 💻 Uso en Escritorio

- Popovers de tamaño completo
- Navegación con teclado (Esc para cerrar)
- Hover effects en botones
- Posicionamiento inteligente de popovers

## 🎨 Personalización Visual

El tour se adapta al tema activo de tu aplicación:

```javascript
// Tema Azul (predeterminado)
theme === 'blue'

// Tema Verde
theme === 'green'

// Tema Morado
theme === 'purple'

// Tema Rojo
theme === 'red'
```

## ⚡ Características Técnicas

### Configuración Responsive Automática
```javascript
const isMobile = window.innerWidth <= 768;

// Posicionamiento adaptativo
side: isMobile ? 'bottom' : 'right'

// Padding adaptativo
stagePadding: isMobile ? 4 : 10
```

### Animaciones Suaves
- Fade in al aparecer
- Transiciones suaves entre pasos
- Destacado del elemento activo

### Control de Flujo
- Navegación bidireccional (Siguiente/Anterior)
- Salir en cualquier momento
- Indicador de progreso visual

## 🔧 Mantenimiento

### Agregar Nuevos Pasos

Para agregar un nuevo paso al tour:

1. Agrega el atributo `data-tour` al elemento HTML:
```jsx
<button data-tour="mi-nuevo-elemento">
  Mi Botón
</button>
```

2. Agrega el paso en `useTour.js`:
```javascript
{
  element: '[data-tour="mi-nuevo-elemento"]',
  popover: {
    title: 'Nuevo Paso',
    description: 'Descripción del nuevo paso',
    side: isMobile ? 'bottom' : 'right',
    align: 'start'
  }
}
```

### Modificar Estilos

Edita `src/styles/tour.css` para cambiar:
- Colores
- Tamaños de fuente
- Espaciado
- Animaciones
- Breakpoints responsive

## 📊 Estadísticas del Tour

El tour incluye:
- **9 pasos** totales
- **~2-3 minutos** de duración promedio
- **100% responsive** en todos los dispositivos
- **Soporte multi-tema**
- **Dark mode compatible**

## 🐛 Solución de Problemas Comunes

### El botón DEMO no aparece
- Verifica que estés en la vista de login (`currentView === 'login'`)
- Revisa que AuthView tenga la prop `onDemoLogin`

### El tour no resalta los elementos
- Asegúrate de que los elementos tengan el atributo `data-tour`
- Verifica que el selector CSS sea correcto
- Comprueba que el elemento esté visible en el DOM

### Problemas en móviles
- Limpia la caché del navegador móvil
- Verifica que driver.js esté cargado correctamente
- Comprueba los estilos responsive en `tour.css`

### El tour se ve mal en dark mode
- Verifica que los estilos de dark mode estén aplicados
- Comprueba la media query `@media (prefers-color-scheme: dark)`

## 🎯 Mejores Prácticas de Uso

### Para Administradores
1. Usa el tour demo para entrenar nuevos usuarios
2. Personaliza los mensajes según tu empresa
3. Ajusta el delay de inicio según necesidad

### Para Usuarios
1. Completa todo el tour la primera vez
2. Puedes saltarte pasos si ya conoces la función
3. El tour se puede repetir cuando quieras

### Para Desarrolladores
1. Mantén los textos concisos y claros
2. Usa verbos de acción en los títulos
3. Asegura que los selectores sean estables
4. Prueba en diferentes dispositivos
5. Considera el contexto del usuario

## 📱 Ejemplos de Código

### Iniciar el Tour Manualmente
```javascript
import { useTour } from './hooks/useTour';

function MiComponente() {
  const { startTour } = useTour(currentView, currentUser);
  
  return (
    <button onClick={startTour}>
      Iniciar Tour
    </button>
  );
}
```

### Personalizar Delay de Inicio
```javascript
// En handleDemoLogin
setTimeout(() => {
  startTour();
}, 2000); // 2 segundos de espera
```

### Verificar si es Móvil
```javascript
const isMobile = window.innerWidth <= 768;
const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
const isDesktop = window.innerWidth > 1024;
```

## 🌟 Características Destacadas

### 1. Auto-Login Demo
- No necesitas recordar credenciales
- Acceso instantáneo con un clic
- Perfecto para demostraciones

### 2. Responsive Design
- Se adapta a cualquier pantalla
- Touch-friendly en móviles
- Keyboard-friendly en desktop

### 3. Visual Feedback
- Indicador de progreso
- Elemento activo resaltado
- Animaciones suaves

### 4. Fácil Navegación
- Botones claramente etiquetados
- Soporte para gestos táctiles
- Atajos de teclado

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
1. Revisa esta documentación
2. Consulta el archivo `TOUR_DEMO_README.md`
3. Verifica los logs de la consola del navegador
4. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2026  
**Tecnología**: React + driver.js
