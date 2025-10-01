export const sendViaEmail = (quotation, data, currentUser) => {
  if (!quotation || !data?.clients || !data?.company) return;

  const client = data.clients.find(c => c.empresa === quotation.client);
  if (!client?.email) {
    alert("El cliente no tiene correo registrado");
    return;
  }

  // asunto
  const subjectRaw = `Cotización Nº ${quotation.number} - ${data.company.razonSocial}`;

  // cuerpo
  const bodyRaw = `
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

  // codificar en URL-safe UTF-8
  const subject = encodeURIComponent(subjectRaw);
  const body = encodeURIComponent(bodyRaw);

  const mailtoUrl = `mailto:${client.email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
};
