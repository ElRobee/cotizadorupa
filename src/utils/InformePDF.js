// Función simplificada para crear iframe de PDF
const convertPdfToImage = async (pdfUrl) => {
  console.log(`� Preparando PDF: ${pdfUrl}`);
  
  try {
    // Verificar que el URL sea válido
    if (!pdfUrl || !pdfUrl.includes('.pdf')) {
      console.error('URL de PDF inválido:', pdfUrl);
      return null;
    }
    
    console.log(`✅ PDF válido, preparando iframe`);
    
    // Simplemente retornar el HTML del iframe
    return `
      <div class="pdf-container" style="margin: 20px 0; page-break-inside: avoid;">
        <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
          📋 ${pdfUrl.split('/').pop().replace('.pdf', '').replace(/-/g, ' ')}
        </h4>
        <iframe 
          src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0" 
          width="100%" 
          height="500" 
          style="border: 2px solid #e0e0e0; border-radius: 8px; background: white;"
          frameborder="0">
          <p>Su navegador no soporta iframes. <a href="${pdfUrl}" target="_blank">Abrir PDF</a></p>
        </iframe>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666; text-align: center;">
          <a href="${pdfUrl}" target="_blank" style="color: #0066cc; text-decoration: none;">🔗 Abrir en nueva ventana</a>
        </p>
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

// Función de diagnóstico simplificada
window.testPdfConversion = async () => {
  console.log('🧪 PROBANDO VISUALIZACIÓN PDF');
  console.log('='.repeat(40));
  
  try {
    const testUrl = '/fichas/GRUA-HORQUILLA-TOYOTA-3Y4TON.pdf';
    console.log(`📄 Probando: ${testUrl}`);
    
    const result = await convertPdfToImage(testUrl);
    console.log('✅ Resultado:', result ? 'HTML generado' : 'Error');
    
    if (result) {
      console.log('🎉 SISTEMA LISTO PARA MOSTRAR PDFs');
      // Mostrar una muestra del HTML en la consola
      console.log('📝 Vista previa HTML:', result.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
  
  console.log('='.repeat(40));
};

// Función para usar PDF.js si está disponible
const convertWithPdfJs = async (pdfUrl) => {
  const pdfjsLib = window.pdfjsLib;
  
  // Cargar el PDF
  console.log(`3️⃣ Cargando documento PDF...`);
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  console.log(`✅ PDF cargado: ${pdf.numPages} páginas`);
  
  const images = [];
  const maxPages = Math.min(pdf.numPages, 2);
  console.log(`4️⃣ Convirtiendo ${maxPages} página(s) a imagen...`);
  
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    console.log(`  📄 Procesando página ${pageNum}/${maxPages}...`);
    const page = await pdf.getPage(pageNum);
    const scale = 1.2;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    images.push(imageDataUrl);
    console.log(`  ✅ Página ${pageNum} convertida (${Math.round(imageDataUrl.length / 1024)}KB)`);
  }
  
  console.log(`🎉 Conversión completada: ${images.length} imágenes generadas`);
  return images;
};

// Función para cargar PDF.js (solo si no viola CSP)
const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.pdfjsLib !== 'undefined') {
      console.log('✅ PDF.js ya está disponible');
      resolve();
      return;
    }
    
    // No intentar cargar desde CDN debido a CSP
    console.log('⚠️ PDF.js no disponible y CSP impide carga desde CDN');
    console.log('💡 Usando alternativa visual en su lugar');
    reject(new Error('PDF.js no disponible - CSP restriction'));
  });
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
        const result = await convertPdfToImage(item.fichaUrl);
        console.log(`✅ Éxito para ${item.service}:`, result);
        
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
                <strong>Cantidad:</strong> ${item.quantity || 1} unidad(es) | 
                <strong>Precio Unitario:</strong> $${formatNumber(item.price)} | 
                <strong>Subtotal:</strong> $${formatNumber((item.price || 0) * (item.quantity || 1))}
              </p>
            </div>
            
            <!-- Ficha Técnica embebida -->
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
                  � Abrir PDF Original
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
              iframe { 
                display: none !important; 
              }
              .pdf-fallback {
                display: block !important;
                position: static !important;
                transform: none !important;
                background: white !important;
                padding: 20px !important;
                border: 2px solid #0056b3 !important;
              }
            }
            .screen-only { display: block; }
            .print-only { display: none; }
            .pdf-fallback { display: none; }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #333;
            }
            iframe {
              border: none;
              width: 100%;
              height: 100%;
            }
          </style>
          <script>
            // Script para detectar si los iframes no cargan y mostrar fallback
            document.addEventListener('DOMContentLoaded', function() {
              const iframes = document.querySelectorAll('iframe[title*="Ficha Técnica"]');
              
              iframes.forEach(function(iframe, index) {
                let loaded = false;
                
                iframe.onload = function() {
                  loaded = true;
                };
                
                iframe.onerror = function() {
                  showFallback(iframe);
                };
                
                // Timeout para detectar si no carga
                setTimeout(function() {
                  if (!loaded) {
                    console.warn('PDF iframe no cargó, mostrando fallback:', iframe.src);
                    showFallback(iframe);
                  }
                }, 3000);
              });
              
              function showFallback(iframe) {
                const container = iframe.closest('div[style*="position: relative"]');
                if (container) {
                  const fallback = container.querySelector('.pdf-fallback');
                  if (fallback) {
                    fallback.style.display = 'block';
                    iframe.style.display = 'none';
                  }
                }
              }
            });
          </script>
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

// Función de diagnóstico para probar el sistema (para debugging)
window.testPdfConversion = async () => {
  console.log('🔬 DIAGNÓSTICO DE CONVERSIÓN PDF');
  console.log('='.repeat(50));
  
  try {
    console.log('1️⃣ Verificando Content Security Policy...');
    console.log('CSP permite scripts externos:', !document.querySelector('meta[http-equiv="Content-Security-Policy"]'));
    
    console.log('2️⃣ Verificando disponibilidad de PDF.js...');
    console.log('PDF.js disponible:', typeof window.pdfjsLib !== 'undefined');
    
    // Probar con un PDF de ejemplo
    const testUrl = '/fichas/GRUA-HORQUILLA-TOYOTA-3Y4TON.pdf';
    console.log(`3️⃣ Probando conversión con: ${testUrl}`);
    
    const isAccessible = await checkPdfAccess(testUrl);
    console.log('PDF accesible:', isAccessible);
    
    if (isAccessible) {
      console.log('4️⃣ Probando conversión...');
      const result = await convertPdfToImage(testUrl);
      console.log(`✅ Conversión exitosa: ${result?.length || 0} imagen(es) generada(s)`);
      
      if (result && result.length > 0) {
        console.log('5️⃣ Verificando tamaño de imagen...');
        console.log(`Tamaño primera imagen: ${Math.round(result[0].length / 1024)}KB`);
      }
    }
    
    console.log('🎉 DIAGNÓSTICO COMPLETADO');
    
  } catch (error) {
    console.error('❌ ERROR EN DIAGNÓSTICO:', error);
    console.log('💡 El sistema usará representaciones visuales en lugar de renderizado real');
  }
  
  console.log('='.repeat(50));
};
