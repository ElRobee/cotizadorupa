import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Lista de PDFs y sus nombres descriptivos
// Actualizada con todos los archivos disponibles en /public/fichas/
const PDF_CATALOG = [
  // BRAZOS ARTICULADOS
  {
    filename: 'BRAZO-ARTICULADO-14MTS-JLG-450-AJ.pdf',
    nombre: 'Brazo Articulado 14m JLG 450 AJ'
  },
  {
    filename: 'BRAZO-ARTICULADO-14MTS-JLG-600-AJ.pdf',
    nombre: 'Brazo Articulado 14m JLG 600 AJ'
  },
  {
    filename: 'BRAZO-ARTICULADO-16MTS-HAULOTTE-HA16.pdf',
    nombre: 'Brazo Articulado 16m Haulotte HA16'
  },

  // ELEVADORES TIJERA
  {
    filename: 'ELEVADOR-TIJERA-8MTS-GENIE-GS-1930.pdf',
    nombre: 'Elevador Tijera 8m Genie GS-1930'
  },
  {
    filename: 'ELEVADOR-TIJERA-8MTS-GENIE-GS-2032.pdf',
    nombre: 'Elevador Tijera 8m Genie GS-2032'
  },
  {
    filename: 'ELEVADOR-TIJERA-10MTS-JLG-2646-E2.pdf',
    nombre: 'Elevador Tijera 10m JLG 2646-E2'
  },
  {
    filename: 'ELEVADOR-TIJERAS-12MTS-GENIE-GS-3246.pdf',
    nombre: 'Elevador Tijera 12m Genie GS-3246'
  },

  // GRÚAS HORQUILLA (MONTACARGAS)
  {
    filename: 'GRUA-HORQUILLA-MITSUBISHI-2TON.pdf',
    nombre: 'Grúa Horquilla Mitsubishi 2 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-TOWMOTOR-3TON.pdf',
    nombre: 'Grúa Horquilla Towmotor 3 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-TOYOTA-FGZN-3TON.pdf',
    nombre: 'Grúa Horquilla Toyota FGZN 3 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-TOYOTA-3Y4TON.pdf',
    nombre: 'Grúa Horquilla Toyota 3-4 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-TOYOTA-5TON.pdf',
    nombre: 'Grúa Horquilla Toyota 5 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-YALE-5TON.pdf',
    nombre: 'Grúa Horquilla Yale 5 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-KOMATSU-13TON.pdf',
    nombre: 'Grúa Horquilla Komatsu 13 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-KOMATSU-15TON.pdf',
    nombre: 'Grúa Horquilla Komatsu 15 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-KOMATSU-EX50-14-16TON.pdf',
    nombre: 'Grúa Horquilla Komatsu EX50 14-16 Ton'
  },
  {
    filename: 'GRUA-HORQUILLA-HYSTER-H360-15TON.pdf',
    nombre: 'Grúa Horquilla Hyster H360 15 Ton'
  },

  // CAMIONES
  {
    filename: 'CAMION-HINO-300.pdf',
    nombre: 'Camión Hino 300'
  },
  {
    filename: 'CAMION-HINO-300-DOBLE.pdf',
    nombre: 'Camión Hino 300 Doble Cabina'
  },
  {
    filename: 'CAMION-FOTON-AUMARK-614.pdf',
    nombre: 'Camión Foton Aumark 614'
  },
  {
    filename: 'CAMION-FOTON-AUMARK-S614.pdf',
    nombre: 'Camión Foton Aumark S614'
  },
  {
    filename: 'CAMION-JAC-URBAN-1042.pdf',
    nombre: 'Camión JAC Urban 1042'
  },

  // VEHÍCULOS LIVIANOS
  {
    filename: 'CAMIONETA-MITSUBISHI-L200.pdf',
    nombre: 'Camioneta Mitsubishi L200'
  },
  {
    filename: 'MINIBUS-FORD-TRANSIT.pdf',
    nombre: 'Minibús Ford Transit'
  },
  {
    filename: 'MINIBUS-JAC-SUNRAY.pdf',
    nombre: 'Minibús JAC Sunray'
  },

  // EQUIPOS ESPECIALES
  {
    filename: 'CAMA-BAJA-EAGER-BEAVER-50-GSL-3_S1.pdf',
    nombre: 'Cama Baja Eager Beaver 50 GSL-3'
  },
  {
    filename: 'SURTIDOR-CEMO-DT-Móvil-Easy-980.pdf',
    nombre: 'Surtidor CEMO DT-Móvil Easy 980'
  }
];

export const initializeFichasTecnicas = async () => {
  try {
    console.log('🚀 Iniciando creación automática de fichas técnicas...');
    
    const fichasRef = collection(db, 'fichasTecnicas');
    let createdCount = 0;
    let skippedCount = 0;

    for (const pdf of PDF_CATALOG) {
      // Verificar si ya existe una ficha con esta URL
      const existingQuery = query(fichasRef, where('urlPDF', '==', `/fichas/${pdf.filename}`));
      const existingDocs = await getDocs(existingQuery);

      if (existingDocs.empty) {
        // No existe, crear nueva ficha
        await addDoc(fichasRef, {
          nombre: pdf.nombre,
          urlPDF: `/fichas/${pdf.filename}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          autoCreated: true // Marca para identificar fichas creadas automáticamente
        });
        
        console.log(`✅ Creada: ${pdf.nombre}`);
        createdCount++;
      } else {
        console.log(`⏭️ Ya existe: ${pdf.nombre}`);
        skippedCount++;
      }
    }

    console.log(`🎉 Proceso completado:`);
    console.log(`   📝 Fichas creadas: ${createdCount}`);
    console.log(`   ⏭️ Fichas existentes: ${skippedCount}`);
    console.log(`   📋 Total procesadas: ${PDF_CATALOG.length}`);

    return {
      success: true,
      created: createdCount,
      skipped: skippedCount,
      total: PDF_CATALOG.length
    };

  } catch (error) {
    console.error('❌ Error al inicializar fichas técnicas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para verificar qué PDFs están disponibles
export const checkAvailablePDFs = async () => {
  const results = [];
  
  for (const pdf of PDF_CATALOG) {
    try {
      const response = await fetch(`/fichas/${pdf.filename}`, { method: 'HEAD' });
      results.push({
        filename: pdf.filename,
        nombre: pdf.nombre,
        available: response.ok,
        status: response.status
      });
    } catch (error) {
      results.push({
        filename: pdf.filename,
        nombre: pdf.nombre,
        available: false,
        error: error.message
      });
    }
  }
  
  return results;
};