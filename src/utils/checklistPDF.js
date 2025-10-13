export const generateChecklistPDF = async (checklistData, company) => {
  const getStatusIcon = (value) => {
    switch (value) {
      case 'B': return '✓';
      case 'R': return '✗';
      case 'NA': return 'N/A';
      default: return '?';
    }
  };

  const getStatusColor = (value) => {
    switch (value) {
      case 'B': return 'color: #059669;'; // green
      case 'R': return 'color: #dc2626;'; // red
      case 'NA': return 'color: #6b7280;'; // gray
      default: return 'color: #374151;';
    }
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <!-- Header con Logo y Datos de la Empresa -->
      <div style="display: flex; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        ${company?.logo 
          ? `<img src="${company.logo}" alt="Logo empresa" style="width: 300px; height: 120px; object-fit: contain; border-radius: 8px; margin-right: 20px;" />`
          : ''
        }
        <div style="text-align: left;">
          <h1 style="color: #333; margin: 0;">${company?.razonSocial || 'Empresa'}</h1>
          <p style="margin: 5px 0;">${company?.direccion || ''} - ${company?.ciudad || ''}, ${company?.region || ''}</p>
          <p style="margin: 5px 0;">RUT: ${company?.rut || ''} | Tel: ${company?.telefono || ''}</p>
          <p style="margin: 5px 0;">Email: ${company?.email || ''}</p>
        </div>
      </div>

      <!-- Título del Documento -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0; font-size: 24px;">CHECKLIST DE VEHÍCULO</h2>
        <p style="color: #666; margin: 10px 0;">Control de Inspección Vehicular</p>
        <p style="color: #666; margin: 10px 0;">Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <!-- Datos del Vehículo -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #333; margin: 0 0 15px 0;">INFORMACIÓN DEL VEHÍCULO</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 5px 0;"><strong>Tipo de Vehículo:</strong> ${checklistData.tipoVehiculo}</p>
            <p style="margin: 5px 0;"><strong>Modelo:</strong> ${checklistData.modelo}</p>
            <p style="margin: 5px 0;"><strong>Patente:</strong> ${checklistData.patente}</p>
            <p style="margin: 5px 0;"><strong>Empresa:</strong> ${checklistData.empresa}</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Conductor:</strong> ${checklistData.conductor}</p>
            <p style="margin: 5px 0;"><strong>RUT:</strong> ${checklistData.rut}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${checklistData.fecha}</p>
            <p style="margin: 5px 0;"><strong>KM Inicial:</strong> ${checklistData.kmInicial} | <strong>KM Final:</strong> ${checklistData.kmFinal}</p>
          </div>
        </div>
      </div>

      <!-- Checklist -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; margin: 0 0 20px 0;">LISTA DE VERIFICACIÓN</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Ítem de Verificación</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; width: 100px;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${checklistData.checklist.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.label}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; ${getStatusColor(item.value)}">
                  ${getStatusIcon(item.value)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Leyenda -->
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
        <h4 style="color: #1e40af; margin: 0 0 10px 0;">LEYENDA</h4>
        <div style="display: flex; gap: 30px; align-items: center;">
          <span style="color: #059669; font-weight: bold;">✓ = Bueno (B)</span>
          <span style="color: #dc2626; font-weight: bold;">✗ = Regular/Malo (R)</span>
          <span style="color: #6b7280; font-weight: bold;">N/A = No Aplica</span>
        </div>
      </div>

      <!-- Observaciones -->
      ${checklistData.observaciones ? `
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">OBSERVACIONES</h4>
          <p style="margin: 0; color: #78350f;">${checklistData.observaciones}</p>
        </div>
      ` : ''}

      <!-- Firmas -->
      <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
        <div style="text-align: center;">
          <div style="border-top: 2px solid #333; margin-bottom: 10px; padding-top: 10px;">
            <strong>Firma del Conductor</strong>
          </div>
          <p style="margin: 0; color: #666;">Nombre: ${checklistData.conductor}</p>
          <p style="margin: 0; color: #666;">RUT: ${checklistData.rut}</p>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 2px solid #333; margin-bottom: 10px; padding-top: 10px;">
            <strong>Firma del Supervisor</strong>
          </div>
          <p style="margin: 0; color: #666;">Nombre: ________________</p>
          <p style="margin: 0; color: #666;">RUT: ________________</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 0; font-style: italic; color: #666; text-align: center; font-size: 12px;">
          "Documento de Control Vehicular - No constituye certificación técnica oficial"<br>
          Checklist válido para: ${checklistData.fecha} | Generado por: ${company?.razonSocial || 'Sistema de Control Vehicular'}<br>
          Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}
        </p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Checklist de Vehículo - ${checklistData.patente} - ${checklistData.empresa}</title>
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
            table {
              page-break-inside: avoid;
            }
            tr {
              page-break-inside: avoid;
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
      if (window.confirm('¿Deseas imprimir o descargar el checklist como PDF?')) {
        printWindow.print();
      }
    }, 500);

    return true;
  } else {
    throw new Error('Error al abrir ventana de impresión');
  }
};