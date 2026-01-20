# Tour Demo de CotizApp 🎯

## Descripción

Este tour demo proporciona una experiencia guiada e interactiva de CotizApp, mostrando las funcionalidades principales del sistema de cotizaciones. El tour está diseñado para ser completamente responsive y funcionar perfectamente en dispositivos móviles (iPhone, Android) y escritorio.

## Características

### 🎨 Interfaz Visual Atractiva
- Diseño moderno con gradientes y animaciones suaves
- Popover con diseño personalizado y colores de la aplicación
- Indicador de progreso para seguir el avance del tour
- Botones de navegación intuitivos (Anterior, Siguiente, Cerrar)

### 📱 Completamente Responsive
El tour se adapta automáticamente a diferentes tamaños de pantalla:

- **Escritorio (>1024px)**: Popover de tamaño completo con todas las características
- **Tablets (641px - 1024px)**: Popover adaptado para pantallas medianas
- **Móviles (≤640px)**: Popover compacto con botones apilados verticalmente
- **iPhone SE (≤375px)**: Optimización especial para dispositivos muy pequeños
- **Modo horizontal móvil**: Altura ajustada con scroll automático

### 🌓 Soporte Dark Mode
- Detección automática del modo oscuro del sistema
- Estilos adaptativos para mejor legibilidad

## Cómo Usar

### 1. Acceso al Tour Demo

En la página de inicio de sesión, encontrarás un botón destacado:

```
🎯 MODO DEMO
```

### 2. Credenciales Demo

Al hacer clic en el botón DEMO, se inicia sesión automáticamente con:
- **Email**: robertoverdejo@gmail.com
- **Contraseña**: 123456

### 3. Tour Automático

Una vez iniciada la sesión, el tour comienza automáticamente después de 1 segundo, mostrando:

1. **Bienvenida** - Introducción a CotizApp
2. **Cotizaciones** - Gestión de cotizaciones
3. **Clientes** - Base de datos de clientes
4. **Servicios** - Catálogo de servicios
5. **Mantenimientos** - Gestión de mantenimientos
6. **Estado de Pagos** - Monitoreo de pagos
7. **Configuración** - Personalización de la app
8. **Crear Cotización** - Botón de nueva cotización
9. **Finalización** - Mensaje de cierre

## Implementación Técnica

### Archivos Creados

1. **`src/hooks/useTour.js`**
   - Hook personalizado que maneja la lógica del tour
   - Configuración responsive adaptativa
   - Integración con driver.js

2. **`src/styles/tour.css`**
   - Estilos personalizados para el tour
   - Media queries para diferentes dispositivos
   - Animaciones y transiciones suaves

### Modificaciones

1. **`src/components/AuthView.js`**
   - Agregado botón "MODO DEMO" con diseño atractivo
   - Nueva prop `onDemoLogin` para manejar el login automático

2. **`src/App.js`**
   - Función `handleDemoLogin()` para autenticación demo
   - Integración del hook `useTour`
   - Inicio automático del tour después del login
   - Atributos `data-tour` en elementos de navegación

3. **`src/components/layout/MobileNav.js`**
   - Atributos `data-tour` para navegación móvil
   - Soporte completo para tour en dispositivos móviles

## Navegación del Tour

### Controles Disponibles

- **Siguiente →**: Avanza al siguiente paso
- **← Anterior**: Retrocede al paso anterior
- **✕ (Cerrar)**: Cierra el tour en cualquier momento
- **ESC**: Atajo de teclado para cerrar el tour
- **Clic fuera**: Opcionalmente cierra el tour (desactivado por defecto)

### Indicador de Progreso

Muestra "X de Y" para indicar en qué paso del tour te encuentras.

## Personalización

### Modificar Pasos del Tour

Edita el archivo `src/hooks/useTour.js` en la sección `steps`:

```javascript
steps: [
  {
    element: '[data-tour="id-elemento"]',
    popover: {
      title: 'Título del Paso',
      description: 'Descripción del paso',
      side: 'right', // top, right, bottom, left
      align: 'start' // start, center, end
    }
  }
]
```

### Cambiar Credenciales Demo

Modifica en `src/App.js` la función `handleDemoLogin()`:

```javascript
const demoEmail = 'tu-email@demo.com';
const demoPassword = 'tu-password';
```

### Ajustar Delay de Inicio

Cambia el tiempo de espera antes de iniciar el tour:

```javascript
setTimeout(() => {
  startTour();
}, 1000); // Cambia este valor en milisegundos
```

## Estilos Responsive

### Breakpoints Utilizados

- **Mobile Small**: ≤375px (iPhone SE)
- **Mobile**: ≤640px
- **Tablet**: 641px - 1024px
- **Desktop**: >1024px
- **Landscape Mobile**: ≤896px en orientación horizontal

### Variables de Tema

Los colores se adaptan automáticamente al tema activo de la aplicación:
- Azul (predeterminado)
- Verde
- Morado
- Rojo
- Gris

## Dependencias

- **driver.js**: ^1.3.1 (Biblioteca principal para el tour)
- Compatible con React 19.x

## Soporte de Navegadores

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (iOS y macOS)
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

## Mejores Prácticas

1. **No interrumpir el flujo del usuario**: El tour se puede cerrar en cualquier momento
2. **Textos concisos**: Cada paso tiene información clara y breve
3. **Orden lógico**: Los pasos siguen el flujo natural de uso
4. **Responsive first**: Diseñado primero para móviles, luego para escritorio

## Troubleshooting

### El tour no inicia
- Verifica que las credenciales demo sean correctas
- Asegúrate de que driver.js esté instalado: `npm install driver.js --legacy-peer-deps`

### Los elementos no se resaltan
- Verifica que los atributos `data-tour` estén presentes en los elementos
- Revisa que los selectores en `useTour.js` coincidan con los atributos

### Problemas de estilos
- Limpia la caché del navegador
- Verifica que `src/styles/tour.css` esté importado en App.js

## Futuras Mejoras

- [ ] Tour diferente para usuarios vs administradores
- [ ] Opción de repetir el tour desde configuración
- [ ] Traducciones a múltiples idiomas
- [ ] Analytics para medir efectividad del tour
- [ ] Tour contextual según la vista activa

## Autor

Desarrollado para CotizApp - Sistema de Cotizaciones

## Licencia

Uso interno - CotizApp
