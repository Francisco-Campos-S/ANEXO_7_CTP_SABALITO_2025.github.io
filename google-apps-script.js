/**
 * Google Apps Script para ANEXO 7 - Sistema de Gestión Estudiantil
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Copia este código en Google Apps Script (script.google.com)
 * 2. Guarda el proyecto con el nombre "ANEXO7_Backend"
 * 3. Haz clic en "Deploy" > "New deployment"
 * 4. Selecciona "Web app" como tipo
 * 5. Configura:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (para pruebas) o "Anyone with Google Account" (para producción)
 * 6. Haz clic en "Deploy"
 * 7. Copia la URL del web app y úsala en config.js
 */

// Configuración de la hoja de cálculo
const SPREADSHEET_CONFIG = {
  SPREADSHEET_ID: '1Bn-_gSDE4graJk4-Vo_FxUJtSzD8FbCfFQ2mfWwvohM',
  SHEET_NAME: 'ANEXO7_Estudiantes',
  HEADERS: [
    'ID', 'Fecha Creación', 'Institución', 'Circuito Escolar', 'Nombre Estudiante', 'Edad', 
    'Nivel que Cursa', 'Cédula', 'Fecha Nacimiento', 'Dirección', 'Nombre Encargado', 
    'Condición General de Salud', 'Condición Física y Movilidad', 'Desarrollo Socio Afectivo', 
    'Aspectos Familia y Comunidad', 'Comunicación y Lenguaje', 'Estilos de Aprendizaje', 
    'Ritmo de Aprendizaje', 'Memoria', 'Atención y Concentración', 'Razonamiento', 
    'Tipo de Agrupamientos', 'Materiales y Apoyos', 'Logros Español', 'Nivel Español', 
    'Firma Español', 'Logros Matemáticas', 'Nivel Matemáticas', 'Firma Matemáticas', 
    'Logros Ciencias', 'Nivel Ciencias', 'Firma Ciencias', 'Logros Estudios Sociales', 
    'Nivel Estudios Sociales', 'Firma Estudios Sociales', 'Logros Otras', 'Nivel Otras', 
    'Firma Otras', 'Desarrollo Vocacional', 'Firma Docente Solicitante', 'Firma Encargado Legal', 
    'Última Modificación'
  ]
};

// Función principal que maneja todas las peticiones
function doPost(e) {
  try {
    // Configurar CORS para permitir peticiones desde cualquier origen
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Obtener datos de la petición
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    
    switch(action) {
      case 'testConnection':
        result = testConnection();
        break;
      case 'saveStudent':
        result = saveStudent(data.studentData);
        break;
      case 'updateStudent':
        result = updateStudent(data.studentId, data.studentData);
        break;
      case 'deleteStudent':
        result = deleteStudent(data.studentId);
        break;
      case 'getAllStudents':
        result = getAllStudents();
        break;
      case 'getStudent':
        result = getStudent(data.studentId);
        break;
      default:
        throw new Error(`Acción no reconocida: ${action}`);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: result,
        message: 'Operación exitosa'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message,
        message: 'Error en la operación'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
  }
}

// Función para manejar peticiones OPTIONS (CORS preflight)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// Función para probar la conexión
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      // Crear la hoja si no existe
      const newSheet = spreadsheet.insertSheet(SPREADSHEET_CONFIG.SHEET_NAME);
      ensureHeaders(newSheet);
      return {
        message: 'Hoja creada exitosamente',
        sheetName: SPREADSHEET_CONFIG.SHEET_NAME,
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID
      };
    }
    
    return {
      message: 'Conexión exitosa',
      sheetName: SPREADSHEET_CONFIG.SHEET_NAME,
      spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
      rowCount: sheet.getLastRow(),
      columnCount: sheet.getLastColumn()
    };
  } catch (error) {
    throw new Error(`Error al conectar: ${error.message}`);
  }
}

// Función para asegurar que los encabezados estén presentes
function ensureHeaders(sheet) {
  const headers = SPREADSHEET_CONFIG.HEADERS;
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Ajustar ancho de columnas automáticamente
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

// Función para guardar un nuevo estudiante
function saveStudent(studentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SPREADSHEET_CONFIG.SHEET_NAME);
      ensureHeaders(sheet);
    }
    
    // Generar ID único y timestamp
    const studentId = generateStudentId();
    const timestamp = new Date().toISOString();
    
    // Preparar datos para la fila
    const rowData = prepareRowData(studentData, studentId, timestamp);
    
    // Agregar nueva fila
    const newRow = sheet.getLastRow() + 1;
    const range = sheet.getRange(newRow, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    return {
      studentId: studentId,
      message: 'Estudiante guardado exitosamente',
      row: newRow
    };
  } catch (error) {
    throw new Error(`Error al guardar estudiante: ${error.message}`);
  }
}

// Función para actualizar un estudiante existente
function updateStudent(studentId, studentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    // Buscar la fila del estudiante
    const studentRow = findStudentRow(sheet, studentId);
    if (!studentRow) {
      throw new Error('Estudiante no encontrado');
    }
    
    // Preparar datos actualizados
    const rowData = prepareRowData(studentData, studentId, new Date().toISOString());
    
    // Actualizar la fila
    const range = sheet.getRange(studentRow, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    return {
      message: 'Estudiante actualizado exitosamente',
      row: studentRow
    };
  } catch (error) {
    throw new Error(`Error al actualizar estudiante: ${error.message}`);
  }
}

// Función para eliminar un estudiante
function deleteStudent(studentId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    // Buscar la fila del estudiante
    const studentRow = findStudentRow(sheet, studentId);
    if (!studentRow) {
      throw new Error('Estudiante no encontrado');
    }
    
    // Eliminar la fila
    sheet.deleteRow(studentRow);
    
    return {
      message: 'Estudiante eliminado exitosamente',
      deletedRow: studentRow
    };
  } catch (error) {
    throw new Error(`Error al eliminar estudiante: ${error.message}`);
  }
}

// Función para obtener todos los estudiantes
function getAllStudents() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      return [];
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) { // Solo encabezados
      return [];
    }
    
    // Obtener todos los datos (excluyendo encabezados)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, SPREADSHEET_CONFIG.HEADERS.length);
    const values = dataRange.getValues();
    
    // Convertir a objetos de estudiantes
    const students = values.map(row => {
      const student = {};
      SPREADSHEET_CONFIG.HEADERS.forEach((header, index) => {
        student[header] = row[index] || '';
      });
      return student;
    });
    
    return students;
  } catch (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }
}

// Función para obtener un estudiante específico
function getStudent(studentId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    // Buscar la fila del estudiante
    const studentRow = findStudentRow(sheet, studentId);
    if (!studentRow) {
      throw new Error('Estudiante no encontrado');
    }
    
    // Obtener datos del estudiante
    const dataRange = sheet.getRange(studentRow, 1, 1, SPREADSHEET_CONFIG.HEADERS.length);
    const values = dataRange.getValues()[0];
    
    // Convertir a objeto
    const student = {};
    SPREADSHEET_CONFIG.HEADERS.forEach((header, index) => {
      student[header] = values[index] || '';
    });
    
    return student;
  } catch (error) {
    throw new Error(`Error al obtener estudiante: ${error.message}`);
  }
}

// Función auxiliar para buscar la fila de un estudiante
function findStudentRow(sheet, studentId) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  
  // Buscar en la columna ID (primera columna)
  const idRange = sheet.getRange(2, 1, lastRow - 1, 1);
  const ids = idRange.getValues();
  
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === studentId) {
      return i + 2; // +2 porque empezamos desde la fila 2 y i es 0-based
    }
  }
  
  return null;
}

// Función auxiliar para preparar datos de fila
function prepareRowData(studentData, studentId, timestamp) {
  const rowData = new Array(SPREADSHEET_CONFIG.HEADERS.length).fill('');
  
  // Mapear campos del formulario a las columnas correctas
  const fieldMapping = {
    'institucion': 'Institución',
    'circuito': 'Circuito Escolar',
    'estudiante': 'Nombre Estudiante',
    'edad': 'Edad',
    'nivel': 'Nivel que Cursa',
    'cedula': 'Cédula',
    'fechaNacimiento': 'Fecha Nacimiento',
    'direccion': 'Dirección',
    'encargado': 'Nombre Encargado',
    'condicionSalud': 'Condición General de Salud',
    'condicionFisica': 'Condición Física y Movilidad',
    'desarrolloSocial': 'Desarrollo Socio Afectivo',
    'aspectosFamilia': 'Aspectos Familia y Comunidad',
    'comunicacion': 'Comunicación y Lenguaje',
    'estilosAprendizaje': 'Estilos de Aprendizaje',
    'ritmoAprendizaje': 'Ritmo de Aprendizaje',
    'memoria': 'Memoria',
    'atencion': 'Atención y Concentración',
    'razonamiento': 'Razonamiento',
    'agrupamientos': 'Tipo de Agrupamientos',
    'materiales': 'Materiales y Apoyos',
    'logrosEspanol': 'Logros Español',
    'nivelEspanol': 'Nivel Español',
    'firmaEspanol': 'Firma Español',
    'logrosMatematicas': 'Logros Matemáticas',
    'nivelMatematicas': 'Nivel Matemáticas',
    'firmaMatematicas': 'Firma Matemáticas',
    'logrosCiencias': 'Logros Ciencias',
    'nivelCiencias': 'Nivel Ciencias',
    'firmaCiencias': 'Firma Ciencias',
    'logrosEstudiosSoc': 'Logros Estudios Sociales',
    'nivelEstudiosSoc': 'Nivel Estudios Sociales',
    'firmaEstudiosSoc': 'Firma Estudios Sociales',
    'logrosOtras': 'Logros Otras',
    'nivelOtras': 'Nivel Otras',
    'firmaOtras': 'Firma Otras',
    'desarrolloVocacional': 'Desarrollo Vocacional',
    'firmaDocente': 'Firma Docente Solicitante',
    'firmaEncargado': 'Firma Encargado Legal'
  };
  
  // Llenar ID y timestamp
  rowData[0] = studentId; // ID
  rowData[1] = timestamp; // Fecha Creación
  
  // Llenar datos del estudiante
  Object.keys(studentData).forEach(fieldName => {
    const headerName = fieldMapping[fieldName];
    if (headerName) {
      const columnIndex = SPREADSHEET_CONFIG.HEADERS.indexOf(headerName);
      if (columnIndex !== -1) {
        rowData[columnIndex] = studentData[fieldName] || '';
      }
    }
  });
  
  // Agregar timestamp de última modificación
  const lastModIndex = SPREADSHEET_CONFIG.HEADERS.indexOf('Última Modificación');
  if (lastModIndex !== -1) {
    rowData[lastModIndex] = timestamp;
  }
  
  return rowData;
}

// Función auxiliar para generar ID único de estudiante
function generateStudentId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `EST_${timestamp}_${random}`;
}

// Función para limpiar datos de prueba (opcional)
function clearTestData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (sheet) {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
    }
    
    return { message: 'Datos de prueba eliminados' };
  } catch (error) {
    throw new Error(`Error al limpiar datos: ${error.message}`);
  }
}
