// utils/sendViaEmail.js
export const sendViaEmail = (quotation, data, currentUser) => {
  if (!quotation || !data?.clients || !data?.company) return;

  const client = data.clients.find(c => c.empresa === quotation.client);
  if (!client?.email) {
    alert("El cliente no tiene correo registrado");
    return;
  }

  // asunto (sin acentos ni caracteres especiales)
  const subjectRaw = `Cotizacion No. ${quotation.number} - ${data.company.razonSocial}`;

  // cuerpo del correo (sin acentos, reemplazados por caracteres simples)
  const bodyRaw = `
Estimado/a ${client.encargado},

Junto con saludar, me permito adjuntar la cotizacion No. ${quotation.number}, correspondiente a su empresa ${client.empresa}.

Por favor, no dude en contactarnos si requiere mas informacion o ajustes respecto a la propuesta.

Atentamente,  
${currentUser?.displayName || "Usuario"}  
${data.company.razonSocial}  
Tel: ${data.company.telefono || "Sin telefono"}  
Email: ${data.company.email || "Sin email"}  
Direccion: ${data.company.direccion || "Sin direccion"}  

--  
Este correo ha sido generado desde CotizApp a product by MisterRobot (https://www.misterrobot.cl)
  `.trim();

  // codificar para URL
  const subject = encodeURIComponent(subjectRaw);
  const body = encodeURIComponent(bodyRaw);

  // armar el mailto
  const mailtoUrl = `mailto:${client.email}?subject=${subject}&body=${body}`;

  // abrir cliente de correo
  window.location.href = mailtoUrl;
};
