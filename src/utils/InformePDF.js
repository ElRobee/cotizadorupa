import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Esta función se encargará de generar el informe técnico en PDF
export const generateTechnicalReportPDF = (quotation, allServices) => {
  const doc = new jsPDF();
  
  const servicesInQuotation = quotation.items.map(item => {
    // Busca la información técnica completa del servicio
    const serviceDetails = allServices.find(s => s.id === item.serviceId);
    return serviceDetails;
  }).filter(Boolean); // Filtra los servicios no encontrados
  
  if (servicesInQuotation.length === 0) {
    alert('Esta cotización no contiene servicios para generar un informe técnico.');
    return;
  }

  // Encabezado del documento
  doc.setFontSize(18);
  doc.text(`Informe Técnico - Cotización #${quotation.number}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Cliente: ${quotation.client}`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 37);

  let yOffset = 50;

  servicesInQuotation.forEach((service, index) => {
    if (yOffset > 250) { // Si se acerca al final de la página, agrega una nueva página
      doc.addPage();
      yOffset = 20;
    }

    doc.setFontSize(16);
    doc.text(`${index + 1}. ${service.name}`, 14, yOffset);
    yOffset += 10;
    
    doc.setFontSize(10);
    doc.text(`Marca: ${service.technicalInfo.brand}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Altura Máxima: ${service.technicalInfo.maxHeight}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Alcance Vertical: ${service.technicalInfo.verticalReach}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Capacidad de Carga: ${service.technicalInfo.loadCapacity}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Tipo de Motor: ${service.technicalInfo.engineType}`, 20, yOffset);
    yOffset += 7;
    doc.text(`Dimensiones: ${service.technicalInfo.dimensions}`, 20, yOffset);
    yOffset += 7;
    
    doc.setFontSize(12);
    doc.text('Funcionalidad:', 20, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    // Para descripciones largas, se puede usar `doc.splitTextToSize`
    const descriptionLines = doc.splitTextToSize(service.technicalInfo.functionality, 170);
    doc.text(descriptionLines, 25, yOffset);
    yOffset += (descriptionLines.length * 7) + 10;
  });

  doc.save(`Informe_Tecnico_Cotizacion_${quotation.number}.pdf`);
};
