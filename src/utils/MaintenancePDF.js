export const generateMaintenancePDF = (equipment, records = [], companyData = {}, userProfile = {}) => {
  try {
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString('es-CL');
      } catch {
        return dateString;
      }
    };

    const getDocumentStatus = (date) => {
      if (!date) return { status: 'Sin fecha', color: '#999' };
      
      const today = new Date();
      const docDate = new Date(date);
      const diffTime = docDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return { status: `Vencida (${Math.abs(diffDays)} días)`, color: '#dc3545' };
      } else if (diffDays <= 60) {
        return { status: `Por vencer (${diffDays} días)`, color: '#ffc107' };
      } else {
        return { status: `Vigente (${diffDays} días)`, color: '#28a745' };
      }
    };

    const revisionTecnica = getDocumentStatus(equipment.revision_tecnica_fecha);
    const soap = getDocumentStatus(equipment.soap_fecha);
    const permisoCirculacion = getDocumentStatus(equipment.permiso_circulacion_fecha);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header de la Empresa -->
        <div style="display: flex; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          ${companyData?.logo 
            ? `<img src="${companyData.logo}" alt="Logo empresa" style="width: 300px; height: 120px; object-fit: contain; border-radius: 8px; margin-right: 20px;" />`
            : ''
          }
          <div style="text-align: left;">
            <h1 style="color: #333; margin: 0;">${companyData.nombre || companyData.razonSocial || 'EMPRESA'}</h1>
            ${companyData.direccion ? `<p style="margin: 5px 0;">${companyData.direccion}</p>` : ''}
            ${companyData.telefono || companyData.email ? 
              `<p style="margin: 5px 0;">
                ${companyData.telefono ? `Tel: ${companyData.telefono}` : ''}
                ${companyData.telefono && companyData.email ? ' | ' : ''}
                ${companyData.email ? `Email: ${companyData.email}` : ''}
              </p>` : ''
            }
          </div>
        </div>

        <!-- Título -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0; font-size: 24px;">FICHA TÉCNICA DE EQUIPO</h2>
          <p style="color: #666; margin: 10px 0;">Documento generado el ${formatDate(new Date().toISOString())}</p>
        </div>

        <!-- Información General -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #007bff;">
            INFORMACIÓN GENERAL
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Nombre del Equipo:</strong> ${equipment.nombre_equipo || '-'}</div>
            <div><strong>Tipo de Equipo:</strong> ${equipment.tipo_equipo || '-'}</div>
            <div><strong>Marca:</strong> ${equipment.marca || '-'}</div>
            <div><strong>Modelo:</strong> ${equipment.modelo || '-'}</div>
            <div><strong>Año:</strong> ${equipment.año || '-'}</div>
            <div><strong>Patente:</strong> ${equipment.patente || '-'}</div>
            <div><strong>N° Chasis:</strong> ${equipment.numero_chasis || '-'}</div>
            <div><strong>N° Motor:</strong> ${equipment.numero_motor || '-'}</div>
            <div><strong>Estado:</strong> 
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background-color: ${
                equipment.estado_equipo === 'operativo' ? '#d4edda' : 
                equipment.estado_equipo === 'en mantenimiento' ? '#fff3cd' : '#f8d7da'
              }; color: ${
                equipment.estado_equipo === 'operativo' ? '#155724' : 
                equipment.estado_equipo === 'en mantenimiento' ? '#856404' : '#721c24'
              };">${equipment.estado_equipo || '-'}</span>
            </div>
            <div><strong>Propietario:</strong> ${equipment.propietario || '-'}</div>
            <div><strong>Conductor Habitual:</strong> ${equipment.conductor_habitual || '-'}</div>
            <div><strong>Ubicación:</strong> ${equipment.ubicacion_actual || '-'}</div>
          </div>
        </div>

        <!-- Datos Técnicos -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #28a745;">
            DATOS TÉCNICOS
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Kilometraje Actual:</strong> ${equipment.kilometraje_actual ? `${equipment.kilometraje_actual.toLocaleString()} km` : '-'}</div>
            <div><strong>Horas de Uso:</strong> ${equipment.horas_uso ? `${equipment.horas_uso} hrs` : '-'}</div>
            <div><strong>Próx. Mantención (km):</strong> ${equipment.prox_mantencion_km ? `${equipment.prox_mantencion_km.toLocaleString()} km` : '-'}</div>
            <div><strong>Próx. Mantención (hrs):</strong> ${equipment.prox_mantencion_horas ? `${equipment.prox_mantencion_horas} hrs` : '-'}</div>
          </div>
        </div>

        <!-- Documentos y Certificaciones -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #ffc107;">
            DOCUMENTOS Y CERTIFICACIONES
          </h3>
          <div style="display: grid; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <div>
                <strong>Revisión Técnica:</strong> ${formatDate(equipment.revision_tecnica_fecha)}
                ${equipment.revision_tecnica_numero ? `<br><small>N°: ${equipment.revision_tecnica_numero}</small>` : ''}
              </div>
              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${revisionTecnica.color}20; color: ${revisionTecnica.color};">
                ${revisionTecnica.status}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <div>
                <strong>SOAP:</strong> ${formatDate(equipment.soap_fecha)}
                ${equipment.soap_numero ? `<br><small>N°: ${equipment.soap_numero}</small>` : ''}
              </div>
              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${soap.color}20; color: ${soap.color};">
                ${soap.status}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <div>
                <strong>Permiso de Circulación:</strong> ${formatDate(equipment.permiso_circulacion_fecha)}
                ${equipment.permiso_circulacion_numero ? `<br><small>N°: ${equipment.permiso_circulacion_numero}</small>` : ''}
              </div>
              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${permisoCirculacion.color}20; color: ${permisoCirculacion.color};">
                ${permisoCirculacion.status}
              </span>
            </div>
          </div>
        </div>

        ${equipment.observaciones ? `
        <!-- Observaciones -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #6c757d;">
            OBSERVACIONES
          </h3>
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
            ${equipment.observaciones.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        ${records && records.length > 0 ? `
        <!-- Historial de Mantenimiento -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #dc3545;">
            HISTORIAL DE MANTENIMIENTO
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tipo</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Kilometraje</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Descripción</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Costo Total</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(record => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(record.fecha_mantencion)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${record.tipo_mantencion || '-'}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${record.kilometraje_mantencion ? `${record.kilometraje_mantencion.toLocaleString()} km` : '-'}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${record.descripcion_trabajo ? 
                    (record.descripcion_trabajo.length > 80 ? 
                      record.descripcion_trabajo.substring(0, 77) + '...' : 
                      record.descripcion_trabajo) : '-'}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">$${((record.costo_repuestos || 0) + (record.costo_mano_obra || 0)).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 50px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
          <p style="margin: 0; font-style: italic; color: #666; text-align: center; font-size: 12px;">
            "Documento de control técnico y documental de equipos."<br>
            Generado el ${formatDate(new Date().toISOString())} | 
            ${userProfile?.username ? `Responsable: ${userProfile.username}` : 'Sistema de Mantenimiento'}
          </p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ficha Técnica - ${equipment.nombre_equipo || 'Equipo'} - ${companyData.nombre || companyData.razonSocial || 'Empresa'}</title>
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
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
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

      return {
        success: true,
        message: 'PDF generado exitosamente',
        fileName: `Ficha_${equipment.nombre_equipo?.replace(/[^a-zA-Z0-9]/g, '_') || 'Equipo'}_${new Date().toISOString().split('T')[0]}.pdf`
      };
    } else {
      throw new Error('Error al abrir ventana de impresión');
    }

  } catch (error) {
    console.error('Error al generar PDF:', error);
    return {
      success: false,
      message: 'Error al generar PDF: ' + error.message
    };
  }
};

export const generateMaintenanceRecordPDF = (record, equipment, companyData = {}, userProfile = {}) => {
  try {
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString('es-CL');
      } catch {
        return dateString;
      }
    };

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header de la Empresa -->
        <div style="display: flex; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          ${companyData?.logo 
            ? `<img src="${companyData.logo}" alt="Logo empresa" style="width: 300px; height: 120px; object-fit: contain; border-radius: 8px; margin-right: 20px;" />`
            : ''
          }
          <div style="text-align: left;">
            <h1 style="color: #333; margin: 0;">${companyData.nombre || companyData.razonSocial || 'EMPRESA'}</h1>
            ${companyData.direccion ? `<p style="margin: 5px 0;">${companyData.direccion}</p>` : ''}
            ${companyData.telefono || companyData.email ? 
              `<p style="margin: 5px 0;">
                ${companyData.telefono ? `Tel: ${companyData.telefono}` : ''}
                ${companyData.telefono && companyData.email ? ' | ' : ''}
                ${companyData.email ? `Email: ${companyData.email}` : ''}
              </p>` : ''
            }
          </div>
        </div>

        <!-- Título -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0; font-size: 24px;">REGISTRO DE MANTENIMIENTO</h2>
          <p style="color: #666; margin: 10px 0;">Documento generado el ${formatDate(new Date().toISOString())}</p>
        </div>

        <!-- Información del Equipo -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #007bff;">
            INFORMACIÓN DEL EQUIPO
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Equipo:</strong> ${equipment?.nombre_equipo || record.equipment_name || '-'}</div>
            <div><strong>Patente:</strong> ${equipment?.patente || '-'}</div>
            <div><strong>Marca/Modelo:</strong> ${`${equipment?.marca || ''} ${equipment?.modelo || ''}`.trim() || '-'}</div>
            <div><strong>Tipo:</strong> ${equipment?.tipo_equipo || '-'}</div>
          </div>
        </div>

        <!-- Detalles del Mantenimiento -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #28a745;">
            DETALLES DEL MANTENIMIENTO
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Tipo de Mantenimiento:</strong> 
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background-color: #e7f3ff; color: #0066cc;">
                ${record.tipo_mantencion || '-'}
              </span>
            </div>
            <div><strong>Fecha:</strong> ${formatDate(record.fecha_mantencion)}</div>
            <div><strong>Kilometraje:</strong> ${record.kilometraje_mantencion ? `${record.kilometraje_mantencion.toLocaleString()} km` : '-'}</div>
            <div><strong>Horas de Uso:</strong> ${record.horas_mantencion ? `${record.horas_mantencion} hrs` : '-'}</div>
            <div><strong>Taller Responsable:</strong> ${record.taller_responsable || '-'}</div>
            <div><strong>Técnico Responsable:</strong> ${record.tecnico_responsable || '-'}</div>
            <div style="grid-column: 1 / -1;"><strong>Estado Post-Mantención:</strong> 
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background-color: ${
                record.estado_equipo_post === 'operativo' ? '#d4edda' : 
                record.estado_equipo_post === 'en mantenimiento' ? '#fff3cd' : '#f8d7da'
              }; color: ${
                record.estado_equipo_post === 'operativo' ? '#155724' : 
                record.estado_equipo_post === 'en mantenimiento' ? '#856404' : '#721c24'
              };">${record.estado_equipo_post || '-'}</span>
            </div>
          </div>
        </div>

        ${record.descripcion_trabajo ? `
        <!-- Descripción del Trabajo -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #ffc107;">
            DESCRIPCIÓN DEL TRABAJO REALIZADO
          </h3>
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
            ${record.descripcion_trabajo.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        ${record.repuestos_utilizados ? `
        <!-- Repuestos Utilizados -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #6c757d;">
            REPUESTOS UTILIZADOS
          </h3>
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
            ${record.repuestos_utilizados.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        ${(record.prox_mantencion_km || record.prox_mantencion_horas || record.prox_mantencion_fecha) ? `
        <!-- Próximo Mantenimiento -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #17a2b8;">
            PRÓXIMO MANTENIMIENTO PROGRAMADO
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div><strong>Kilómetros:</strong> ${record.prox_mantencion_km ? `${record.prox_mantencion_km.toLocaleString()} km` : '-'}</div>
            <div><strong>Horas:</strong> ${record.prox_mantencion_horas ? `${record.prox_mantencion_horas} hrs` : '-'}</div>
            <div><strong>Fecha Programada:</strong> ${formatDate(record.prox_mantencion_fecha)}</div>
          </div>
        </div>
        ` : ''}

        ${record.observaciones ? `
        <!-- Observaciones -->
        <div style="margin-bottom: 30px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; margin: 0 0 15px 0; color: #333; border-left: 4px solid #6c757d;">
            OBSERVACIONES
          </h3>
          <div style="padding: 15px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
            ${record.observaciones.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 50px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
          <p style="margin: 0; font-style: italic; color: #666; text-align: center; font-size: 12px;">
            "Registro de mantenimiento - Documento de control técnico."<br>
            Generado el ${formatDate(new Date().toISOString())} | 
            ${userProfile?.username ? `Responsable: ${userProfile.username}` : 'Sistema de Mantenimiento'}
          </p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const equipmentName = equipment?.nombre_equipo || record.equipment_name || 'Equipo';
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Registro Mantenimiento - ${equipmentName} - ${formatDate(record.fecha_mantencion)} - ${companyData.nombre || companyData.razonSocial || 'Empresa'}</title>
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
              .no-break {
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
        if (window.confirm('¿Deseas imprimir o descargar como PDF?')) {
          printWindow.print();
        }
      }, 500);

      return {
        success: true,
        message: 'PDF de mantenimiento generado exitosamente',
        fileName: `Mantenimiento_${equipmentName.replace(/[^a-zA-Z0-9]/g, '_')}_${formatDate(record.fecha_mantencion).replace(/\//g, '-')}.pdf`
      };
    } else {
      throw new Error('Error al abrir ventana de impresión');
    }

  } catch (error) {
    console.error('Error al generar PDF de mantenimiento:', error);
    return {
      success: false,
      message: 'Error al generar PDF: ' + error.message
    };
  }
};