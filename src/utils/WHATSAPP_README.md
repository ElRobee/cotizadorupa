# Utilidades de WhatsApp

Este directorio contiene funciones especializadas para enviar mensajes por WhatsApp en diferentes contextos de la aplicación.

## Archivos

### 📱 sendViaWhatsAppQuotation.js
**Propósito:** Enviar cotizaciones completas por WhatsApp con formato detallado.

**Uso:**
```javascript
import { sendViaWhatsAppQuotation } from '../utils/sendViaWhatsAppQuotation';

sendViaWhatsAppQuotation(quotation, clients, company, showNotification);
```

**Mensaje incluye:**
- Número de cotización
- Fecha y validez
- Cliente
- Total con formato
- Estado y prioridad
- Lista detallada de servicios
- Resumen financiero (subtotal, descuento, IVA, total)
- Datos de la empresa

---

### 💰 sendViaWhatsAppPayment.js
**Propósito:** Enviar estados de pago por WhatsApp.

**Uso:**
```javascript
import { sendViaWhatsAppPayment } from '../utils/sendViaWhatsAppPayment';

sendViaWhatsAppPayment(paymentStatus, clients, company, showNotification);
```

**Mensaje incluye:**
- Número de estado de pago
- Fecha y validez
- Cliente
- Total
- Estado y prioridad
- Detalle de pagos
- Resumen financiero
- Datos de la empresa
- Mensaje orientado a coordinación de pagos

---

### 💬 sendViaWhatsAppSimple.js
**Propósito:** Enviar mensajes simples de saludo por WhatsApp (usado en lista de clientes).

**Uso:**
```javascript
import { sendViaWhatsAppSimple } from '../utils/sendViaWhatsAppSimple';

sendViaWhatsAppSimple(telefono, encargado, empresaRemitente);
```

**Mensaje incluye:**
- Saludo personalizado: "¡Hola {encargado}! Te saludo desde {empresa}. ¿Cómo estás?"

---

## Formato de Números de Teléfono

Todas las funciones formatean automáticamente los números de teléfono al estándar de WhatsApp:

**Formato correcto:** `569XXXXXXXX` (sin `+` y sin espacios)

### Conversiones automáticas:
- `+56 9 1234 5678` → `56912345678`
- `9 1234 5678` → `56912345678`
- `1234 5678` → `56912345678`

---

## Personalización de Mensajes

Para personalizar los mensajes, edita directamente los archivos correspondientes:

1. **sendViaWhatsAppQuotation.js** - Línea 64-98: Plantilla de mensaje para cotizaciones
2. **sendViaWhatsAppPayment.js** - Línea 64-98: Plantilla de mensaje para estados de pago
3. **sendViaWhatsAppSimple.js** - Línea 50: Mensaje simple de saludo

### Emojis disponibles:
- 📋 Documento
- 💰 💵 💳 Dinero
- 📅 Fecha
- ⏰ Hora
- 🏢 Empresa
- 📊 Estado
- 🎯 Prioridad
- 🛠️ Servicios
- 📞 Teléfono
- 📧 Email
- 📍 Ubicación
- 💬 Mensaje
- ⚡ Rápido

---

## Notas Técnicas

- Todas las funciones intentan abrir WhatsApp nativo primero (`whatsapp://`)
- Si falla, abre WhatsApp Web (`https://wa.me/`)
- Los mensajes se codifican con `encodeURIComponent()` para URLs
- Si no hay número de teléfono, se abre WhatsApp sin número predefinido
- Timeout de 500ms para detectar si WhatsApp nativo se abrió correctamente

---

## Ejemplos de Uso en Componentes

### QuotationsView.js
```javascript
import { sendViaWhatsAppQuotation } from '../utils/sendViaWhatsAppQuotation';

// En el botón:
onClick={() => sendViaWhatsAppQuotation(quotation, clients, company, showNotification)}
```

### PaymentStatusView.js
```javascript
import { sendViaWhatsAppPayment } from '../utils/sendViaWhatsAppPayment';

// En el botón:
onClick={() => sendViaWhatsAppPayment(paymentStatus, clients, company)}
```

### ClientsView.js
```javascript
import { sendViaWhatsAppSimple } from '../utils/sendViaWhatsAppSimple';

// En el botón:
onClick={() => sendViaWhatsAppSimple(client.telefono, client.encargado, company?.razonSocial)}
```

---

**Desarrollado para CotizApp** 🚀
