// utils/sendViaEmailPS.js
export const sendViaEmailPS = (paymentStatus, data, currentUser, userProfile) => {
  if (!paymentStatus || !data?.clients || !data?.company) return;

  const client = data.clients.find(c => c.empresa === paymentStatus.client);
  if (!client?.email) {
    alert("El cliente no tiene correo registrado");
    return;
  }

  // asunto (sin acentos para evitar problemas de encoding)
  const subjectRaw = `Estado de Pago No. ${paymentStatus.number} - ${data.company.razonSocial}`;

  // cuerpo del correo profesional y servicial
  const bodyRaw = `
Estimado/a ${client.encargado},

Espero que se encuentre muy bien. 
Por medio del presente, adjunto el Estado de Pago No. ${paymentStatus.number} correspondiente a su empresa ${client.empresa}.

Quedamos atentos a cualquier consulta, comentario o aclaracion que estime necesario respecto a este estado de cuenta. 
Nuestro objetivo es brindarle el mejor servicio posible y mantenerle informado sobre el estado de sus pagos.

Agradecemos su tiempo y la confianza depositada en nosotros.

Atentamente,  
${userProfile?.username || currentUser?.displayName || "Usuario"}  
${data.company.razonSocial}  
Tel: ${data.company.telefono || "Sin telefono"}  
Email: ${data.company.email || "Sin email"}  
Direccion: ${data.company.direccion || "Sin direccion"}  

--  
Este correo ha sido generado desde CotizApp a product by MisterRobot: https://www.misterrobot.cl
  `.trim();

  // codificar para URL
  const subject = encodeURIComponent(subjectRaw);
  const body = encodeURIComponent(bodyRaw);

  // armar el mailto
  const mailtoUrl = `mailto:${client.email}?subject=${subject}&body=${body}`;

  // abrir cliente de correo
  window.location.href = mailtoUrl;
};
