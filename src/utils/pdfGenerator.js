export const generateQuotationPDF = async (quotation, company, client) => {
  // Calcular totales
  const calculateTotals = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const iva = subtotal * 0.19;
    const totalBruto = subtotal + iva;
    const discountAmount = totalBruto * (discount / 100);
    const total = totalBruto - discountAmount;
    return { subtotal, iva, totalBruto, discountAmount, total };
  };

  const totals = calculateTotals(quotation.items, quotation.discount);

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
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h2 style="color: #333;">COTIZACIÓN</h2>
          <p><strong>Número:</strong> ${quotation.number}</p>
          <p><strong>Fecha:</strong> ${quotation.date}</p>
          <p><strong>Válida hasta:</strong> ${quotation.validUntil}</p>
          <p><strong>Estado:</strong> ${quotation.status}</p>
          <p><strong>Prioridad:</strong> ${quotation.priority}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="color: #333;">CLIENTE</h3>
          <p><strong>${client?.empresa || quotation.client}</strong></p>
          <p>RUT: ${client?.rut || ''}</p>
          <p>${client?.direccion || ''} - ${client?.ciudad || ''}, ${client?.region || ''}</p>
          <p>Contacto: ${client?.encargado || ''}</p>
          <p>Tel: ${client?.telefono || ''}</p>
          <p>Email: ${client?.email || ''}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cantidad</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Servicio</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Precio Unit.</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.service}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${Math.round(item.unitPrice || 0).toLocaleString()}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${Math.round(item.total || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${quotation.notes ? `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #333;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Notas:</h4>
          <p style="margin: 0; color: #666;">${quotation.notes}</p>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 350px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>$${totals.subtotal.toLocaleString()}</span>
          </div>
                      <span>$${Math.round(totals.subtotal || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>IVA (19%):</span>
            <span>$${Math.round(totals.iva || 0).toLocaleString()}</span>
          </div>
          ${totals.discountAmount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #dc2626;">
            <span>Descuento:</span>
              <span>-$${Math.round(totals.discountAmount || 0).toLocaleString()}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px;">
            <span>TOTAL:</span>
            <span>$${Math.round(totals.total || 0).toLocaleString()}</span>
        </div>
      </div>

      <div style="margin-top: 50px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
        <p style="margin: 0; font-style: italic; color: #666; text-align: center; font-size: 12px;">
          "Documento válido sólo como Cotización; No constituye venta ni recibo de dinero; No válido como documento tributario."<br>
          Cotización válida hasta: ${quotation.validUntil} | Generada por: ${quotation.createdBy || 'Sistema'}
        </p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Cotización ${quotation.number} - ${company.razonSocial}</title>
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
      if (window.confirm('¿Deseas imprimir o descargar como PDF?')) {
        printWindow.print();
      }
    }, 500);

    return true;
  } else {
    throw new Error('Error al abrir ventana de impresión');
  }
};
