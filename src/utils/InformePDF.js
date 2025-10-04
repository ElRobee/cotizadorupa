export const generateTechnicalReportPDF = async (quotation, allServices, company) => {
  const servicesInQuotation = quotation.items.map(item => {
    // Buscar el servicio por nombre en lugar de serviceId
    const serviceDetails = allServices.find(s => s.name === item.service);
    return serviceDetails;
  }).filter(Boolean); // Filtra los servicios que no se encuentren

  if (servicesInQuotation.length === 0) {
    alert('Esta cotización no contiene servicios válidos para generar un informe técnico.');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        ${company?.logo 
          ? `<img src="${company.logo}" alt="Logo empresa" style="width: 300px; height: 120px; object-fit: contain; border-radius: 8px; margin-right: 20px;" />`
          : ''
        }
        <div style="text-align: left;">
          <h1 style="color: #333; margin: 0;">${company.razonSocial}</h1>
          <p style="margin: 5px 0;">${company.direccion} - ${company.ciudad}, ${company.region}</p>
          <p style="margin: 5px 0;">RUT: ${company.rut} | Tel: ${company.telefono}</p>
          <p style="margin: 5px 0;">Email: ${company.email}</p>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333;">INFORME TÉCNICO DE SERVICIOS</h2>
        <p><strong>Cotización N°:</strong> ${quotation.number} | <strong>Cliente:</strong> ${quotation.client || quotation.clientName}</p>
      </div>

      ${servicesInQuotation.map(service => `
        <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
          <h3 style="color: #0056b3; border-bottom: 1px solid #0056b3; padding-bottom: 10px; margin-top: 0;">${service.name}</h3>
          
          ${service.technicalInfo ? `
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
            <div><strong>Marca:</strong> ${service.technicalInfo.brand || 'No especificado'}</div>
            <div><strong>Altura Máxima:</strong> ${service.technicalInfo.maxHeight || 'No especificado'}</div>
            <div><strong>Alcance Vertical:</strong> ${service.technicalInfo.verticalReach || 'No especificado'}</div>
            <div><strong>Capacidad de Carga:</strong> ${service.technicalInfo.loadCapacity || 'No especificado'}</div>
            <div><strong>Tipo de Motor:</strong> ${service.technicalInfo.engineType || 'No especificado'}</div>
            <div><strong>Dimensiones:</strong> ${service.technicalInfo.dimensions || 'No especificado'}</div>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 15px;">
            <p style="margin: 0; font-weight: bold; color: #333;">Funcionalidad:</p>
            <p style="margin: 5px 0 0 0; color: #555;">${service.technicalInfo.functionality || 'No especificado'}</p>
          </div>
          ` : `
          <div style="padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; color: #666;">
              <strong>Información técnica no disponible para este servicio.</strong><br>
              Precio: $${Math.round(service.price || 0).toLocaleString()}<br>
              Categoría: ${service.category || 'No especificado'}
            </p>
          </div>
          `}
        </div>
      `).join('')}

      <div style="margin-top: 50px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 0; font-style: italic; color: #666; text-align: center; font-size: 12px;">
          "Este documento es un informe técnico y no constituye una cotización ni un documento de venta."
        </p>
      </div>
    </div>
  `;

  // Mismo código para abrir la ventana e imprimir que ya utilizas
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Informe Técnico Cotización ${quotation.number}</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              body { margin: 0; }
              @page {
                margin: 1cm;
                size: A4;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #333;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      if (window.confirm('¿Deseas imprimir o descargar como PDF el informe técnico?')) {
        printWindow.print();
      }
    }, 500);

    return true;
  } else {
    throw new Error('Error al abrir ventana de impresión');
  }
};
