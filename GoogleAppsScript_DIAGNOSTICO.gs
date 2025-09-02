/**
 * Google Apps Script para DIAGNÓSTICO - ANEXO 7 - CTP Sabalito 2025
 * Versión que devuelve TODOS los datos sin filtrar para diagnosticar
 */

// ID de la hoja de cálculo
const SHEET_ID = '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus';
const SHEET_NAME = 'Docentes';

/**
 * Función principal para recibir datos GET
 */
function doGet(e) {
  try {
    console.log('doGet llamado con:', e.parameter);
    
    const action = e.parameter.action;
    
    if (action === 'getAllStudents') {
      return obtenerTodosEstudiantes();
    } else if (action === 'getAllTeachers') {
      return obtenerTodosDocentes();
    } else if (action === 'getStudent') {
      return obtenerEstudiantePorCedula(e.parameter.cedula);
    } else {
      return obtenerTodos();
    }
    
  } catch (error) {
    console.log('Error en doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtener TODOS los estudiantes (SIN FILTRAR)
 */
function obtenerTodosEstudiantes() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: [], message: 'Hoja no encontrada'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: [], message: 'No hay datos en la hoja'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('Headers:', headers);
    console.log('Total rows:', rows.length);
    console.log('Primera fila:', rows[0]);
    
    // Devolver TODOS los datos sin filtrar
    const todosLosDatos = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        data: todosLosDatos,
        message: `Total de registros: ${todosLosDatos.length}`,
        headers: headers
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtener solo docentes
 */
function obtenerTodosDocentes() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const docentes = rows
      .filter(row => row[24] === 'docente') // Columna Tipo (índice 24)
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: docentes}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtener estudiante por cédula
 */
function obtenerEstudiantePorCedula(cedula) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Hoja no encontrada'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'No hay datos'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Buscar por cédula
    const estudiante = rows.find(row => row[0] === cedula); // Columna Cédula (índice 0)
    
    if (!estudiante) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Estudiante no encontrado'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = estudiante[index] || '';
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: obj}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtener todos los datos
 */
function obtenerTodos() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: result}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
