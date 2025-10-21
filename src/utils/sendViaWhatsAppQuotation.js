// utils/sendViaWhatsAppQuotation.js
// Función para enviar cotizaciones por WhatsApp con formato completo

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
 * Calcula los totales de una cotización
 * @param {Array} items - Items de la cotización
 * @param {number} discount - Descuento en porcentaje
 * @returns {Object} - Objeto con subtotal, descuento, IVA y total
 */
const calculateQuotationTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountAmount = subtotal * (discount / 100);
  const subtotalWithDiscount = subtotal - discountAmount;
  const iva = subtotalWithDiscount * 0.19;
  const total = subtotalWithDiscount + iva;
  return { subtotal, discountAmount, subtotalWithDiscount, iva, total };
};

/**
 * Envía una cotización por WhatsApp con formato completo
 * @param {Object} quotation - Objeto de cotización
 * @param {Array} clients - Lista de clientes
 * @param {Object} company - Datos de la empresa
 * @param {Function} showNotification - Función para mostrar notificaciones
 */
export const sendViaWhatsAppQuotation = (quotation, clients, company, showNotification) => {
  if (!quotation || !clients) {
    if (showNotification) {
      showNotification('Error al preparar la cotización para WhatsApp', 'error');
    }
    return;
  }

  const clientName = quotation.client || quotation.clientName;
  const client = clients.find(c => c.empresa === clientName);
  const totals = calculateQuotationTotals(quotation.items, quotation.discount);

  const message = `
*COTIZACIÓN ${quotation.number}* 📋
▪▪▪▪▪▪▪▪▪▪▪▪▪
📅 *Fecha:* ${quotation.date}
⏰ *Válida hasta:* ${quotation.validUntil}
🏢 *Cliente:* ${clientName}
💰 *Total:* $${Math.round(totals.total).toLocaleString()}
📊 *Estado:* ${quotation.status}
🎯 *Prioridad:* ${quotation.priority}

*🛠️ SERVICIOS:*
${quotation.items.map(item =>
  `• ${item.quantity}x ${item.service}\n  💵 $${Math.round(item.total || 0).toLocaleString()}`
).join('\n')}

*💳 RESUMEN FINANCIERO:*
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

💬 _Contáctanos para más información_
⚡ _Respuesta rápida garantizada_

_"Documento válido sólo como Cotización"_
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
