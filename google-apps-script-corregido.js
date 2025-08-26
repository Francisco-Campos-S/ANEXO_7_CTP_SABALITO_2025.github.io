/**
 * Google Apps Script para ANEXO 7 - Sistema de Gestión Estudiantil
 * CÓDIGO CORREGIDO - Versión funcional
 */

// Configuración de la hoja de cálculo
const SPREADSHEET_CONFIG = {
  SPREADSHEET_ID: '1Bn-_gSDE4graJk4-Vo_FxUJtSzD8FbCfFQ2mfWwvohM',
  SHEET_NAME: 'ANEXO7_Estudiantes',
  HEADERS: [
    'ID', 'Fecha Creación', 'Institución', 'Circuito Escolar', 'Nombre Estudiante', 
    'Edad', 'Nivel que Cursa', 'Cédula', 'Fecha Nacimiento', 'Dirección', 
    'Nombre Encargado', 'Condición General de Salud', 'Condición Física y Movilidad', 
    'Desarrollo Socio Afectivo', 'Aspectos Familia y Comunidad', 'Comunicación y Lenguaje', 
    'Estilos de Aprendizaje', 'Ritmo de Aprendizaje', 'Memoria', 'Atención y Concentración', 
    'Razonamiento', 'Tipo de Agrupamientos', 'Materiales y Apoyos', 'Logros Español', 
    'Nivel Español', 'Firma Español', 'Logros Matemáticas', 'Nivel Matemáticas', 
    'Firma Matemáticas', 'Logros Ciencias', 'Nivel Ciencias', 'Firma Ciencias', 
    'Logros Estudios Sociales', 'Nivel Estudios Sociales', 'Firma Estudios Sociales', 
    'Logros Otras', 'Nivel Otras', 'Firma Otras', 'Desarrollo Vocacional', 
    'Firma Docente Solicitante', 'Firma Encargado Legal', 'Última Modificación'
  ]
};

/**
 * Función principal para manejar peticiones POST
 */
function doPost(e) {
  try {
    // Verificar que e y e.postData existan
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse(false, 'Datos de petición inválidos');
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (!action) {
      return createResponse(false, 'Acción no especificada');
    }

    let result;
    switch (action) {
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
        return createResponse(false, `Acción '${action}' no reconocida`);
    }

    return createResponse(true, 'Operación exitosa', result);
  } catch (error) {
    console.error('Error en doPost:', error);
    return createResponse(false, `Error: ${error.message}`);
  }
}

/**
 * Función para manejar peticiones OPTIONS (CORS)
 */
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Crear respuesta JSON
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Probar conexión con la hoja de cálculo
 */
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      // Crear hoja si no existe
      sheet = spreadsheet.insertSheet(SPREADSHEET_CONFIG.SHEET_NAME);
      ensureHeaders(sheet);
    } else {
      // Verificar que tenga los encabezados correctos
      ensureHeaders(sheet);
    }
    
    return {
      spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
      sheetName: SPREADSHEET_CONFIG.SHEET_NAME,
      rowCount: sheet.getLastRow(),
      columnCount: sheet.getLastColumn()
    };
  } catch (error) {
    throw new Error(`Error al conectar con la hoja: ${error.message}`);
  }
}

/**
 * Asegurar que los encabezados estén configurados correctamente
 */
function ensureHeaders(sheet) {
  const headerRow = sheet.getRange(1, 1, 1, SPREADSHEET_CONFIG.HEADERS.length);
  headerRow.setValues([SPREADSHEET_CONFIG.HEADERS]);
  
  // Formatear encabezados
  headerRow.setFontWeight('bold');
  headerRow.setBackground('#4285f4');
  headerRow.setFontColor('white');
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
}

/**
 * Guardar nuevo estudiante
 */
function saveStudent(studentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    const studentId = generateStudentId();
    const timestamp = new Date().toISOString();
    const rowData = prepareRowData(studentData, studentId, timestamp);
    
    sheet.appendRow(rowData);
    
    return {
      studentId: studentId,
      message: 'Estudiante guardado exitosamente'
    };
  } catch (error) {
    throw new Error(`Error al guardar estudiante: ${error.message}`);
  }
}

/**
 * Actualizar estudiante existente
 */
function updateStudent(studentId, studentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    const rowIndex = findStudentRow(sheet, studentId);
    if (rowIndex === -1) {
      throw new Error('Estudiante no encontrado');
    }
    
    const timestamp = new Date().toISOString();
    const rowData = prepareRowData(studentData, studentId, timestamp);
    
    // Actualizar fila (excluyendo ID y fecha de creación)
    const range = sheet.getRange(rowIndex, 3, 1, rowData.length - 2);
    range.setValues([rowData.slice(2)]);
    
    // Actualizar última modificación
    sheet.getRange(rowIndex, SPREADSHEET_CONFIG.HEADERS.length).setValue(timestamp);
    
    return {
      studentId: studentId,
      message: 'Estudiante actualizado exitosamente'
    };
  } catch (error) {
    throw new Error(`Error al actualizar estudiante: ${error.message}`);
  }
}

/**
 * Eliminar estudiante
 */
function deleteStudent(studentId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    const rowIndex = findStudentRow(sheet, studentId);
    if (rowIndex === -1) {
      throw new Error('Estudiante no encontrado');
    }
    
    sheet.deleteRow(rowIndex);
    
    return {
      studentId: studentId,
      message: 'Estudiante eliminado exitosamente'
    };
  } catch (error) {
    throw new Error(`Error al eliminar estudiante: ${error.message}`);
  }
}

/**
 * Obtener todos los estudiantes
 */
function getAllStudents() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      return [];
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return []; // Solo encabezados
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, SPREADSHEET_CONFIG.HEADERS.length).getValues();
    
    return data.map(row => {
      const student = {};
      SPREADSHEET_CONFIG.HEADERS.forEach((header, index) => {
        student[header] = row[index] || '';
      });
      return student;
    });
  } catch (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }
}

/**
 * Obtener estudiante específico
 */
function getStudent(studentId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SPREADSHEET_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Hoja no encontrada');
    }
    
    const rowIndex = findStudentRow(sheet, studentId);
    if (rowIndex === -1) {
      throw new Error('Estudiante no encontrado');
    }
    
    const rowData = sheet.getRange(rowIndex, 1, 1, SPREADSHEET_CONFIG.HEADERS.length).getValues()[0];
    
    const student = {};
    SPREADSHEET_CONFIG.HEADERS.forEach((header, index) => {
      student[header] = rowData[index] || '';
    });
    
    return student;
  } catch (error) {
    throw new Error(`Error al obtener estudiante: ${error.message}`);
  }
}

/**
 * Encontrar fila del estudiante por ID
 */
function findStudentRow(sheet, studentId) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  
  const idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < idColumn.length; i++) {
    if (idColumn[i][0] === studentId) {
      return i + 2; // +2 porque empezamos desde la fila 2 y los arrays son 0-based
    }
  }
  return -1;
}

/**
 * Preparar datos de fila para la hoja
 */
function prepareRowData(studentData, studentId, timestamp) {
  const rowData = new Array(SPREADSHEET_CONFIG.HEADERS.length);
  
  // Mapear campos del formulario a columnas de la hoja
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
  
  // Llenar array con datos
  SPREADSHEET_CONFIG.HEADERS.forEach((header, index) => {
    if (index === 0) {
      rowData[index] = studentId; // ID
    } else if (index === 1) {
      rowData[index] = timestamp; // Fecha Creación
    } else if (index === SPREADSHEET_CONFIG.HEADERS.length - 1) {
      rowData[index] = timestamp; // Última Modificación
    } else {
      // Buscar valor en studentData usando el mapeo
      let value = '';
      for (const [formField, sheetHeader] of Object.entries(fieldMapping)) {
        if (sheetHeader === header && studentData[formField]) {
          value = studentData[formField];
          break;
        }
      }
      rowData[index] = value;
    }
  });
  
  return rowData;
}

/**
 * Generar ID único para estudiante
 */
function generateStudentId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `EST${timestamp}${random}`;
}

/**
 * Función de prueba para verificar que el script funciona
 */
function test() {
  console.log('Google Apps Script funcionando correctamente');
  return 'OK';
}
