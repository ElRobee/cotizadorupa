const ServicesData = {
  services: [
    {
      id: 1,
      name: 'PLATAFORMAS ELEVADORAS TIJERA',
      price: 100000,
      category: 'Elevadores',
      active: true,
      specs: {
        type: 'scissor lift / plataforma tijera',
        maxPlatformHeight_m: 12,        // altura de plataforma
        workingHeight_m: 14,            // altura de trabajo aproximada
        capacity_kg: 500,                // capacidad de carga
        power: 'eléctrica / hidráulica',
        weight_kg: 2000,                 // peso del equipo
        dimensions_m: {
          length: 2.5,
          width: 1.2,
          stowedHeight: 2.0
        },
        driveType: 'todoterreno / ruedas sólidas',
      }
    },
    {
      id: 2,
      name: 'BRAZO ARTICULADO 16 MT',
      price: 100000,
      category: 'Elevadores',
      active: true,
      specs: {
        type: 'elevador tipo brazo articulado (knuckle boom)',
        maxOutreach_m: 12,               // alcance horizontal máximo
        maxHeight_m: 16,                 // altura máxima
        capacity_kg: 230,                 // capacidad típica
        power: 'diésel / hidráulica',
        weight_kg: 8000,                  // peso estimado
        platformSize_m: {
          length: 1.8,
          width: 0.8
        },
        rotationDegrees: 360,             // rotación de torre
      }
    },
    {
      id: 3,
      name: 'ELEVADOR ELECTRICO 8 MT',
      price: 50000,
      category: 'Elevadores',
      active: true,
      specs: {
        type: 'mast lift / elevador eléctrico vertical',
        maxHeight_m: 8,
        capacity_kg: 200,
        power: 'eléctrica (baterías)',
        weight_kg: 900,
        dimensions_m: { length: 1.2, width: 0.9, stowedHeight: 2.0 },
        driveType: 'ruedas eléctricas',
      }
    },
    {
      id: 4,
      name: 'ELEVADOR ELECTRICO 10 MT',
      price: 70000,
      category: 'Elevadores',
      active: true,
      specs: {
        type: 'mast / scissor eléctrico para interiores / exteriores',
        maxHeight_m: 10,
        capacity_kg: 250,
        power: 'eléctrica',
        weight_kg: 1200,
        dimensions_m: { length: 1.4, width: 1.0, stowedHeight: 2.2 },
        driveType: 'ruedas eléctricas',
      }
    },
    {
      id: 5,
      name: 'CAMIONES TRANSPORTE',
      price: 600000,
      category: 'Transporte',
      active: true,
      specs: {
        type: 'camión de transporte carga / plataforma',
        maxLoad_kg: 10000,              // carga máxima del camión
        volume_m3: 35,                   // volumen de caja
        engine: 'diésel 6 cilindros',
        power_hp: 240,                   // potencia estimada
        dimensions_m: {
          length: 8.0,
          width: 2.5,
          height: 3.0
        },
        axleConfiguration: '4x2 / 6x4'
      }
    },
    {
      id: 6,
      name: 'OPERADOR',
      price: 45000,
      category: 'Personal',
      active: true,
      specs: {
        role: 'operador de maquinaria',
        qualification: 'certificación IPAF / licencia de manejo',
        hoursRate_clp: 45000,
        maxHoursPerDay: 8
      }
    },
    {
      id: 7,
      name: 'DIESEL',
      price: 2000,
      category: 'Otros',
      active: true,
      specs: {
        type: 'combustible diésel',
        unit: 'litro',
        energyDensity_MJ_per_l: 36,     // densidad energética aproximada
        costPerL: 2000
      }
    }
  ]
};

export default ServicesData;
