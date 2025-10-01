// utils/sendViaEmail.js
export const sendViaEmail = (quotation, data, currentUser) => {
  if (!quotation || !data?.clients || !data?.company) return;

  const client = data.clients.find(c => c.empresa === quotation.client);
  if (!client?.email) {
    alert("El cliente no tiene correo registrado");
    return;
  }

  const subject = `Cotización ${quotation.number} - ${data.company.razonSocial}`;

  const body = `
Estimado/a ${client.encargado},

Junto con saludar, me permito adjuntar la cotización Nº ${quotation.number}, correspondiente a su empresa ${client.empresa}.

Por favor, no dude en contactarnos si requiere más información o ajustes respecto a la propuesta.

Atentamente,  
${currentUser?.displayName || "Usuario"}  
${data.company.razonSocial}  
Tel: ${data.company.telefono || "Sin teléfono"}  
Email: ${data.company.email || "Sin email"}  
Dirección: ${data.company.direccion || "Sin dirección"}  

--  
Este correo ha sido generado desde CotizApp a product by MisterRobot, www.misterrobot.cl
  `.trim();

  // Generar mailto con subject + body
  const mailtoUrl = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Abrir en cliente de correo por defecto
  window.location.href = mailtoUrl;
};
