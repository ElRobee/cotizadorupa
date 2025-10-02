import React from "react";
import { X } from "lucide-react";
import { getThemeClasses } from '../lib/utils';

const Filters = ({ filters, setFilters, showFilters, setShowFilters, clearFilters, theme, darkMode }) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  if (!showFilters) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-2xl p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
          <button
            onClick={() => setShowFilters(false)}
            className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CAMPOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Desde</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Hasta</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Facturada">Facturada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium mb-1">Prioridad</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
            >
              <option value="">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={clearFilters}
            className={`px-4 py-2 border rounded-lg ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            Limpiar Todo
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className={`px-4 py-2 rounded-lg text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
