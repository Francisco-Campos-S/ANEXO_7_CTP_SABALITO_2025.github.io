// Google Apps Script para ANEXO 7 - CTP SABALITO 2025
// Este código debe ser copiado y pegado en Google Apps Script

// ID de la hoja de cálculo - Reemplaza con el ID de tu hoja
const SPREADSHEET_ID = '1oziOBfMHdkoRLqrzWo0yP8sTgjHmLu9kWTzTXxt09YY';

// Función principal que maneja las solicitudes HTTP
function doPost(e) {
  try {
    // Configurar CORS para permitir solicitudes desde GitHub Pages
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
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
      default:
        response = { success: false, message: 'Acción no válida' };
    }
    
    // Devolver respuesta JSON
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('Error en doPost:', error);
    const errorResponse = {
      success: false,
      message: 'Error interno del servidor: ' + error.toString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para manejar la opción OPTIONS (CORS preflight)
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  return ContentService
    .createTextOutput('')
    .setHeaders(headers);
}

// Función para manejar el envío del formulario
function handleFormSubmission(formData) {
  try {
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Preparar los datos para la hoja
    const rowData = [
      new Date(), // Timestamp
      formData.studentInfo.name,
      formData.studentInfo.id,
      formData.studentInfo.grade,
      formData.studentInfo.year,
      
      // Funcionamiento Académico - Español
      formData.academicPerformance.espanol.logros,
      formData.academicPerformance.espanol.nivel,
      formData.academicPerformance.espanol.docente,
      
      // Funcionamiento Académico - Matemáticas
      formData.academicPerformance.matematicas.logros,
      formData.academicPerformance.matematicas.nivel,
      formData.academicPerformance.matematicas.docente,
      
      // Funcionamiento Académico - Ciencias
      formData.academicPerformance.ciencias.logros,
      formData.academicPerformance.ciencias.nivel,
      formData.academicPerformance.ciencias.docente,
      
      // Funcionamiento Académico - Estudios Sociales
      formData.academicPerformance.estudiosSociales.logros,
      formData.academicPerformance.estudiosSociales.nivel,
      formData.academicPerformance.estudiosSociales.docente,
      
      // Funcionamiento Académico - Otras
      formData.academicPerformance.otras.logros,
      formData.academicPerformance.otras.nivel,
      formData.academicPerformance.otras.docente,
      
      // Desarrollo Vocacional
      formData.vocationalDevelopment.interests,
      formData.vocationalDevelopment.expectations,
      formData.vocationalDevelopment.productiveSkills
    ];
    
    // Agregar la fila a la hoja
    sheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'Formulario guardado exitosamente',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error al guardar el formulario:', error);
    return {
      success: false,
      message: 'Error al guardar en la hoja de cálculo: ' + error.toString()
    };
  }
}

// Función para consultar un estudiante por cédula
function handleStudentQuery(studentId) {
  try {
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    
    // Buscar el estudiante por cédula (columna 2, índice 1)
    let studentRow = null;
    for (let i = 1; i < data.length; i++) { // Empezar desde la fila 2 (índice 1)
      if (data[i][2] === studentId) { // Columna C (índice 2) es la cédula
        studentRow = data[i];
        break;
      }
    }
    
    if (!studentRow) {
      return {
        success: false,
        message: 'Estudiante no encontrado'
      };
    }
    
    // Reconstruir los datos del estudiante
    const studentData = {
      studentInfo: {
        name: studentRow[1],
        id: studentRow[2],
        grade: studentRow[3],
        year: studentRow[4]
      },
      academicPerformance: {
        espanol: {
          logros: studentRow[5],
          nivel: studentRow[6],
          docente: studentRow[7]
        },
        matematicas: {
          logros: studentRow[8],
          nivel: studentRow[9],
          docente: studentRow[10]
        },
        ciencias: {
          logros: studentRow[11],
          nivel: studentRow[12],
          docente: studentRow[13]
        },
        estudiosSociales: {
          logros: studentRow[14],
          nivel: studentRow[15],
          docente: studentRow[16]
        },
        otras: {
          logros: studentRow[17],
          nivel: studentRow[18],
          docente: studentRow[19]
        }
      },
      vocationalDevelopment: {
        interests: studentRow[20],
        expectations: studentRow[21],
        productiveSkills: studentRow[22]
      }
    };
    
    return {
      success: true,
      data: studentData
    };
    
  } catch (error) {
    console.error('Error al consultar el estudiante:', error);
    return {
      success: false,
      message: 'Error al consultar la hoja de cálculo: ' + error.toString()
    };
  }
}

// Función para crear la estructura inicial de la hoja
function setupSpreadsheet() {
  try {
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
    
    console.log('Hoja configurada exitosamente');
    
  } catch (error) {
    console.error('Error al configurar la hoja:', error);
  }
}

// Función para obtener estadísticas  
function getStatistics() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    const data = sheet.getDataRange().getValues();
    const totalStudents = data.length - 1; // Restar 1 por los encabezados
    
    if (totalStudents <= 0) {
      return {
        totalStudents: 0,
        message: 'No hay estudiantes registrados'
      };
    }
    
    // Contar estudiantes por nivel
    const gradeCount = {};
    for (let i = 1; i < data.length; i++) {
      const grade = data[i][3]; // Columna D (índice 3) es el grado
      gradeCount[grade] = (gradeCount[grade] || 0) + 1;
    }
    
    return {
      totalStudents: totalStudents,
      gradeDistribution: gradeCount,
      lastUpdate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      error: 'Error al obtener estadísticas: ' + error.toString()
    };
  }
}
   