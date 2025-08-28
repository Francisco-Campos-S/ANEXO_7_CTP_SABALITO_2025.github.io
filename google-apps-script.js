// Google Apps Script para ANEXO 7 - CTP SABALITO 2025
// VERSIÓN MEJORADA CON MANEJO DE ERRORES DE RED

// ID de la hoja de cálculo
const SPREADSHEET_ID = '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus';

// Función que se ejecuta cuando accedes directamente a la URL del Web App
function doGet(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Google Apps Script Web App funcionando correctamente',
        timestamp: new Date().toISOString(),
        spreadsheetId: SPREADSHEET_ID,
        status: 'online'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error en el servidor: ' + error.toString(),
        timestamp: new Date().toISOString(),
        status: 'error'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función principal que maneja las solicitudes HTTP POST
function doPost(e) {
  try {
    // Validar que e y e.postData existan
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Datos de solicitud no válidos',
          timestamp: new Date().toISOString(),
          error: 'invalid_request_data'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener los datos de la solicitud
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    let response;
    
    // Manejar diferentes acciones
    switch (action) {
      case 'submit':
        response = handleFormSubmission(requestData.data);
        break;
      case 'query':
        response = handleStudentQuery(requestData.studentId);
        break;
      case 'getAllStudents':
        response = getAllStudents();
        break;
      case 'testConnection':
        response = testConnection();
        break;
      case 'setupSpreadsheet':
        response = setupSpreadsheet();
        break;
      case 'getStatistics':
        response = getStatistics();
        break;
      case 'ping':
        response = { success: true, message: 'Ping exitoso', timestamp: new Date().toISOString() };
        break;
      default:
        response = { 
          success: false, 
          message: 'Acción no válida: ' + action,
          timestamp: new Date().toISOString(),
          error: 'invalid_action'
        };
    }
    
    // Agregar timestamp a la respuesta
    if (response && typeof response === 'object') {
      response.timestamp = new Date().toISOString();
    }
    
    // Crear respuesta JSON
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error en doPost:', error);
    const errorResponse = {
      success: false,
      message: 'Error interno del servidor: ' + error.toString(),
      timestamp: new Date().toISOString(),
      error: 'internal_server_error',
      details: error.stack || 'No hay detalles disponibles'
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para manejar la opción OPTIONS (CORS preflight)
function doOptions(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'OPTIONS request handled',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error en OPTIONS: ' + error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para probar la conexión
function testConnection() {
  try {
    console.log('🔄 Probando conexión con Google Sheets...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error('No se pudo abrir el spreadsheet');
    }
    
    const sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      throw new Error('No se pudo obtener la hoja activa');
    }
    
    // Probar acceso a datos
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    console.log('✅ Conexión exitosa con Google Sheets');
    
    return {
      success: true,
      data: {
        message: 'Conexión exitosa con Google Sheets',
        spreadsheetId: SPREADSHEET_ID,
        sheetName: sheet.getName(),
        rowCount: values.length,
        columnCount: values.length > 0 ? values[0].length : 0,
        timestamp: new Date().toISOString(),
        status: 'connected'
      }
    };
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return {
      success: false,
      message: 'Error de conexión: ' + error.toString(),
      error: 'connection_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// Función para manejar el envío del formulario
function handleFormSubmission(formData) {
  try {
    console.log('📝 Procesando envío de formulario...');
    
    // Validar datos requeridos
    if (!formData || !formData.studentInfo || !formData.studentInfo.id) {
      return {
        success: false,
        message: 'Datos del estudiante incompletos',
        error: 'incomplete_data',
        required: ['studentInfo.id', 'studentInfo.name']
      };
    }
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Asegurar que los headers estén configurados
    ensureHeaders(sheet);
    
    // Preparar los datos para la hoja
    const rowData = [
      new Date(), // Timestamp
      formData.studentInfo.name || '',
      formData.studentInfo.id || '',
      formData.studentInfo.grade || '',
      formData.studentInfo.year || '',
      
      // Funcionamiento Académico - Español
      formData.academicPerformance?.espanol?.logros || '',
      formData.academicPerformance?.espanol?.nivel || '',
      formData.academicPerformance?.espanol?.docente || '',
      
      // Funcionamiento Académico - Matemáticas
      formData.academicPerformance?.matematicas?.logros || '',
      formData.academicPerformance?.matematicas?.nivel || '',
      formData.academicPerformance?.matematicas?.docente || '',
      
      // Funcionamiento Académico - Ciencias
      formData.academicPerformance?.ciencias?.logros || '',
      formData.academicPerformance?.ciencias?.nivel || '',
      formData.academicPerformance?.ciencias?.docente || '',
      
      // Funcionamiento Académico - Estudios Sociales
      formData.academicPerformance?.estudiosSociales?.logros || '',
      formData.academicPerformance?.estudiosSociales?.nivel || '',
      formData.academicPerformance?.estudiosSociales?.docente || '',
      
      // Funcionamiento Académico - Otras
      formData.academicPerformance?.otras?.logros || '',
      formData.academicPerformance?.otras?.nivel || '',
      formData.academicPerformance?.otras?.docente || '',
      
      // Desarrollo Vocacional
      formData.vocationalDevelopment?.interests || '',
      formData.vocationalDevelopment?.expectations || '',
      formData.vocationalDevelopment?.productiveSkills || ''
    ];
    
    // Agregar la fila a la hoja
    sheet.appendRow(rowData);
    
    console.log('✅ Formulario guardado exitosamente');
    
    return {
      success: true,
      message: 'Formulario guardado exitosamente',
      data: {
        studentId: formData.studentInfo.id,
        studentName: formData.studentInfo.name,
        timestamp: new Date().toISOString(),
        rowNumber: sheet.getLastRow()
      }
    };
    
  } catch (error) {
    console.error('❌ Error al guardar el formulario:', error);
    return {
      success: false,
      message: 'Error al guardar en la hoja de cálculo: ' + error.toString(),
      error: 'save_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// Función para consultar un estudiante por cédula
function handleStudentQuery(studentId) {
  try {
    console.log('🔍 Consultando estudiante con ID:', studentId);
    
    if (!studentId) {
      return {
        success: false,
        message: 'ID del estudiante requerido',
        error: 'missing_student_id'
      };
    }
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: false,
        message: 'No hay estudiantes registrados',
        error: 'no_students_found'
      };
    }
    
    // Buscar el estudiante por cédula (columna 2, índice 2)
    let studentRow = null;
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) { // Empezar desde la fila 2 (índice 1)
      if (data[i][2] === studentId) { // Columna C (índice 2) es la cédula
        studentRow = data[i];
        rowIndex = i + 1; // +1 porque los índices de fila empiezan en 1
        break;
      }
    }
    
    if (!studentRow) {
      return {
        success: false,
        message: 'Estudiante no encontrado con cédula: ' + studentId,
        error: 'student_not_found',
        searchedId: studentId
      };
    }
    
    // Reconstruir los datos del estudiante
    const studentData = {
      studentInfo: {
        name: studentRow[1] || '',
        id: studentRow[2] || '',
        grade: studentRow[3] || '',
        year: studentRow[4] || ''
      },
      academicPerformance: {
        espanol: {
          logros: studentRow[5] || '',
          nivel: studentRow[6] || '',
          docente: studentRow[7] || ''
        },
        matematicas: {
          logros: studentRow[8] || '',
          nivel: studentRow[9] || '',
          docente: studentRow[10] || ''
        },
        ciencias: {
          logros: studentRow[11] || '',
          nivel: studentRow[12] || '',
          docente: studentRow[13] || ''
        },
        estudiosSociales: {
          logros: studentRow[14] || '',
          nivel: studentRow[15] || '',
          docente: studentRow[16] || ''
        },
        otras: {
          logros: studentRow[17] || '',
          nivel: studentRow[18] || '',
          docente: studentRow[19] || ''
        }
      },
      vocationalDevelopment: {
        interests: studentRow[20] || '',
        expectations: studentRow[21] || '',
        productiveSkills: studentRow[22] || ''
      },
      metadata: {
        rowNumber: rowIndex,
        timestamp: studentRow[0] || '',
        lastQueried: new Date().toISOString()
      }
    };
    
    console.log('✅ Estudiante encontrado:', studentData.studentInfo.name);
    
    return {
      success: true,
      data: studentData
    };
    
  } catch (error) {
    console.error('❌ Error al consultar el estudiante:', error);
    return {
      success: false,
      message: 'Error al consultar la hoja de cálculo: ' + error.toString(),
      error: 'query_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// Función para obtener todos los estudiantes
function getAllStudents() {
  try {
    console.log('📋 Obteniendo todos los estudiantes...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        data: [],
        message: 'No hay estudiantes registrados',
        count: 0
      };
    }
    
    const students = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      students.push({
        rowNumber: i + 1,
        timestamp: row[0] || '',
        name: row[1] || '',
        id: row[2] || '',
        grade: row[3] || '',
        year: row[4] || ''
      });
    }
    
    console.log('✅ Estudiantes obtenidos:', students.length);
    
    return {
      success: true,
      data: students,
      count: students.length
    };
    
  } catch (error) {
    console.error('❌ Error al obtener estudiantes:', error);
    return {
      success: false,
      message: 'Error al obtener estudiantes: ' + error.toString(),
      error: 'fetch_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// Función para asegurar que los headers estén configurados
function ensureHeaders(sheet) {
  try {
    if (!sheet) {
      console.error('❌ Sheet es undefined');
      return false;
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Si no hay datos o solo hay una fila vacía, configurar headers
    if (data.length === 0 || (data.length === 1 && data[0].every(cell => !cell))) {
      console.log('🔄 Configurando headers automáticamente...');
      setupSpreadsheet();
      return true;
    }
    
    // Verificar si ya tiene headers
    const firstRow = data[0];
    if (firstRow[0] === 'Timestamp' && firstRow[1] === 'Nombre del Estudiante') {
      console.log('✅ Headers ya están configurados');
      return true; // Ya tiene headers
    }
    
    // Si no tiene headers, configurarlos
    console.log('🔄 Headers incorrectos, configurando...');
    setupSpreadsheet();
    return true;
    
  } catch (error) {
    console.error('❌ Error al verificar headers:', error);
    return false;
  }
}

// Función para crear la estructura inicial de la hoja
function setupSpreadsheet() {
  try {
    console.log('🔄 Configurando estructura de la hoja...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Crear encabezados
    const headers = [
      'Timestamp',
      'Nombre del Estudiante',
      'Cédula',
      'Grado/Nivel',
      'Año',
      
      // Funcionamiento Académico - Español
      'Español - Logros',
      'Español - Nivel',
      'Español - Docente',
      
      // Funcionamiento Académico - Matemáticas
      'Matemáticas - Logros',
      'Matemáticas - Nivel',
      'Matemáticas - Docente',
      
      // Funcionamiento Académico - Ciencias
      'Ciencias - Logros',
      'Ciencias - Nivel',
      'Ciencias - Docente',
      
      // Funcionamiento Académico - Estudios Sociales
      'Estudios Sociales - Logros',
      'Estudios Sociales - Nivel',
      'Estudios Sociales - Docente',
      
      // Funcionamiento Académico - Otras
      'Otras - Logros',
      'Otras - Nivel',
      'Otras - Docente',
      
      // Desarrollo Vocacional
      'Intereses y Habilidades',
      'Expectativas Vocacionales',
      'Habilidades Productivas'
    ];
    
    // Limpiar la hoja y agregar encabezados
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Formatear encabezados
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#3498db');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // Ajustar ancho de columnas
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    console.log('✅ Hoja configurada exitosamente');
    
    return {
      success: true,
      message: 'Hoja configurada exitosamente',
      headersCount: headers.length
    };
    
  } catch (error) {
    console.error('❌ Error al configurar la hoja:', error);
    return {
      success: false,
      message: 'Error al configurar la hoja: ' + error.toString(),
      error: 'setup_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// Función para obtener estadísticas  
function getStatistics() {
  try {
    console.log('📊 Obteniendo estadísticas...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    const data = sheet.getDataRange().getValues();
    const totalStudents = data.length - 1; // Restar 1 por los encabezados
    
    if (totalStudents <= 0) {
      return {
        success: true,
        data: {
          totalStudents: 0,
          message: 'No hay estudiantes registrados',
          lastUpdate: new Date().toISOString()
        }
      };
    }
    
    // Contar estudiantes por nivel
    const gradeCount = {};
    for (let i = 1; i < data.length; i++) {
      const grade = data[i][3]; // Columna D (índice 3) es el grado
      if (grade) {
        gradeCount[grade] = (gradeCount[grade] || 0) + 1;
      }
    }
    
    console.log('✅ Estadísticas obtenidas');
    
    return {
      success: true,
      data: {
        totalStudents: totalStudents,
        gradeDistribution: gradeCount,
        lastUpdate: new Date().toISOString(),
        dataRange: {
          rows: data.length,
          columns: data.length > 0 ? data[0].length : 0
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return {
      success: false,
      message: 'Error al obtener estadísticas: ' + error.toString(),
      error: 'stats_failed',
      details: error.stack || 'No hay detalles disponibles'
    };
  }
}

// ===== FUNCIONES DE PRUEBA PARA EJECUTAR DESDE EL EDITOR =====

// Función simple para probar desde el editor
function testSimple() {
  console.log('✅ Función de prueba ejecutada correctamente');
  return 'Función de prueba ejecutada correctamente';
}

// Función para probar la conexión desde el editor
function testFromEditor() {
  try {
    console.log('🔄 Probando conexión...');
    const result = testConnection();
    console.log('Resultado:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en prueba:', error);
    return { error: error.toString() };
  }
}

// Función para crear la hoja desde el editor
function testCreateSheet() {
  try {
    console.log('🔄 Creando hoja...');
    const result = setupSpreadsheet();
    console.log('Resultado:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al crear hoja:', error);
    return { error: error.toString() };
  }
}

// Función para probar todas las funcionalidades
function testAllFunctions() {
  try {
    console.log('🧪 Iniciando pruebas completas...');
    
    const results = {
      connection: testConnection(),
      setup: setupSpreadsheet(),
      statistics: getStatistics(),
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Todas las pruebas completadas');
    console.log('Resultados:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    return { error: error.toString() };
  }
}
