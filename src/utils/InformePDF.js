// Nueva función: convertir cada página del PDF en imágenes (data URLs) y devolver HTML con imágenes
const convertPdfToImage = async (pdfUrl) => {
  console.log(`📄 Preparando conversión PDF → imágenes: ${pdfUrl}`);

  // validación rápida
  if (!pdfUrl || !pdfUrl.toLowerCase().includes('.pdf')) {
    console.error('URL de PDF inválido:', pdfUrl);
    return null;
  }

  try {
    // Cargar pdfjs-dist dinámicamente para evitar errores de CSP/Netlify en tiempo de build
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');

    // Intentar localizar el worker en node_modules; bundlers como CRA / craco manejan esto
    try {
      // Usar versión ESM worker si está disponible
      // eslint-disable-next-line global-require
      const workerSrc = (await import('pdfjs-dist/build/pdf.worker.entry')).default || '';
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    } catch (wErr) {
      // Fallback: dejar que el bundler inyecte el worker o usar CDN si el equipo lo permite
      console.warn('No se pudo cargar pdf.worker de forma explícita, confiando en el bundler:', wErr?.message || wErr);
    }

    // Fetch del PDF como arrayBuffer (evita problemas de CORS si el servidor lo permite)
    const resp = await fetch(pdfUrl);
    if (!resp.ok) throw new Error(`No se pudo descargar el PDF: ${resp.status} ${resp.statusText}`);
    const arrayBuffer = await resp.arrayBuffer();

    // Cargar el documento PDF
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log(`✅ PDF cargado: ${pdf.numPages} página(s)`);

    const images = [];

    // Limitar para evitar bloquear la UI si son PDFs enormes - procesar todas las páginas según requerimiento
    const pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Renderizar a canvas con escala optimizada para impresión
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Convertir a data URL (JPEG para mejor compatibilidad y tamaño)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      images.push(dataUrl);

      // Liberar memoria del canvas
      // (no hay método de destrucción explícito, dejar que GC haga su trabajo)
    }

    // Crear HTML con todas las imágenes (cada página como <img>)
    const title = pdfUrl.split('/').pop().replace('.pdf', '').replace(/-/g, ' ');

    const imagesHtml = images.map((src, idx) => `
      <div style="page-break-inside: avoid; page-break-after: auto; margin-bottom: 10px;">
        <img src="${src}" alt="${title} - página ${idx + 1}" style="width:100%; height:auto; border:1px solid #e6e6e6; border-radius:6px; display:block;" />
        <p style="text-align:center; font-size:11px; color:#666; margin:5px 0 0 0;">Página ${idx + 1} de ${images.length}</p>
      </div>
    `).join('');

    const html = `
      <div class="pdf-container" style="margin:20px 0; page-break-inside: avoid;">
        <h4 style="color:#333; margin:0 0 10px 0; font-size:14px; font-weight:bold;">📋 ${title}</h4>
        <div style="background-color:#f8f9fa; padding:12px; border-radius:6px; margin-bottom:12px; text-align:center;">
          <small style="color:#333;">Documento procesado y renderizado en memoria (${images.length} página(s))</small>
        </div>
        ${imagesHtml}
        <p style="text-align:center; margin-top:8px; font-size:12px; color:#0066cc;"><a href="${pdfUrl}" target="_blank" style="color: #0066cc; text-decoration: none;">🔗 Abrir PDF original</a></p>
      </div>
    `;

    return html;

  } catch (error) {
    console.error('❌ Error convirtiendo PDF a imágenes:', error);
    return `
      <div style="border:1px solid #ff6b6b; padding:15px; margin:10px 0; background-color:#ffe6e6; border-radius:4px;">
        <p style="margin:0; color:#d63031;">⚠️ No se pudo procesar la ficha técnica: ${pdfUrl.split('/').pop()}</p>
        <p style="margin:8px 0 0 0;"><a href="${pdfUrl}" target="_blank">Abrir PDF original</a></p>
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
                  margin: 10mm;
                  size: A4;
                }
                
                /* Optimización para imágenes de PDF */
                img {
                  max-width: 100%;
                  height: auto;
                  page-break-inside: avoid;
                }
                
                /* Evitar dividir contenedores */
                div {
                  page-break-inside: avoid;
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
