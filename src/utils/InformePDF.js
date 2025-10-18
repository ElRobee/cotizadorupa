export const generateTechnicalReportPDF = async (quotation, allServices, company) => {
  try {
    // Función para formatear números con punto como separador de miles
    const formatNumber = (num) => {
      return Math.round(num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    console.log('🔧 Generando informe técnico...', { quotation, company });

    // Validar que tengamos los datos necesarios
    if (!quotation || !quotation.items || quotation.items.length === 0) {
      alert('La cotización no contiene servicios.');
      return false;
    }

    // Obtener servicios con fichas técnicas asociadas
    const servicesWithTechnicalSheets = quotation.items.filter(item => item.fichaUrl);

    // Verificar si hay fichas técnicas para generar el informe
    if (servicesWithTechnicalSheets.length === 0) {
      alert(`No hay servicios con fichas técnicas asociadas en esta cotización.\n\nPara generar un informe técnico:\n1. Edita la cotización\n2. Selecciona fichas técnicas para los servicios en el dropdown "Ficha Técnica"\n3. Guarda los cambios\n4. Intenta generar el informe nuevamente`);
      return false;
    }  const htmlContent = `
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
        <p><strong>Total de Servicios:</strong> ${quotation.items.length} | <strong>Con Ficha Técnica:</strong> ${servicesWithTechnicalSheets.length}</p>
      </div>

      <!-- Fichas Técnicas -->
      <div style="margin-bottom: 40px;">
        <h3 style="color: #333; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
          📋 FICHAS TÉCNICAS
        </h3>
        ${servicesWithTechnicalSheets.map((item, index) => `
          <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid;">
            <h4 style="color: #0056b3; margin-top: 0;">
              ${index + 1}. ${item.service}
            </h4>
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 15px; text-align: center;">
              <p style="margin: 0; color: #333;">
                <strong>Ficha Técnica Disponible</strong><br>
                <small>Cantidad: ${item.quantity || 1} unidad(es)</small>
              </p>
            </div>
            
            <!-- Contenedor para la información del PDF -->
            <div style="border: 2px solid #0056b3; border-radius: 8px; overflow: hidden; background-color: #f8f9fa;">
              <!-- Encabezado del PDF -->
              <div style="background-color: #0056b3; color: white; padding: 15px; text-align: center;">
                <h5 style="margin: 0; font-size: 16px;">📄 FICHA TÉCNICA ADJUNTA</h5>
              </div>
              
              <!-- Contenido principal -->
              <div style="padding: 30px; text-align: center;">
                <div style="margin-bottom: 20px;">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="#0056b3" style="margin-bottom: 15px;">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <h4 style="color: #0056b3; margin: 0 0 10px 0;">Documento PDF Disponible</h4>
                  <p style="color: #666; margin: 0 0 20px 0; font-size: 14px;">
                    La ficha técnica detallada está disponible como documento PDF adjunto
                  </p>
                </div>
                
                <!-- Información del archivo -->
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                  <div style="color: #1565c0; font-size: 14px; line-height: 1.6;">
                    <strong>📋 Servicio:</strong> ${item.service}<br>
                    <strong>📄 Archivo:</strong> ${item.fichaUrl.split('/').pop()}<br>
                    <strong>🔗 Ubicación:</strong> ${item.fichaUrl}
                  </div>
                </div>
                
                <!-- Enlace para abrir (solo visible en pantalla) -->
                <div class="screen-only">
                  <a 
                    href="${item.fichaUrl}" 
                    target="_blank" 
                    style="display: inline-block; background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;"
                  >
                    🔗 Abrir Ficha Técnica PDF
                  </a>
                  <br><br>
                  <small style="color: #666;">
                    Haz clic en el enlace para ver la ficha técnica completa en una nueva ventana
                  </small>
                </div>
                
                <!-- Información para impresión -->
                <div class="print-only">
                  <div style="border: 1px dashed #0056b3; padding: 15px; background-color: #f0f8ff;">
                    <strong style="color: #0056b3;">📋 NOTA PARA IMPRESIÓN:</strong><br>
                    <span style="font-size: 12px; color: #666;">
                      La ficha técnica completa está disponible en formato PDF en la ubicación indicada arriba.
                      Para acceder al documento completo, consulte la versión digital de este informe.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

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
              .screen-only { display: none !important; }
              .print-only { display: block !important; }
            }
            .screen-only { display: block; }
            .print-only { display: none; }
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
  } catch (error) {
    console.error('❌ Error al generar informe técnico:', error);
    alert(`Error al generar el informe técnico: ${error.message}`);
    return false;
  }
};
