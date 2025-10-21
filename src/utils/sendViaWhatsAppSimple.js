// utils/sendViaWhatsAppSimple.js
// Función para enviar mensajes simples por WhatsApp (usado en clientes)

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
 * Envía un mensaje simple por WhatsApp
 * @param {string} telefono - Número de teléfono del destinatario
 * @param {string} encargado - Nombre del encargado/contacto
 * @param {string} empresaRemitente - Nombre de la empresa que envía el mensaje
 */
export const sendViaWhatsAppSimple = (telefono, encargado, empresaRemitente) => {
  if (!telefono) {
    alert('El cliente no tiene número de teléfono registrado');
    return;
  }

  const phoneNumber = formatPhoneNumber(telefono);
  const message = `Hola ${encargado}! Te saludo desde ${empresaRemitente || 'nuestra empresa'}. Como estas?`;
  const encodedMessage = encodeURIComponent(message);

  let whatsappUrl;
  if (phoneNumber && phoneNumber.length >= 11) {
    whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  } else {
    whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
  }

  window.open(whatsappUrl, '_blank');
};
