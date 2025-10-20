// Función para crear iframe de PDF optimizado para impresión
const convertPdfToImage = async (pdfUrl) => {
  console.log(`📄 Preparando PDF: ${pdfUrl}`);
  
  try {
    if (!pdfUrl || !pdfUrl.includes('.pdf')) {
      console.error('URL de PDF inválido:', pdfUrl);
      return null;
    }
    
    console.log(`✅ PDF válido, preparando iframe`);
    
    return `
      <div class="pdf-container" style="margin: 20px 0; page-break-inside: avoid;">
        <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
          📋 ${pdfUrl.split('/').pop().replace('.pdf', '').replace(/-/g, ' ')}
        </h4>
        <div class="screen-only" style="margin-bottom: 10px; padding: 8px; background: #e8f4ff; border-left: 4px solid #0066cc; font-size: 12px;">
          💡 <strong>Nota:</strong> Para PDFs multipágina, usa el botón "Imprimir PDF directo" para obtener el documento completo.
        </div>
        <iframe 
          src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width" 
          width="100%" 
          height="800" 
          style="border: 2px solid #e0e0e0; border-radius: 8px; background: white; display: block !important;"
          class="pdf-iframe"
          data-pdf-url="${pdfUrl}"
          frameborder="0"
          allowfullscreen>
          <p>Su navegador no soporta iframes. <a href="${pdfUrl}" target="_blank">Abrir PDF</a></p>
        </iframe>
        <p class="screen-only" style="margin: 10px 0 0 0; font-size: 12px; color: #666; text-align: center;">
          <a href="${pdfUrl}" target="_blank" style="color: #0066cc; text-decoration: none; margin-right: 15px;">🔗 Abrir en nueva ventana</a>
          <button onclick="window.open('${pdfUrl}', '_blank')" 
                  style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">
            🖨️ Imprimir PDF directo
          </button>
        </p>
        <div class="print-only" style="display: none; margin: 0; padding: 25px; border: 3px solid #0056b3; background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%); text-align: center; border-radius: 8px;">
          <h3 style="color: #0056b3; margin: 0 0 15px 0; font-size: 18px;">📄 Ficha Técnica</h3>
          <p style="margin: 10px 0; color: #333; font-size: 14px; font-weight: bold;">
            ${pdfUrl.split('/').pop().replace('.pdf', '').replace(/-/g, ' ')}
          </p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0; color: #666; font-size: 13px;">
              <strong>📋 Nombre del archivo:</strong><br>
              ${pdfUrl.split('/').pop()}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 13px;">
              <strong>🔗 Ubicación:</strong><br>
              ${pdfUrl}
            </p>
          </div>
          <p style="margin: 15px 0 0 0; color: #0056b3; font-size: 12px; font-style: italic;">
            ℹ️ Para visualizar el contenido completo del PDF, acceda a la ubicación indicada arriba
          </p>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('❌ Error preparando PDF:', error);
    return `
      <div style="border: 1px solid #ff6b6b; padding: 15px; margin: 10px 0; background-color: #ffe6e6; border-radius: 4px;">
        <p style="margin: 0; color: #d63031;">⚠️ Error cargando ficha técnica: ${pdfUrl.split('/').pop()}</p>
      </div>
    `;
  }
};

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
    }

    // Mostrar confirmación antes de procesar con información clara
    const message = `Se van a incluir ${servicesWithTechnicalSheets.length} ficha(s) técnica(s) en el informe.\n\n📋 IMPORTANTE SOBRE PDFs:\n• En pantalla: Verás los PDFs embebidos\n• Al imprimir: Se mostrará información de cada ficha técnica\n• Para PDFs completos: Usa el botón "Imprimir PDF directo" de cada ficha\n\n¿Deseas continuar?`;
    const shouldContinue = confirm(message);
    if (!shouldContinue) {
      return false;
    }

    // Convertir PDFs a HTML embebido
    const servicesWithImages = [];
    console.log('🔄 Iniciando preparación de PDFs embebidos...');
    
    for (let i = 0; i < servicesWithTechnicalSheets.length; i++) {
      const item = servicesWithTechnicalSheets[i];
      console.log(`📄 Procesando ${i + 1}/${servicesWithTechnicalSheets.length}: ${item.service}`);
      console.log(`🔗 URL: ${item.fichaUrl}`);
      
      try {
        const result = await convertPdfToImage(item.fichaUrl);
        console.log(`✅ Éxito para ${item.service}:`, result ? 'HTML generado' : 'Error');
        
        servicesWithImages.push({
          ...item,
          pdfEmbed: result,
          success: result !== null
        });
      } catch (error) {
        console.error(`❌ Error procesando ${item.service}:`, error);
        servicesWithImages.push({
          ...item,
          pdfEmbed: null,
          success: false,
          error: error.message
        });
      }
    }

    // Verificar éxito de procesamiento
    const successfullyProcessed = servicesWithImages.filter(item => item.success).length;
    
    if (successfullyProcessed === 0) {
      alert('❌ No se pudieron procesar las fichas técnicas.\n\nVerifica que:\n- Los archivos PDF existen\n- La conexión a internet es estable\n- Los archivos son accesibles');
      
      // Continuar con todas las fichas como enlaces
      console.log('⚠️ Continuando con enlaces únicamente');
    } else if (successfullyProcessed < servicesWithImages.length) {
      const failedCount = servicesWithImages.length - successfullyProcessed;
      alert(`⚠️ Se procesaron ${successfullyProcessed} de ${servicesWithImages.length} fichas técnicas.\n\n${failedCount} ficha(s) aparecerán como enlaces en lugar de imágenes.`);
    } else {
      console.log(`🎉 Todas las fichas técnicas se procesaron correctamente`);
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
        <p><strong>Total de Servicios:</strong> ${quotation.items.length} | <strong>Con Ficha Técnica:</strong> ${servicesWithImages.length}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <h3 style="color: #333; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
          📋 FICHAS TÉCNICAS
        </h3>
        ${servicesWithImages.map((item, index) => `
          <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 30px; border-radius: 8px; page-break-inside: avoid;">
            <h4 style="color: #0056b3; margin-top: 0; margin-bottom: 15px;">
              ${index + 1}. ${item.service}
            </h4>
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
              <p style="margin: 0; color: #333;">
                <strong>Cantidad:</strong> ${item.quantity || 1} unidad(es) | 
                <strong>Precio Unitario:</strong> $${formatNumber(item.price)} | 
                <strong>Subtotal:</strong> $${formatNumber((item.price || 0) * (item.quantity || 1))}
              </p>
            </div>
            
            ${item.success && item.pdfEmbed ? 
              item.pdfEmbed
            : `
              <div style="border: 2px solid #ffc107; border-radius: 8px; background-color: #fff3cd; padding: 25px; text-align: center;">
                <h5 style="color: #856404; margin: 0 0 10px 0;">⚠️ Error cargando ficha técnica</h5>
                <p style="color: #856404; margin: 10px 0; font-size: 14px;">
                  ${item.error || 'No se pudo procesar el archivo PDF'}
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                  <strong style="color: #495057;">📄 Archivo:</strong> ${item.fichaUrl.split('/').pop()}<br>
                  <strong style="color: #495057;">🔗 Ubicación:</strong> ${item.fichaUrl}
                </div>
                <a href="${item.fichaUrl}" target="_blank" style="background: #ffc107; color: #856404; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  📖 Abrir PDF Original
                </a>
              </div>
            `}
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

    // Abrir ventana para impresión con CSS específico para impresión
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Informe Técnico Cotización ${quotation.number}</title>
            <meta charset="UTF-8">
            <style>
              * {
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
                color: #333;
                margin: 0;
                padding: 0;
              }
              
              @media print {
                body { 
                  margin: 0; 
                  padding: 0;
                }
                
                @page {
                  margin: 1cm;
                  size: A4;
                }
                
                /* Ocultar elementos solo de pantalla */
                .screen-only { 
                  display: none !important; 
                }
                
                /* Mostrar elementos de impresión */
                .print-only { 
                  display: block !important; 
                }
                
                /* Configuración de contenedores PDF */
                .pdf-container {
                  page-break-before: auto;
                  page-break-after: auto;
                  page-break-inside: avoid;
                  margin: 0 0 20px 0;
                  padding: 0;
                  width: 100%;
                }
                
                /* OCULTAR iframes en impresión - causan páginas en blanco */
                .pdf-container .pdf-iframe {
                  display: none !important;
                  height: 0 !important;
                  min-height: 0 !important;
                  visibility: hidden !important;
                }
                
                /* Mostrar tarjeta informativa del PDF */
                .pdf-container .print-only {
                  display: block !important;
                  page-break-inside: avoid;
                  margin: 0;
                  padding: 20px;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  color-adjust: exact;
                }
                
                /* Evitar saltos de página innecesarios */
                .pdf-container h4 {
                  page-break-after: avoid;
                  margin-bottom: 10px;
                }
                
                /* Optimizar espaciado */
                h1, h2, h3, h4, h5, h6 {
                  page-break-after: avoid;
                }
                
                /* Eliminar espacios en blanco extra */
                .pdf-container > * {
                  margin-top: 0;
                }
              }
              
              @media screen {
                .screen-only { display: block; }
                .print-only { display: none; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Esperar un momento para que el contenido cargue y luego imprimir
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 800);
      
      console.log('🖨️ Ventana de impresión abierta');
      return true;
    } else {
      alert('No se pudo abrir la ventana de impresión. Verifica que las ventanas emergentes estén permitidas.');
      return false;
    }

  } catch (error) {
    console.error('❌ Error generando informe técnico:', error);
    alert('Error generando el informe técnico. Verifica la consola para más detalles.');
    return false;
  }
};
