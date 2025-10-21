// utils/sendViaWhatsAppPayment.js
// Función para enviar estados de pago por WhatsApp

/**
 * Formatea un número de teléfono al formato de WhatsApp (569XXXXXXXX)
 * @param {string} telefono - Número de teléfono a formatear
 * @returns {string} - Número formateado
 */
const formatPhoneNumber = (telefono) => {
  if (!telefono) return '';
  
  // Eliminar todo excepto dígitos
  let phoneNumber = telefono.replace(/[^\d]/g, '');
  
  // Si el número comienza con +56, remover el +
  if (telefono.startsWith('+56')) {
    phoneNumber = telefono.replace(/\D/g, '');
  }
  
  // Asegurar formato correcto: 569XXXXXXXX
  if (phoneNumber.startsWith('56') && phoneNumber.length === 11) {
    // Ya tiene formato correcto
    return phoneNumber;
  } else if (phoneNumber.startsWith('9') && phoneNumber.length === 9) {
    // Agregar prefijo 56
    return '56' + phoneNumber;
  } else if (phoneNumber.length === 8) {
    // Número sin código de área, agregar 569
    return '569' + phoneNumber;
  }
  
  return phoneNumber;
};

/**
 * Calcula los totales de un estado de pago
 * @param {Array} items - Items del estado de pago
 * @param {number} discount - Descuento en porcentaje
 * @returns {Object} - Objeto con subtotal, descuento, IVA y total
 */
const calculatePaymentTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountAmount = subtotal * (discount / 100);
  const subtotalWithDiscount = subtotal - discountAmount;
  const iva = subtotalWithDiscount * 0.19;
  const total = subtotalWithDiscount + iva;
  return { subtotal, discountAmount, subtotalWithDiscount, iva, total };
};

/**
 * Envía un estado de pago por WhatsApp
 * @param {Object} paymentStatus - Objeto de estado de pago
 * @param {Array} clients - Lista de clientes
 * @param {Object} company - Datos de la empresa
 * @param {Function} showNotification - Función para mostrar notificaciones
 */
export const sendViaWhatsAppPayment = (paymentStatus, clients, company, showNotification) => {
  if (!paymentStatus || !clients) {
    if (showNotification) {
      showNotification('Error al preparar el estado de pago para WhatsApp', 'error');
    }
    return;
  }

  const clientName = paymentStatus.client || paymentStatus.clientName;
  const client = clients.find(c => c.empresa === clientName);
  const totals = calculatePaymentTotals(paymentStatus.items, paymentStatus.discount);

  const message = `
*ESTADO DE PAGO ${paymentStatus.number}* 💰
▪▪▪▪▪▪▪▪▪▪▪▪▪
📅 *Fecha:* ${paymentStatus.date}
⏰ *Válida hasta:* ${paymentStatus.validUntil}
🏢 *Cliente:* ${clientName}
💵 *Total:* $${Math.round(totals.total).toLocaleString()}
📊 *Estado:* ${paymentStatus.status}
🎯 *Prioridad:* ${paymentStatus.priority}

*📋 DETALLE DE PAGOS:*
${paymentStatus.items.map(item =>
  `• ${item.quantity}x ${item.service}\n  💵 $${Math.round(item.total || 0).toLocaleString()}`
).join('\n')}

*💳 RESUMEN:*
• Subtotal: $${Math.round(totals.subtotal).toLocaleString()}
${totals.discountAmount > 0 ? `• Descuento: -$${Math.round(totals.discountAmount).toLocaleString()}
• Subtotal con Desc.: $${Math.round(totals.subtotalWithDiscount).toLocaleString()}` : ''}
• IVA (19%): $${Math.round(totals.iva).toLocaleString()}
• *TOTAL: $${Math.round(totals.total).toLocaleString()}*

▪▪▪▪▪▪▪▪▪▪▪▪▪
🏢 *${company?.razonSocial || 'Mi Empresa'}*
📞 ${company?.telefono || 'Sin teléfono'}
📧 ${company?.email || 'Sin email'}
📍 ${company?.direccion || 'Sin dirección'}

💬 _Contáctanos para coordinar el Estado de pago_
⚡ _Estamos disponibles para resolver tus dudas_

_"Documento de control interno"_
  `.trim();

  const phoneNumber = formatPhoneNumber(client?.telefono);
  const encodedMessage = encodeURIComponent(message);

  let whatsappUrl;
  if (phoneNumber && phoneNumber.length >= 11) {
    whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  } else {
    whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
  }

  try {
    window.location.href = whatsappUrl;
    
    setTimeout(() => {
      if (document.hidden) {
        if (showNotification) {
          showNotification('WhatsApp abierto correctamente', 'success');
        }
      } else {
        const webUrl = phoneNumber && phoneNumber.length >= 11
          ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
          : `https://web.whatsapp.com/send?text=${encodedMessage}`;
        window.open(webUrl, '_blank');
        if (showNotification) {
          showNotification('Abriendo WhatsApp Web...', 'info');
        }
      }
    }, 500);
  } catch (error) {
    const webUrl = phoneNumber && phoneNumber.length >= 11
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?text=${encodedMessage}`;
    window.open(webUrl, '_blank');
    if (showNotification) {
      showNotification('Abriendo WhatsApp Web...', 'info');
    }
  }
};
