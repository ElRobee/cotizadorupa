export const generatePaymentStatusPDF = async (client, pendingQuotations, company, totalAmount) => {
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
        <h2 style="color: #333; margin: 0; font-size: 24px;">INFORME DE ESTADO DE PAGO</h2>
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
            <p style="margin: 5px 0;"><strong>Cargo:</strong> ${client.cargo || ''}</p>
          </div>
        </div>
      </div>

      <!-- Resumen ejecutivo -->
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin: 0 0 15px 0;">RESUMEN EJECUTIVO</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
          <div>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #dc3545;">${pendingQuotations.length}</p>
            <p style="margin: 5px 0; color: #856404; font-weight: 500;">Cotizaciones Pendientes</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #dc3545;">$${Math.round(totalAmount).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #856404; font-weight: 500;">Monto Total Pendiente</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #dc3545;">$${Math.round(totalAmount / pendingQuotations.length || 0).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #856404; font-weight: 500;">Promedio por Cotización</p>
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
                <tr style="${isExpired ? 'background-color: #f8d7da;' : isExpiringSoon ? 'background-color: #fff3cd;' : ''}">
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">${quotation.number}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${quotation.date}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${quotation.validUntil}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: ${
                    isExpired ? '#721c24' : isExpiringSoon ? '#856404' : '#155724'
                  }; font-weight: 500;">
                    ${isExpired ? `Vencida (${Math.abs(daysUntilExpiry)} días)` : 
                      isExpiringSoon ? `${daysUntilExpiry} días` : 
                      `${daysUntilExpiry} días`}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: 500;">
                    $${Math.round(quotation.total || 0).toLocaleString()}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #e9ecef; font-weight: bold;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 12px; text-align: right;">TOTAL GENERAL:</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-size: 18px; color: #dc3545;">
                $${Math.round(totalAmount).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Análisis de vencimientos -->
      ${(() => {
        const expired = pendingQuotations.filter(q => {
          const validUntilDate = new Date(q.validUntil);
          const today = new Date();
          return validUntilDate < today;
        });
        
        const expiringSoon = pendingQuotations.filter(q => {
          const validUntilDate = new Date(q.validUntil);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((validUntilDate - today) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        });

        const expiredAmount = expired.reduce((sum, q) => sum + (q.total || 0), 0);
        const expiringSoonAmount = expiringSoon.reduce((sum, q) => sum + (q.total || 0), 0);

        return `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #6c757d;">
            <h3 style="color: #495057; margin: 0 0 15px 0;">ANÁLISIS DE VENCIMIENTOS</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
              <div style="text-align: center; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #dee2e6;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #28a745;">${pendingQuotations.length - expired.length - expiringSoon.length}</p>
                <p style="margin: 5px 0; color: #495057; font-size: 14px;">Cotizaciones Vigentes</p>
                <p style="margin: 0; font-weight: bold; color: #28a745;">$${Math.round(totalAmount - expiredAmount - expiringSoonAmount).toLocaleString()}</p>
              </div>
              <div style="text-align: center; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #dee2e6;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffc107;">${expiringSoon.length}</p>
                <p style="margin: 5px 0; color: #495057; font-size: 14px;">Vencen Pronto (≤7 días)</p>
                <p style="margin: 0; font-weight: bold; color: #ffc107;">$${Math.round(expiringSoonAmount).toLocaleString()}</p>
              </div>
              <div style="text-align: center; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #dee2e6;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc3545;">${expired.length}</p>
                <p style="margin: 5px 0; color: #495057; font-size: 14px;">Cotizaciones Vencidas</p>
                <p style="margin: 0; font-weight: bold; color: #dc3545;">$${Math.round(expiredAmount).toLocaleString()}</p>
              </div>
            </div>
          </div>
        `;
      })()}

      <!-- Recomendaciones -->
      <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #17a2b8;">
        <h3 style="color: #0c5460; margin: 0 0 15px 0;">RECOMENDACIONES</h3>
        <ul style="margin: 0; padding-left: 20px; color: #0c5460;">
          ${pendingQuotations.filter(q => {
            const validUntilDate = new Date(q.validUntil);
            const today = new Date();
            return validUntilDate < today;
          }).length > 0 ? '<li style="margin: 8px 0;">Contactar al cliente para renovar las cotizaciones vencidas o proceder con la facturación.</li>' : ''}
          
          ${pendingQuotations.filter(q => {
            const validUntilDate = new Date(q.validUntil);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((validUntilDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
          }).length > 0 ? '<li style="margin: 8px 0;">Realizar seguimiento de las cotizaciones que vencen pronto para asegurar el cierre de ventas.</li>' : ''}
          
          <li style="margin: 8px 0;">Considerar implementar un programa de seguimiento automático para mejorar la tasa de conversión.</li>
          <li style="margin: 8px 0;">Revisar periódicamente los términos de validez de las cotizaciones para optimizar el proceso comercial.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
        <p style="margin: 0; font-style: italic; color: #6c757d; text-align: center; font-size: 12px;">
          "Informe de Estado de Pago generado automáticamente por el Sistema de Cotizaciones"<br>
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
          <title>Estado de Pago - ${client.empresa} - ${company?.razonSocial || 'Sistema'}</title>
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