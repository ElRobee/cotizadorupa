export const generateTechnicalReportPDF = async (quotation, allServices, company) => {
  // Validar que tengamos los datos necesarios
  if (!quotation || !quotation.items || quotation.items.length === 0) {
    alert('La cotización no contiene servicios.');
    return false;
  }

  if (!allServices || allServices.length === 0) {
    alert('No se pudieron cargar los servicios.');
    return false;
  }

  const servicesInQuotation = quotation.items.map(item => {
    // Buscar el servicio por nombre en lugar de serviceId
    const serviceDetails = allServices.find(s => s.name === item.service);
    return serviceDetails;
  }).filter(Boolean); // Filtra los servicios que no se encuentren

  if (servicesInQuotation.length === 0) {
    alert('Esta cotización no contiene servicios válidos para generar un informe técnico.');
    return false;
  }

  // Verificar si al menos un servicio tiene especificaciones
  const servicesWithSpecs = servicesInQuotation.filter(service => 
    service.specs && Object.keys(service.specs).some(key => service.specs[key])
  );

  if (servicesWithSpecs.length === 0) {
    const proceed = confirm('Ningún servicio en esta cotización tiene especificaciones técnicas detalladas. ¿Deseas generar el informe de todas formas?');
    if (!proceed) return false;
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
        <p><strong>Fecha:</strong> ${quotation.date} | <strong>Estado:</strong> ${quotation.status}</p>
        <p><strong>Total de Servicios:</strong> ${servicesInQuotation.length}</p>
      </div>

      ${servicesInQuotation.map((service, index) => `
        <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid;">
          <h3 style="color: #0056b3; border-bottom: 1px solid #0056b3; padding-bottom: 10px; margin-top: 0;">
            ${index + 1}. ${service.name}
          </h3>
          
          <!-- Información básica del servicio -->
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <div><strong>Categoría:</strong> ${service.category || 'No especificado'}</div>
              <div><strong>Precio:</strong> $${Math.round(service.price || 0).toLocaleString()}</div>
              <div><strong>Estado:</strong> ${service.active ? 'Activo' : 'Inactivo'}</div>
            </div>
          </div>
          
          ${service.specs && Object.keys(service.specs).some(key => service.specs[key]) ? `
          <!-- Especificaciones técnicas -->
          <h4 style="color: #333; margin-bottom: 10px;">Especificaciones Técnicas:</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
            ${service.specs.type ? `<div><strong>Tipo:</strong> ${service.specs.type}</div>` : ''}
            ${service.specs.maxPlatformHeight_m ? `<div><strong>Altura de Plataforma:</strong> ${service.specs.maxPlatformHeight_m} metros</div>` : ''}
            ${service.specs.workingHeight_m ? `<div><strong>Altura de Trabajo:</strong> ${service.specs.workingHeight_m} metros</div>` : ''}
            ${service.specs.capacity_kg ? `<div><strong>Capacidad de Carga:</strong> ${service.specs.capacity_kg} kg</div>` : ''}
            ${service.specs.power ? `<div><strong>Tipo de Motor:</strong> ${service.specs.power}</div>` : ''}
            ${service.specs.weight_kg ? `<div><strong>Peso del Equipo:</strong> ${service.specs.weight_kg} kg</div>` : ''}
            ${service.specs.driveType ? `<div><strong>Tipo de Tracción:</strong> ${service.specs.driveType}</div>` : ''}
            ${service.specs.dimensions_m && (service.specs.dimensions_m.length || service.specs.dimensions_m.width || service.specs.dimensions_m.stowedHeight) ? 
              `<div><strong>Dimensiones:</strong> ${service.specs.dimensions_m.length || 0}m x ${service.specs.dimensions_m.width || 0}m x ${service.specs.dimensions_m.stowedHeight || 0}m</div>` : 
              ''}
          </div>
          ` : `
          <div style="padding: 15px; text-align: center; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; color: #856404;">
            <p style="margin: 0;">
              <strong>⚠️ Especificaciones técnicas no disponibles</strong><br>
              <small>Las especificaciones técnicas detalladas no están configuradas para este servicio.</small>
            </p>
          </div>
          `}
        </div>`).join('')}

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
