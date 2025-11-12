import { useState, useCallback } from 'react';
import { VISUALIZATION_MODES } from '../config/visualizationModes';

/**
 * Custom hook para manejar el modo de visualización
 * @returns {Object} { currentMode, setVisualizationMode }
 */
export const useVisualizationMode = () => {
  // Estado inicial del modo (leer del localStorage o usar volumetric por defecto)
  const [currentMode, setCurrentMode] = useState(() => {
    const savedMode = localStorage.getItem('smartfloors-viz-mode');
    return savedMode || VISUALIZATION_MODES.VOLUMETRIC;
  });

  /**
   * Cambiar modo de visualización
   * @param {string} newMode - Nuevo modo (heat_layer, volumetric, hybrid)
   */
  const setVisualizationMode = useCallback((newMode) => {
    // Validar que el modo sea válido
    const validModes = Object.values(VISUALIZATION_MODES);
    if (!validModes.includes(newMode)) {
      console.warn(`⚠️ Modo inválido: ${newMode}. Usando volumetric por defecto.`);
      newMode = VISUALIZATION_MODES.VOLUMETRIC;
    }

    console.log(`🎨 [useVisualizationMode] Cambiando modo: ${currentMode} → ${newMode}`);
    
    // Actualizar estado
    setCurrentMode(newMode);
    
    // Guardar en localStorage
    localStorage.setItem('smartfloors-viz-mode', newMode);
    
    // Disparar evento personalizado para que otros componentes se enteren
    window.dispatchEvent(new CustomEvent('visualizationModeChange', { 
      detail: { mode: newMode } 
    }));
  }, [currentMode]);

  return {
    currentMode,
    setVisualizationMode
  };
};
