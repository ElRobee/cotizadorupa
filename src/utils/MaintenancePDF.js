import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMaintenancePDF = (equipment, records = [], companyData = {}, userProfile = {}) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    
    // COLORES DEFINIDOS
    const primaryColor = [41, 98, 255]; // Azul
    const secondaryColor = [128, 128, 128]; // Gris
    const lightGray = [245, 245, 245]; // Gris claro
    
    // HEADER DE LA EMPRESA
    if (companyData.logo) {
      try {
        doc.addImage(companyData.logo, 'JPEG', 15, 10, 30, 20);
      } catch (error) {
        console.warn('Error al agregar logo:', error);
      }
    }
    
    // INFORMACIÓN DE LA EMPRESA
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(companyData.nombre || 'EMPRESA', companyData.logo ? 50 : 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    if (companyData.direccion) {
      doc.text(`Dirección: ${companyData.direccion}`, companyData.logo ? 50 : 15, 28);
    }
    if (companyData.telefono || companyData.email) {
      const contacto = [companyData.telefono, companyData.email].filter(Boolean).join(' • ');
      doc.text(`Contacto: ${contacto}`, companyData.logo ? 50 : 15, 34);
    }
    
    yPosition = 50;
    
    // TÍTULO DEL DOCUMENTO
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA TÉCNICA DE EQUIPO', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // INFORMACIÓN DEL EQUIPO
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN GENERAL', 20, yPosition + 5);
    
    yPosition += 15;
    
    // Datos del equipo en dos columnas
    const equipmentInfo = [
      ['Nombre del Equipo:', equipment.nombre_equipo || '-'],
      ['Tipo de Equipo:', equipment.tipo_equipo || '-'],
      ['Marca:', equipment.marca || '-'],
      ['Modelo:', equipment.modelo || '-'],
      ['Año:', equipment.año ? equipment.año.toString() : '-'],
      ['Patente:', equipment.patente || '-'],
      ['N° Chasis:', equipment.numero_chasis || '-'],
      ['N° Motor:', equipment.numero_motor || '-'],
      ['Estado:', equipment.estado_equipo || '-'],
      ['Propietario:', equipment.propietario || '-'],
      ['Conductor Habitual:', equipment.conductor_habitual || '-'],
      ['Ubicación:', equipment.ubicacion_actual || '-']
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    equipmentInfo.forEach((info, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const xPos = column === 0 ? 20 : (pageWidth / 2 + 10);
      const yPos = yPosition + (row * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(info[0], xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(info[1], xPos + 35, yPos);
    });
    
    yPosition += Math.ceil(equipmentInfo.length / 2) * 8 + 10;
    
    // DATOS TÉCNICOS
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS TÉCNICOS', 20, yPosition + 5);
    
    yPosition += 15;
    
    const technicalData = [
      ['Kilometraje Actual:', equipment.kilometraje_actual ? `${equipment.kilometraje_actual.toLocaleString()} km` : '-'],
      ['Horas de Uso:', equipment.horas_uso ? `${equipment.horas_uso} hrs` : '-'],
      ['Próx. Mantención (km):', equipment.prox_mantencion_km ? `${equipment.prox_mantencion_km.toLocaleString()} km` : '-'],
      ['Próx. Mantención (hrs):', equipment.prox_mantencion_horas ? `${equipment.prox_mantencion_horas} hrs` : '-']
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    technicalData.forEach((data, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const xPos = column === 0 ? 20 : (pageWidth / 2 + 10);
      const yPos = yPosition + (row * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(data[0], xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(data[1], xPos + 40, yPos);
    });
    
    yPosition += Math.ceil(technicalData.length / 2) * 8 + 10;
    
    // DOCUMENTOS Y CERTIFICACIONES
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DOCUMENTOS Y CERTIFICACIONES', 20, yPosition + 5);
    
    yPosition += 15;
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString('es-CL');
      } catch {
        return dateString;
      }
    };
    
    const documentsData = [
      ['Revisión Técnica:', formatDate(equipment.revision_tecnica_fecha), equipment.revision_tecnica_numero || ''],
      ['SOAP:', formatDate(equipment.soap_fecha), equipment.soap_numero || ''],
      ['Seguro:', formatDate(equipment.seguro_fecha), equipment.seguro_numero || '']
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    documentsData.forEach((doc_info, index) => {
      const yPos = yPosition + (index * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(doc_info[0], 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(doc_info[1], 70, yPos);
      if (doc_info[2]) {
        doc.text(`N°: ${doc_info[2]}`, 120, yPos);
      }
    });
    
    yPosition += documentsData.length * 8 + 10;
    
    // OBSERVACIONES
    if (equipment.observaciones) {
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES', 20, yPosition + 5);
      
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const splitObservations = doc.splitTextToSize(equipment.observaciones, pageWidth - 40);
      doc.text(splitObservations, 20, yPosition);
      
      yPosition += splitObservations.length * 5 + 10;
    }
    
    // HISTORIAL DE MANTENIMIENTO
    if (records && records.length > 0) {
      // Verificar si necesitamos nueva página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('HISTORIAL DE MANTENIMIENTO', 20, yPosition + 5);
      
      yPosition += 15;
      
      // Tabla de historial
      const historialData = records.map(record => [
        formatDate(record.fecha_mantencion),
        record.tipo_mantencion || '-',
        record.kilometraje_mantencion ? `${record.kilometraje_mantencion.toLocaleString()} km` : '-',
        record.descripcion_trabajo ? (record.descripcion_trabajo.length > 50 ? 
          record.descripcion_trabajo.substring(0, 47) + '...' : 
          record.descripcion_trabajo) : '-',
        record.taller_responsable || '-',
        record.costo_total ? `$${(record.costo_repuestos || 0) + (record.costo_mano_obra || 0)}` : '-'
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['Fecha', 'Tipo', 'Kilometraje', 'Descripción', 'Taller', 'Costo']],
        body: historialData,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 28 },
          2: { cellWidth: 25 },
          3: { cellWidth: 50 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 }
        },
        margin: { left: 15, right: 15 }
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Línea divisoria
      doc.setDrawColor(...secondaryColor);
      doc.line(15, doc.internal.pageSize.height - 25, pageWidth - 15, doc.internal.pageSize.height - 25);
      
      // Información del footer
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
      
      const footerY = doc.internal.pageSize.height - 15;
      doc.text(`Documento generado el ${new Date().toLocaleDateString('es-CL')}`, 15, footerY);
      
      if (userProfile?.username) {
        doc.text(`Generado por: ${userProfile.username}`, 15, footerY + 5);
      }
      
      // Número de página
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 15, footerY, { align: 'right' });
    }
    
    // Generar nombre del archivo
    const fileName = `Ficha_${equipment.nombre_equipo?.replace(/[^a-zA-Z0-9]/g, '_') || 'Equipo'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
    
    return {
      success: true,
      message: 'PDF generado exitosamente',
      fileName
    };
    
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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    
    // COLORES DEFINIDOS
    const primaryColor = [41, 98, 255]; // Azul
    const secondaryColor = [128, 128, 128]; // Gris
    const lightGray = [245, 245, 245]; // Gris claro
    
    // HEADER DE LA EMPRESA
    if (companyData.logo) {
      try {
        doc.addImage(companyData.logo, 'JPEG', 15, 10, 30, 20);
      } catch (error) {
        console.warn('Error al agregar logo:', error);
      }
    }
    
    // INFORMACIÓN DE LA EMPRESA
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(companyData.nombre || 'EMPRESA', companyData.logo ? 50 : 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    if (companyData.direccion) {
      doc.text(`Dirección: ${companyData.direccion}`, companyData.logo ? 50 : 15, 28);
    }
    if (companyData.telefono || companyData.email) {
      const contacto = [companyData.telefono, companyData.email].filter(Boolean).join(' • ');
      doc.text(`Contacto: ${contacto}`, companyData.logo ? 50 : 15, 34);
    }
    
    yPosition = 50;
    
    // TÍTULO DEL DOCUMENTO
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRO DE MANTENIMIENTO', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // INFORMACIÓN DEL EQUIPO
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL EQUIPO', 20, yPosition + 5);
    
    yPosition += 15;
    
    const equipmentData = [
      ['Equipo:', equipment?.nombre_equipo || record.equipment_name || '-'],
      ['Patente:', equipment?.patente || '-'],
      ['Marca/Modelo:', `${equipment?.marca || ''} ${equipment?.modelo || ''}`.trim() || '-'],
      ['Tipo:', equipment?.tipo_equipo || '-']
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    equipmentData.forEach((info, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const xPos = column === 0 ? 20 : (pageWidth / 2 + 10);
      const yPos = yPosition + (row * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(info[0], xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(info[1], xPos + 30, yPos);
    });
    
    yPosition += Math.ceil(equipmentData.length / 2) * 8 + 15;
    
    // DETALLES DEL MANTENIMIENTO
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLES DEL MANTENIMIENTO', 20, yPosition + 5);
    
    yPosition += 15;
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleDateString('es-CL');
      } catch {
        return dateString;
      }
    };
    
    const maintenanceData = [
      ['Tipo de Mantenimiento:', record.tipo_mantencion || '-'],
      ['Fecha:', formatDate(record.fecha_mantencion)],
      ['Kilometraje:', record.kilometraje_mantencion ? `${record.kilometraje_mantencion.toLocaleString()} km` : '-'],
      ['Horas de Uso:', record.horas_mantencion ? `${record.horas_mantencion} hrs` : '-'],
      ['Taller Responsable:', record.taller_responsable || '-'],
      ['Técnico Responsable:', record.tecnico_responsable || '-'],
      ['Estado Post-Mantención:', record.estado_equipo_post || '-']
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    maintenanceData.forEach((data, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const xPos = column === 0 ? 20 : (pageWidth / 2 + 10);
      const yPos = yPosition + (row * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(data[0], xPos, yPos);
      doc.setFont('helvetica', 'normal');
      
      // Texto más largo para algunos campos
      const maxWidth = (pageWidth / 2) - 40;
      const splitText = doc.splitTextToSize(data[1], maxWidth);
      doc.text(splitText, xPos + 45, yPos);
    });
    
    yPosition += Math.ceil(maintenanceData.length / 2) * 8 + 15;
    
    // DESCRIPCIÓN DEL TRABAJO
    if (record.descripcion_trabajo) {
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPCIÓN DEL TRABAJO REALIZADO', 20, yPosition + 5);
      
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const splitDescription = doc.splitTextToSize(record.descripcion_trabajo, pageWidth - 40);
      doc.text(splitDescription, 20, yPosition);
      
      yPosition += splitDescription.length * 5 + 15;
    }
    
    // REPUESTOS UTILIZADOS
    if (record.repuestos_utilizados) {
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('REPUESTOS UTILIZADOS', 20, yPosition + 5);
      
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const splitRepuestos = doc.splitTextToSize(record.repuestos_utilizados, pageWidth - 40);
      doc.text(splitRepuestos, 20, yPosition);
      
      yPosition += splitRepuestos.length * 5 + 15;
    }
    
    // COSTOS
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('COSTOS', 20, yPosition + 5);
    
    yPosition += 15;
    
    const costData = [
      ['Costo Repuestos:', record.costo_repuestos ? `$${record.costo_repuestos.toLocaleString()}` : '$0'],
      ['Costo Mano de Obra:', record.costo_mano_obra ? `$${record.costo_mano_obra.toLocaleString()}` : '$0'],
      ['Total:', `$${((record.costo_repuestos || 0) + (record.costo_mano_obra || 0)).toLocaleString()}`]
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    costData.forEach((data, index) => {
      const yPos = yPosition + (index * 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(data[0], 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(data[1], 80, yPos);
    });
    
    yPosition += costData.length * 8 + 15;
    
    // PRÓXIMO MANTENIMIENTO
    if (record.prox_mantencion_km || record.prox_mantencion_horas || record.prox_mantencion_fecha) {
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('PRÓXIMO MANTENIMIENTO PROGRAMADO', 20, yPosition + 5);
      
      yPosition += 15;
      
      const nextMaintenanceData = [
        ['Próx. Mantención (km):', record.prox_mantencion_km ? `${record.prox_mantencion_km.toLocaleString()} km` : '-'],
        ['Próx. Mantención (hrs):', record.prox_mantencion_horas ? `${record.prox_mantencion_horas} hrs` : '-'],
        ['Fecha Programada:', formatDate(record.prox_mantencion_fecha)]
      ];
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      nextMaintenanceData.forEach((data, index) => {
        const yPos = yPosition + (index * 8);
        
        doc.setFont('helvetica', 'bold');
        doc.text(data[0], 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(data[1], 80, yPos);
      });
      
      yPosition += nextMaintenanceData.length * 8 + 15;
    }
    
    // OBSERVACIONES
    if (record.observaciones) {
      doc.setFillColor(...lightGray);
      doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES', 20, yPosition + 5);
      
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const splitObservations = doc.splitTextToSize(record.observaciones, pageWidth - 40);
      doc.text(splitObservations, 20, yPosition);
      
      yPosition += splitObservations.length * 5 + 10;
    }
    
    // FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Línea divisoria
      doc.setDrawColor(...secondaryColor);
      doc.line(15, doc.internal.pageSize.height - 25, pageWidth - 15, doc.internal.pageSize.height - 25);
      
      // Información del footer
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
      
      const footerY = doc.internal.pageSize.height - 15;
      doc.text(`Documento generado el ${new Date().toLocaleDateString('es-CL')}`, 15, footerY);
      
      if (userProfile?.username) {
        doc.text(`Generado por: ${userProfile.username}`, 15, footerY + 5);
      }
      
      // Número de página
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 15, footerY, { align: 'right' });
    }
    
    // Generar nombre del archivo
    const equipmentName = equipment?.nombre_equipo || record.equipment_name || 'Equipo';
    const fileName = `Mantenimiento_${equipmentName.replace(/[^a-zA-Z0-9]/g, '_')}_${formatDate(record.fecha_mantencion).replace(/\//g, '-')}.pdf`;
    
    doc.save(fileName);
    
    return {
      success: true,
      message: 'PDF de mantenimiento generado exitosamente',
      fileName
    };
    
  } catch (error) {
    console.error('Error al generar PDF de mantenimiento:', error);
    return {
      success: false,
      message: 'Error al generar PDF: ' + error.message
    };
  }
};