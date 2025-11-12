import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
// --- FUNCIONES Y LÓGICA ---

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-Es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Formato 24 horas
  });
};

const mapAlertsToTableData = (alerts) => {
  return alerts.map((a, index) => {
    const severity = a.status || a.severity || 'normal';
    const nivel =
      severity === 'danger' ? 'CRÍTICA' : severity === 'warning' ? 'MEDIA' : 'INFORMATIVA';

    return {
      id: a.id || index,
      
      floor: a.floor || (index % 3) + 1,
      timestamp: a.timestamp,
      nivel: nivel,
      variable: a.type || 'Temperatura', // Mock
      recomendacion:
        a.message ||
        (index % 2 === 0
          ? 'Ajustar setpoint de A/C. (Temp. alta).'
          : 'Revisar Humedad. (Humedad fuera de rango).')
    };
  });
};

// --- COMPONENTE ---

export default function AlertsPanel({ alerts }) {
  // LÓGICA: Estados para los filtros
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // 1. Mapear y filtrar los datos
  const tableData = mapAlertsToTableData(alerts);

  const filteredAlerts = tableData.filter((alert) => {
    // La conversión a parseInt es crucial porque los valores de los <option> son strings
    const floorMatch = filterFloor === 'all' || alert.floor === parseInt(filterFloor);
    const levelMatch =
      filterLevel === 'all' || alert.nivel.toUpperCase() === filterLevel.toUpperCase();
    return floorMatch && levelMatch;
  });
  console.log('Filtros actuales:', filterFloor, filterLevel);
  console.log('Alertas filtradas:', filteredAlerts.length);

  
  const handleExport = () => {
    if (filteredAlerts.length === 0) {
      console.warn('No hay alertas para exportar.');
      return;
    }

    
    const headers = ['Timestamp', 'Piso', 'Variable', 'Nivel', 'Recomendacion'];
    const csvContent = filteredAlerts
      .map(
        (alert) =>
          `${alert.timestamp},${alert.floor},"${alert.variable}","${alert.nivel}","${alert.recomendacion}"`
      )
      .join('\n');

    const finalCSV = [headers.join(','), csvContent].join('\n');

    // Crear el Blob y forzar la descarga
    const blob = new Blob([finalCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'smartfloors_alertas_filtradas.csv');
    document.body.appendChild(link);
    link.click();

    // Limpieza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper para generar el chip de color con Tailwind
  const getStatusChipClasses = (level) => {
    const baseClasses = 'px-2 py-0.5 rounded-md text-xs font-semibold uppercase';
    switch (level.toUpperCase()) {
      case 'CRÍTICA':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'MEDIA':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'INFORMATIVA':
        return `${baseClasses} bg-indigo-500/20 text-indigo-400`;
      default:
        return `${baseClasses} bg-green-500/20 text-green-400`;
    }
  };

  return (
    // Panel con Tailwind
    <div className='bg-[#1a1a1a] rounded-xl p-5 w-80 max-h-full overflow-y-auto flex flex-col flex-grow shadow-2xl space-y-4'>
      {/* TitleGroup */}
      <h2 className='bg-none text-white pt-2 pb-5 rounded-md text-xl border-b border-white/10 mb-2'>
        🚨 Alertas Recientes ({filteredAlerts.length})
      </h2>

      {/* FilterGroup */}
<div className="flex gap-2 mb-4">
  {/* Piso */}
  <div className="relative w-full">
    <select
      value={filterFloor}
      onChange={(e) => setFilterFloor(e.target.value)}
      className="appearance-none w-full px-2.5 py-2 pr-8 rounded-[6px] border border-[#4F46E5] bg-gray-800 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition duration-200 text-left"
    >
      <option value="all">Piso (Todos)</option>
      <option value="1">Piso 1</option>
      <option value="2">Piso 2</option>
      <option value="3">Piso 3</option>
    </select>
    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none"/>

  </div>

  {/* Nivel */}
  <div className="relative w-full">
    <select
      value={filterLevel}
      onChange={(e) => setFilterLevel(e.target.value)}
      className="appearance-none w-full px-2.5 py-2 pr-8 rounded-[6px] border border-[#4F46E5] bg-gray-800 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition duration-200 text-left"
    >
      <option value="all">Nivel (Todos)</option>
      <option value="CRÍTICA">Crítica</option>
      <option value="MEDIA">Media</option>
      <option value="INFORMATIVA">Informativa</option>
    </select>
    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none"/>
  </div>
</div>


      {/* AlertsTableContainer */}
      <div className='overflow-y-auto flex-grow'>
        {/* TableBody con animaciones */}
        <AnimatePresence mode='wait'>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='grid grid-cols-5 p-2 border-b border-white/10 text-white text-sm hover:bg-gray-800/50 transition duration-200'
              >
                <span className='col-span-1'>{alert.floor}</span>
                <span className='col-span-1'>
                  <span className={getStatusChipClasses(alert.nivel)}>{alert.nivel}</span>
                </span>
                <span className='col-span-3'>{alert.recomendacion}</span>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='p-4 text-white/60 text-center'
            >
              No hay alertas que coincidan con los filtros.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ExportButton */}
      <button
        onClick={handleExport}
        className='mt-4 px-2.5 py-1 text-xs font-medium rounded-md bg-green-500/15 border border-green-500 text-green-400 cursor-pointer transition duration-200 hover:bg-green-500/30'
      >
        Exportar CSV
      </button>
    </div>
  );
}
