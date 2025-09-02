/**
 * Google Apps Script SIMPLIFICADO para ANEXO 7 - CTP Sabalito 2025
 * Versión simple que definitivamente funciona
 */

// ID de la hoja de cálculo
const SHEET_ID = '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus';
const SHEET_NAME = 'Docentes';

/**
 * Función principal para recibir datos POST
 */
function doPost(e) {
  try {
    console.log('doPost llamado');
    console.log('e.parameter:', e.parameter);
    
    // Obtener datos
    let data = e.parameter;
    
    if (!data) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'No se recibieron datos'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('Datos recibidos:', data);
    
    // Determinar si es estudiante
    if (data.tipo === 'estudiante') {
      return guardarEstudianteSimple(data);
    } else {
      return guardarDocenteSimple(data);
    }
    
  } catch (error) {
    console.log('Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar estudiante (VERSIÓN SIMPLE)
 */
function guardarEstudianteSimple(data) {
  try {
    console.log('guardarEstudianteSimple llamado con:', data);
    
    // Abrir la hoja
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Crear encabezados simples
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Cédula', 'Nombre', 'Grado', 'Sección', 
        'Funcionamiento Académico', 'Desarrollo Vocacional', 
        'Docente', 'Fecha Registro', 'Tipo', 'Timestamp'
      ]]);
    }
    
    // Preparar datos para insertar
    const timestamp = new Date().toLocaleString('es-CR');
    
    // Parsear JSON strings si vienen como strings
    let funcionamientoAcademico = data.funcionamientoAcademico || '';
    let desarrolloVocacional = data.desarrolloVocacional || '';
    let docente = data.docente || '';
    
    // Si vienen como strings JSON, parsearlos
    if (typeof funcionamientoAcademico === 'string' && funcionamientoAcademico.startsWith('{')) {
      try {
        const parsed = JSON.parse(funcionamientoAcademico);
        funcionamientoAcademico = Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
      } catch (e) {
        // Si no se puede parsear, usar el string original
      }
    }
    
    if (typeof desarrolloVocacional === 'string' && desarrolloVocacional.startsWith('{')) {
      try {
        const parsed = JSON.parse(desarrolloVocacional);
        desarrolloVocacional = Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
      } catch (e) {
        // Si no se puede parsear, usar el string original
      }
    }
    
    if (typeof docente === 'string' && docente.startsWith('{')) {
      try {
        const parsed = JSON.parse(docente);
        docente = Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
      } catch (e) {
        // Si no se puede parsear, usar el string original
      }
    }
    
    const row = [
      data.cedula || '',
      data.nombre || '',
      data.grado || '',
      data.seccion || '',
      funcionamientoAcademico,
      desarrolloVocacional,
      docente,
      data.fechaRegistro || timestamp,
      'estudiante',
      new Date().getTime()
    ];
    
    console.log('Insertando fila:', row);
    
    // Insertar fila
    sheet.appendRow(row);
    
    console.log('Fila insertada exitosamente');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: 'Estudiante guardado exitosamente',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('Error en guardarEstudianteSimple:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: 'Error al guardar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar docente (VERSIÓN SIMPLE)
 */
function guardarDocenteSimple(data) {
  try {
    console.log('guardarDocenteSimple llamado con:', data);
    
    // Abrir la hoja
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Crear encabezados simples
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Cédula', 'Nombre', 'Grado', 'Sección', 
        'Funcionamiento Académico', 'Desarrollo Vocacional', 
        'Docente', 'Fecha Registro', 'Tipo', 'Timestamp'
      ]]);
    }
    
    // Preparar datos para insertar
    const timestamp = new Date().toLocaleString('es-CR');
    const row = [
      data.cedula || '',
      data.nombre || '',
      data.grado || '',
      data.seccion || '',
      data.funcionamientoAcademico || '',
      data.desarrolloVocacional || '',
      data.docente || '',
      data.fechaRegistro || timestamp,
      'docente',
      new Date().getTime()
    ];
    
    console.log('Insertando fila docente:', row);
    
    // Insertar fila
    sheet.appendRow(row);
    
    console.log('Fila docente insertada exitosamente');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: 'Docente guardado exitosamente',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('Error en guardarDocenteSimple:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: 'Error al guardar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para obtener datos (GET)
 */
function doGet(e) {
  try {
    console.log('doGet llamado con:', e.parameter);
    
    const action = e.parameter.action;
    
    if (action === 'getAllStudents') {
      return obtenerTodosEstudiantes();
    } else if (action === 'getAllTeachers') {
      return obtenerTodosDocentes();
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

/**
 * Obtener solo estudiantes
 */
function obtenerTodosEstudiantes() {
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
    
    const estudiantes = rows
      .filter(row => row[8] === 'estudiante') // Columna Tipo
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: estudiantes}))
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
      .filter(row => row[8] === 'docente') // Columna Tipo
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
 * Función de prueba
 */
function testSimple() {
  try {
    const testData = {
      cedula: '999999999',
      nombre: 'Estudiante Prueba Simple',
      grado: '11°',
      seccion: 'A',
      funcionamientoAcademico: '{"logros":"Prueba simple"}',
      desarrolloVocacional: '{"intereses":"Prueba simple"}',
      docente: '{"nombre":"Docente Prueba"}',
      fechaRegistro: new Date().toLocaleString('es-CR'),
      tipo: 'estudiante'
    };
    
    const result = guardarEstudianteSimple(testData);
    return result.getContent();
  } catch (error) {
    return 'Error en prueba: ' + error.toString();
  }
}
