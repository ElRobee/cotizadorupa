export const generatePaymentStatusPDF = async (client, pendingQuotations, company, totalAmount) => {
  // Función para formatear números con punto como separador de miles
  const formatNumber = (num) => {
    return Math.round(num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <!-- Header con logo y datos de la empresa -->
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

      <!-- Título del informe -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0; font-size: 24px;">INFORME DE COBRANZA</h2>
        <p style="color: #666; margin: 10px 0;">Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <!-- Información del cliente -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #333;">
        <h3 style="color: #333; margin: 0 0 15px 0;">INFORMACIÓN DEL CLIENTE</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 5px 0;"><strong>Empresa:</strong> ${client.empresa || ''}</p>
            <p style="margin: 5px 0;"><strong>RUT:</strong> ${client.rut || ''}</p>
            <p style="margin: 5px 0;"><strong>Dirección:</strong> ${client.direccion || ''}</p>
            <p style="margin: 5px 0;"><strong>Ciudad:</strong> ${client.ciudad || ''}, ${client.region || ''}</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Contacto:</strong> ${client.encargado || ''}</p>
            <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${client.telefono || ''}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${client.email || ''}</p>
          </div>
        </div>
      </div>

      <!-- Detalle de cotizaciones pendientes -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; margin: 0 0 20px 0;">DETALLE DE COTIZACIONES PENDIENTES</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">N° Cotización</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Fecha Emisión</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Válida Hasta</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Días Vencimiento</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${pendingQuotations.map(quotation => {
              const validUntilDate = new Date(quotation.validUntil);
              const today = new Date();
              const daysUntilExpiry = Math.ceil((validUntilDate - today) / (1000 * 60 * 60 * 24));
              const isExpired = daysUntilExpiry < 0;
              const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
              
              return `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">${quotation.number}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${quotation.date}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${quotation.validUntil}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    ${isExpired ? `Vencida (${Math.abs(daysUntilExpiry)} días)` : 
                      `${daysUntilExpiry} días`}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: 500;">
                    $${formatNumber(quotation.total || 0)}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #e9ecef; font-weight: bold;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 12px; text-align: right;">TOTAL GENERAL:</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-size: 18px; color: #dc3545;">
                $${formatNumber(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
        <p style="margin: 0; font-style: italic; color: #6c757d; text-align: center; font-size: 12px;">
          "Informe de Estado de Cobranza generado automáticamente por el Sistema de Cotizaciones"<br>
          Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}<br>
          Este documento es solo informativo y no constituye compromiso contractual.
        </p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Estado de Cobranza - ${client.empresa} - ${company?.razonSocial || 'Sistema'}</title>
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
      if (window.confirm('¿Deseas imprimir o descargar el informe como PDF?')) {
        printWindow.print();
      }
    }, 500);

    return true;
  } else {
    throw new Error('Error al abrir ventana de impresión');
  }
};
