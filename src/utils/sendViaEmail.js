// utils/sendViaEmail.js
export const sendViaEmail = (quotation, data, currentUser) => {
  if (!quotation || !data?.clients || !data?.company) return;

  const client = data.clients.find(c => c.empresa === quotation.client);
  if (!client?.email) {
    alert("El cliente no tiene correo registrado");
    return;
  }

  const subject = `Cotizaci\u00F3n ${quotation.number} - ${data.company.razonSocial}`;

  // Texto del correo en UTF-8
const bodyText = `
Estimado/a ${client.encargado},

Junto con saludar, me permito adjuntar la cotizaci\u00F3n N\u00BA ${quotation.number}, correspondiente a su empresa ${client.empresa}.

Por favor, no dude en contactarnos si requiere m\u00E1s informaci\u00F3n o ajustes respecto a la propuesta.

Atentamente,  
${currentUser?.displayName || "Usuario"}  
${data.company.razonSocial}  
Tel: ${data.company.telefono || "Sin tel\u00E9fono"}  
Email: ${data.company.email || "Sin email"}  
Direcci\u00F3n: ${data.company.direccion || "Sin direcci\u00F3n"}  

--  
Este correo ha sido generado desde CotizApp a product by MisterRobot, www.misterrobot.cl
`.trim();

  // encodeURIComponent para evitar problemas con acentos
  const mailtoUrl = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  window.location.href = mailtoUrl;
};
