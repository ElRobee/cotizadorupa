import React, { useState } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const ClientImportModal = ({ isOpen, onClose, onImportClients, darkMode }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Plantilla de datos para el Excel
  const generateTemplate = () => {
    const templateData = [
      {
        'empresa': 'Ejemplo Empresa S.A.',
        'encargado': 'Juan Pérez',
        'rut': '12.345.678-9',
        'email': 'contacto@ejemplo.com',
        'telefono': '+56 9 1234 5678',
        'ciudad': 'Santiago',
        'direccion': 'Av. Ejemplo 123'
      },
      {
        'empresa': 'Otra Empresa Ltda.',
        'encargado': 'María González',
        'rut': '98.765.432-1',
        'email': 'info@otra.com',
        'telefono': '+56 9 8765 4321',
        'ciudad': 'Valparaíso',
        'direccion': 'Calle Muestra 456'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 25 }, // empresa
      { wch: 20 }, // encargado
      { wch: 15 }, // rut
      { wch: 25 }, // email
      { wch: 18 }, // telefono
      { wch: 15 }, // ciudad
      { wch: 30 }  // direccion
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'plantilla_clientes.xlsx');
  };

  // Manejar drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Validar formato de RUT chileno
  const validateRUT = (rut) => {
    if (!rut) return false;
    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return rutRegex.test(rut.replace(/\./g, ''));
  };

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Procesar archivo Excel
  const processFile = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validClients = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque Excel empieza en 1 y tiene encabezados
        const client = {
          empresa: row.empresa?.toString().trim() || '',
          encargado: row.encargado?.toString().trim() || '',
          rut: row.rut?.toString().trim() || '',
          email: row.email?.toString().trim() || '',
          telefono: row.telefono?.toString().trim() || '',
          ciudad: row.ciudad?.toString().trim() || '',
          direccion: row.direccion?.toString().trim() || ''
        };

        // Validaciones
        if (!client.empresa) {
          errors.push(`Fila ${rowNumber}: Falta el nombre de la empresa`);
          return;
        }

        if (!client.encargado) {
          errors.push(`Fila ${rowNumber}: Falta el nombre del encargado`);
          return;
        }

        if (!client.rut) {
          errors.push(`Fila ${rowNumber}: Falta el RUT`);
          return;
        }

        if (!validateRUT(client.rut)) {
          errors.push(`Fila ${rowNumber}: RUT "${client.rut}" no es válido`);
          return;
        }

        if (client.email && !validateEmail(client.email)) {
          errors.push(`Fila ${rowNumber}: Email "${client.email}" no es válido`);
          return;
        }

        if (!client.telefono) {
          errors.push(`Fila ${rowNumber}: Falta el teléfono`);
          return;
        }

        validClients.push(client);
      });

      if (errors.length > 0) {
        setImportResult({
          success: false,
          errors,
          validCount: validClients.length,
          totalCount: jsonData.length
        });
      } else {
        // Importar clientes válidos
        await onImportClients(validClients);
        setImportResult({
          success: true,
          imported: validClients.length,
          totalCount: jsonData.length
        });
        setFile(null);
      }
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setImportResult({
        success: false,
        errors: ['Error al procesar el archivo. Verifica que sea un archivo Excel válido.'],
        validCount: 0,
        totalCount: 0
      });
    }

    setImporting(false);
  };

  const resetModal = () => {
    setFile(null);
    setImportResult(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} 
        rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Clientes desde Excel
          </h3>
          <button
            onClick={handleClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              darkMode ? 'hover:bg-gray-700' : ''
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Instrucciones */}
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'
          } border`}>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Instrucciones
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Descarga la plantilla de Excel para ver el formato requerido</li>
              <li>Completa los datos de los clientes en las columnas correspondientes</li>
              <li>Los campos obligatorios son: empresa, encargado, RUT y teléfono</li>
              <li>El RUT debe tener formato chileno (ej: 12.345.678-9)</li>
              <li>El email debe ser válido si se proporciona</li>
            </ul>
          </div>

          {/* Botón para descargar plantilla */}
          <div className="flex justify-center">
            <button
              onClick={generateTemplate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed
                ${darkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
              <Download className="w-4 h-4" />
              Descargar Plantilla Excel
            </button>
          </div>

          {/* Zona de archivo */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? (darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                : (darkMode ? 'border-gray-600' : 'border-gray-300')
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Quitar archivo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium">
                    Arrastra tu archivo Excel aquí
                  </p>
                  <p className="text-sm text-gray-500">
                    o haz clic para seleccionar
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className={`inline-block px-4 py-2 rounded-lg cursor-pointer
                    ${darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  Seleccionar Archivo
                </label>
              </div>
            )}
          </div>

          {/* Resultado de importación */}
          {importResult && (
            <div className={`p-4 rounded-lg border
              ${importResult.success
                ? (darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
                : (darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')
              }`}
            >
              <div className="flex items-start gap-2">
                {importResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  {importResult.success ? (
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300">
                        ¡Importación exitosa!
                      </h4>
                      <p className="text-sm">
                        Se importaron {importResult.imported} clientes correctamente.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-300">
                        Errores encontrados
                      </h4>
                      <p className="text-sm mb-2">
                        {importResult.validCount} de {importResult.totalCount} registros son válidos.
                      </p>
                      <div className="max-h-32 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <p key={index} className="text-sm text-red-600 dark:text-red-400">
                            • {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg border
                ${darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              Cancelar
            </button>
            <button
              onClick={processFile}
              disabled={!file || importing}
              className={`px-4 py-2 rounded-lg text-white
                ${!file || importing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {importing ? 'Importando...' : 'Importar Clientes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientImportModal;