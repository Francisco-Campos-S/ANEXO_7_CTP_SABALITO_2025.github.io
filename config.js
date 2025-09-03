/**
 * Configuración para ANEXO 7 - CTP Sabalito 2025
 * Configuración de Google Apps Script y URLs
 */

// CONFIGURACIÓN IMPORTANTE: 
// URL del Google Apps Script desplegado para CTP Sabalito
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIO8wBrnA1R9xB17GknXdGi3NqA3hD9Bdim2r8-tDfYnSc6oUwX7sOzPbCtxPOy5MHmw/exec';

// Configuración de la aplicación
const CONFIG = {
    // URL del Google Apps Script (debe ser configurada)
    scriptUrl: GOOGLE_APPS_SCRIPT_URL,
    
    // Configuración de la institución
    institution: {
        name: 'Colegio Técnico Profesional Sabalito',
        year: '2025',
        document: 'ANEXO 7'
    },
    
    // Configuración de validación
    validation: {
        cedulaLength: 9,
        emailRequired: true,
        requiredFields: ['cedula', 'nombre', 'email', 'especialidad', 'nivel', 'estado']
    },
    
    // Configuración de la interfaz
    ui: {
        showAllTeachers: true,
        enableExport: true,
        enablePrint: true,
        autoRefresh: true
    }
};

// Función para obtener la URL del script
function getScriptUrl() {
    return CONFIG.scriptUrl;
}

// Función para verificar si la configuración está completa
function isConfigComplete() {
    return CONFIG.scriptUrl && !CONFIG.scriptUrl.includes('TU_SCRIPT_ID_AQUI');
}

// Función para mostrar mensaje de configuración
function showConfigMessage() {
    if (!isConfigComplete()) {
        console.warn('⚠️ CONFIGURACIÓN REQUERIDA: Debe configurar la URL del Google Apps Script en config.js');
        return true;
    }
    return false;
}
