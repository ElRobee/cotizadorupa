// Función para convertir PDF a imagen usando PDF.js
const convertPdfToImage = async (pdfUrl) => {
  try {
    console.log(`🔄 Iniciando conversión de: ${pdfUrl}`);
    
    // Verificar acceso al PDF primero
    console.log(`1️⃣ Verificando acceso al PDF...`);
    const isAccessible = await checkPdfAccess(pdfUrl);
    if (!isAccessible) {
      throw new Error('PDF no accesible - verificar URL o permisos');
    }
    console.log(`✅ PDF accesible`);

    // Cargar PDF.js desde CDN si no está disponible
    console.log(`2️⃣ Verificando PDF.js...`);
    if (typeof window.pdfjsLib === 'undefined') {
      console.log(`📦 Cargando PDF.js desde CDN...`);
      await loadPdfJs();
    }
    console.log(`✅ PDF.js disponible`);

    const pdfjsLib = window.pdfjsLib;
    
    // Configurar worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    // Cargar el PDF
    console.log(`3️⃣ Cargando documento PDF...`);
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    console.log(`✅ PDF cargado: ${pdf.numPages} páginas`);
    
    const images = [];
    const maxPages = Math.min(pdf.numPages, 2); // Máximo 2 páginas para no sobrecargar
    console.log(`4️⃣ Convirtiendo ${maxPages} página(s) a imagen...`);
    
    // Convertir cada página a imagen
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`  📄 Procesando página ${pageNum}/${maxPages}...`);
      const page = await pdf.getPage(pageNum);
      const scale = 1.2; // Escala para buena calidad
      const viewport = page.getViewport({ scale });
      
      // Crear canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Renderizar página con fondo blanco
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convertir canvas a imagen base64
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85); // JPEG para mejor compresión
      images.push(imageDataUrl);
      console.log(`  ✅ Página ${pageNum} convertida (${Math.round(imageDataUrl.length / 1024)}KB)`);
    }
    
    console.log(`🎉 Conversión completada: ${images.length} imágenes generadas`);
    return images;
  } catch (error) {
    console.error('❌ Error en convertPdfToImage:', error);
    throw error; // Re-lanzar el error para manejo en el nivel superior
  }
};

// Función para cargar PDF.js desde CDN
const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.pdfjsLib !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      // Configurar worker después de cargar
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        console.log('✅ PDF.js cargado correctamente desde CDN');
      }
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Error cargando PDF.js desde CDN');
      reject(new Error('No se pudo cargar PDF.js'));
    };
    document.head.appendChild(script);
    
    // Timeout de seguridad
    setTimeout(() => {
      if (typeof window.pdfjsLib === 'undefined') {
        reject(new Error('Timeout cargando PDF.js'));
      }
    }, 10000);
  });
};

// Función para verificar si un URL es accesible
const checkPdfAccess = async (url) => {
  try {
    console.log(`🔍 Verificando acceso a: ${url}`);
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`📡 Respuesta: ${response.status} ${response.statusText}`);
    return response.ok;
  } catch (error) {
    console.error(`❌ Error verificando acceso a PDF ${url}:`, error);
    return false;
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

    // Mostrar confirmación antes de procesar
    const shouldContinue = confirm(`Se van a procesar ${servicesWithTechnicalSheets.length} ficha(s) técnica(s) PDF.\n\nEsto puede tomar unos momentos. ¿Deseas continuar?`);
    if (!shouldContinue) {
      return false;
    }

    // Convertir PDFs a imágenes
    const servicesWithImages = [];
    console.log('🔄 Iniciando conversión de PDFs a imágenes...');
    
    for (let i = 0; i < servicesWithTechnicalSheets.length; i++) {
      const item = servicesWithTechnicalSheets[i];
      console.log(`📄 Procesando ${i + 1}/${servicesWithTechnicalSheets.length}: ${item.service}`);
      console.log(`🔗 URL: ${item.fichaUrl}`);
      
      try {
        const images = await convertPdfToImage(item.fichaUrl);
        console.log(`✅ Éxito para ${item.service}:`, images ? `${images.length} imágenes` : 'null');
        servicesWithImages.push({
          ...item,
          images: images,
          success: images !== null && images.length > 0
        });
      } catch (error) {
        console.error(`❌ Error procesando ${item.service}:`, error);
        servicesWithImages.push({
          ...item,
          images: null,
          success: false,
          error: error.message
        });
      }
    }

    console.log('✅ Fichas técnicas procesadas:', servicesWithImages);
    
    // Verificar si al menos una ficha se procesó correctamente
    const successfullyProcessed = servicesWithImages.filter(item => item.success).length;
    
    if (successfullyProcessed === 0) {
      // Si ninguna se procesó, preguntar si continuar solo con enlaces
      const continueWithLinks = confirm('❌ No se pudieron procesar las fichas técnicas PDF como imágenes.\n\n¿Deseas continuar generando el informe solo con enlaces a los PDFs?\n\n(Los enlaces no estarán disponibles en la versión impresa)');
      
      if (!continueWithLinks) {
        return false;
      }
      
      // Continuar con todas las fichas como enlaces
      console.log('⚠️ Continuando con enlaces únicamente');
    } else if (successfullyProcessed < servicesWithImages.length) {
      const failedCount = servicesWithImages.length - successfullyProcessed;
      alert(`⚠️ Se procesaron ${successfullyProcessed} de ${servicesWithImages.length} fichas técnicas.\n\n${failedCount} ficha(s) aparecerán como enlaces en lugar de imágenes.`);
    } else {
      console.log(`🎉 Todas las fichas técnicas se procesaron correctamente`);
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
        <p><strong>Total de Servicios:</strong> ${quotation.items.length} | <strong>Con Ficha Técnica:</strong> ${servicesWithImages.length}</p>
      </div>

      <!-- Fichas Técnicas -->
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
                <strong>Ficha Técnica</strong><br>
                <small>Cantidad: ${item.quantity || 1} unidad(es) | Archivo: ${item.fichaUrl.split('/').pop()}</small>
              </p>
            </div>
            
            <!-- Imágenes del PDF convertido o enlace de respaldo -->
            ${item.success && item.images && item.images.length > 0 ? 
              `<!-- PDF convertido a imágenes -->
              ${item.images.map((imageData, pageIndex) => `
                <div style="margin-bottom: 25px; text-align: center; page-break-inside: avoid;">
                  ${item.images.length > 1 ? `<h5 style="color: #666; margin-bottom: 15px; font-size: 14px;">📄 Página ${pageIndex + 1} de ${item.images.length}</h5>` : ''}
                  <div style="border: 2px solid #e0e0e0; border-radius: 8px; padding: 10px; background-color: white; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <img 
                      src="${imageData}" 
                      style="max-width: 100%; height: auto; display: block; border-radius: 4px;"
                      alt="Ficha Técnica - ${item.service} - Página ${pageIndex + 1}"
                    />
                  </div>
                </div>
              `).join('')}` 
            : `
              <!-- Respaldo: Enlace al PDF cuando no se pudo convertir -->
              <div style="border: 2px solid #ffc107; border-radius: 8px; background-color: #fff3cd; padding: 25px; text-align: center;">
                <div style="margin-bottom: 15px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#856404" style="margin-bottom: 10px;">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <h5 style="color: #856404; margin: 0;">⚠️ Ficha técnica disponible como enlace</h5>
                  <p style="color: #856404; margin: 10px 0; font-size: 14px;">
                    ${item.error ? `Error: ${item.error}` : 'No se pudo convertir el PDF a imagen'}
                  </p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                  <strong style="color: #495057;">📄 Archivo:</strong> ${item.fichaUrl.split('/').pop()}<br>
                  <strong style="color: #495057;">🔗 Ubicación:</strong> ${item.fichaUrl}
                </div>
                
                <div class="screen-only">
                  <a 
                    href="${item.fichaUrl}" 
                    target="_blank" 
                    style="display: inline-block; background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; border: 2px solid #ffca2c;"
                  >
                    📎 Abrir PDF Original
                  </a>
                </div>
                
                <div class="print-only">
                  <p style="color: #856404; font-size: 12px; margin: 10px 0;">
                    📋 <strong>Para impresión:</strong> Consulte el archivo PDF en la ubicación indicada arriba.
                  </p>
                </div>
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

// Función de diagnóstico para probar PDF.js (para debugging)
window.testPdfJs = async () => {
  console.log('🔬 DIAGNÓSTICO PDF.js');
  console.log('='.repeat(50));
  
  try {
    console.log('1️⃣ Probando carga de PDF.js...');
    await loadPdfJs();
    console.log('✅ PDF.js cargado correctamente');
    
    console.log('2️⃣ Verificando configuración...');
    console.log('pdfjsLib disponible:', typeof window.pdfjsLib !== 'undefined');
    console.log('Worker configurado:', window.pdfjsLib?.GlobalWorkerOptions?.workerSrc);
    
    // Probar con un PDF de ejemplo
    const testUrl = '/fichas/GRUA-HORQUILLA-TOYOTA-3Y4TON.pdf'; // Cambia por una URL real
    console.log(`3️⃣ Probando con PDF de ejemplo: ${testUrl}`);
    
    const isAccessible = await checkPdfAccess(testUrl);
    console.log('Accesible:', isAccessible);
    
    if (isAccessible) {
      console.log('4️⃣ Intentando cargar documento...');
      const loadingTask = window.pdfjsLib.getDocument(testUrl);
      const pdf = await loadingTask.promise;
      console.log(`✅ Documento cargado: ${pdf.numPages} páginas`);
      
      console.log('5️⃣ Probando renderizado de primera página...');
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      console.log(`✅ Página obtenida: ${viewport.width}x${viewport.height}`);
      
      console.log('🎉 DIAGNÓSTICO EXITOSO - PDF.js funciona correctamente');
    }
    
  } catch (error) {
    console.error('❌ ERROR EN DIAGNÓSTICO:', error);
    console.log('💡 Posibles soluciones:');
    console.log('- Verificar que los PDFs estén en /public/fichas/');
    console.log('- Comprobar conectividad a CDN');
    console.log('- Revisar políticas CORS del servidor');
  }
  
  console.log('='.repeat(50));
};
