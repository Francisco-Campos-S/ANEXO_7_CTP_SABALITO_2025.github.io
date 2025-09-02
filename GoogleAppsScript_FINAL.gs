/**
 * Google Apps Script FINAL para ANEXO 7 - CTP Sabalito 2025
 * Versión que guarda datos legibles sin corchetes JSON
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
      return guardarEstudianteFinal(data);
    } else {
      return guardarDocenteFinal(data);
    }
    
  } catch (error) {
    console.log('Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar estudiante (VERSIÓN FINAL - SIN CORCHETES)
 */
function guardarEstudianteFinal(data) {
  try {
    console.log('guardarEstudianteFinal llamado con:', data);
    
    // Abrir la hoja
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Crear encabezados
      sheet.getRange(1, 1, 1, 17).setValues([[
        'Cédula', 'Nombre', 'Grado', 'Sección', 
        'Logros Español', 'Nivel Español', 'Docente Español',
        'Logros Matemáticas', 'Nivel Matemáticas', 'Docente Matemáticas',
        'Intereses y Habilidades', 'Expectativas Vocacionales', 'Observaciones Generales',
        'Docente Evaluador', 'Fecha Evaluación', 'Fecha Registro', 'Tipo'
      ]]);
    }
    
    // Verificar si ya existe un estudiante con esa cédula
    const existingData = sheet.getDataRange().getValues();
    const cedulaExists = existingData.length > 1 && existingData.slice(1).some(row => 
      row[0] && row[0].toString() === data.cedula && row[16] === 'estudiante'
    );
    
    if (cedulaExists) {
      // Actualizar estudiante existente
      return actualizarEstudianteExistente(data, sheet, existingData);
    }
    
    // Preparar datos para insertar (formato legible)
    const timestamp = new Date().toLocaleString('es-CR');
    
    // Parsear datos del funcionamiento académico
    let logrosEspanol = '';
    let nivelEspanol = '';
    let docenteEspanol = '';
    let logrosMatematicas = '';
    let nivelMatematicas = '';
    let docenteMatematicas = '';
    
    if (data.funcionamientoAcademico) {
      try {
        const academico = typeof data.funcionamientoAcademico === 'string' 
          ? JSON.parse(data.funcionamientoAcademico) 
          : data.funcionamientoAcademico;
        
        logrosEspanol = academico.logros_espanol || '';
        nivelEspanol = academico.nivel_espanol || '';
        docenteEspanol = academico.docente_espanol || '';
        logrosMatematicas = academico.logros_matematicas || '';
        nivelMatematicas = academico.nivel_matematicas || '';
        docenteMatematicas = academico.docente_matematicas || '';
      } catch (e) {
        console.log('Error parseando funcionamiento académico:', e);
      }
    }
    
    // Parsear datos del desarrollo vocacional
    let interesesHabilidades = '';
    let expectativasVocacionales = '';
    let observacionesGenerales = '';
    
    if (data.desarrolloVocacional) {
      try {
        const vocacional = typeof data.desarrolloVocacional === 'string' 
          ? JSON.parse(data.desarrolloVocacional) 
          : data.desarrolloVocacional;
        
        interesesHabilidades = vocacional.intereses_habilidades || '';
        expectativasVocacionales = vocacional.expectativas_vocacionales || '';
        observacionesGenerales = vocacional.observaciones_generales || '';
      } catch (e) {
        console.log('Error parseando desarrollo vocacional:', e);
      }
    }
    
    // Parsear datos del docente
    let docenteEvaluador = '';
    let fechaEvaluacion = '';
    
    if (data.docente) {
      try {
        const docente = typeof data.docente === 'string' 
          ? JSON.parse(data.docente) 
          : data.docente;
        
        docenteEvaluador = docente.nombre || '';
        fechaEvaluacion = docente.fechaEvaluacion || '';
      } catch (e) {
        console.log('Error parseando docente:', e);
      }
    }
    
    const row = [
      data.cedula || '',
      data.nombre || '',
      data.grado || '',
      data.seccion || '',
      logrosEspanol,
      nivelEspanol,
      docenteEspanol,
      logrosMatematicas,
      nivelMatematicas,
      docenteMatematicas,
      interesesHabilidades,
      expectativasVocacionales,
      observacionesGenerales,
      docenteEvaluador,
      fechaEvaluacion,
      data.fechaRegistro || timestamp,
      'estudiante'
    ];
    
    console.log('Insertando fila final:', row);
    
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
    console.log('Error en guardarEstudianteFinal:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: 'Error al guardar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar docente (VERSIÓN FINAL)
 */
function guardarDocenteFinal(data) {
  try {
    console.log('guardarDocenteFinal llamado con:', data);
    
    // Abrir la hoja
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Crear encabezados
      sheet.getRange(1, 1, 1, 15).setValues([[
        'Cédula', 'Nombre', 'Grado', 'Sección', 
        'Logros Español', 'Nivel Español', 'Docente Español',
        'Logros Matemáticas', 'Nivel Matemáticas', 'Docente Matemáticas',
        'Intereses y Habilidades', 'Expectativas Vocacionales', 'Observaciones Generales',
        'Docente Evaluador', 'Fecha Evaluación', 'Fecha Registro', 'Tipo'
      ]]);
    }
    
    // Preparar datos para insertar
    const timestamp = new Date().toLocaleString('es-CR');
    
    const row = [
      data.cedula || '',
      data.nombre || '',
      data.grado || '',
      data.seccion || '',
      '', '', '', '', '', '', '', '', '', '', '',
      data.fechaRegistro || timestamp,
      'docente'
    ];
    
    console.log('Insertando fila docente final:', row);
    
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
    console.log('Error en guardarDocenteFinal:', error);
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
      .filter(row => row[16] === 'estudiante') // Columna Tipo (índice 16)
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
      .filter(row => row[16] === 'docente') // Columna Tipo (índice 16)
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
 * Obtener un estudiante específico por cédula
 */
function obtenerEstudiantePorCedula(cedula) {
  try {
    console.log('Buscando estudiante con cédula:', cedula);
    
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
    
    // Buscar estudiante por cédula
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toString() === cedula && row[16] === 'estudiante') {
        const estudiante = {};
        headers.forEach((header, index) => {
          estudiante[header] = row[index] || '';
        });
        
        // Reconstruir los objetos JSON para el formulario
        estudiante.funcionamientoAcademico = {
          logros_espanol: estudiante['Logros Español'] || '',
          nivel_espanol: estudiante['Nivel Español'] || '',
          docente_espanol: estudiante['Docente Español'] || '',
          logros_matematicas: estudiante['Logros Matemáticas'] || '',
          nivel_matematicas: estudiante['Nivel Matemáticas'] || '',
          docente_matematicas: estudiante['Docente Matemáticas'] || ''
        };
        
        estudiante.desarrolloVocacional = {
          intereses_habilidades: estudiante['Intereses y Habilidades'] || '',
          expectativas_vocacionales: estudiante['Expectativas Vocacionales'] || '',
          observaciones_generales: estudiante['Observaciones Generales'] || ''
        };
        
        estudiante.docente = {
          nombre: estudiante['Docente Evaluador'] || '',
          fechaEvaluacion: estudiante['Fecha Evaluación'] || ''
        };
        
        console.log('Estudiante encontrado:', estudiante);
        
        return ContentService
          .createTextOutput(JSON.stringify({success: true, data: estudiante}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Estudiante no encontrado'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('Error en obtenerEstudiantePorCedula:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para actualizar un estudiante existente
 */
function actualizarEstudianteExistente(data, sheet, existingData) {
  try {
    console.log('Actualizando estudiante existente:', data.cedula);
    
    // Buscar la fila del estudiante
    const headers = existingData[0];
    const rows = existingData.slice(1);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toString() === data.cedula && row[16] === 'estudiante') {
        
        // Preparar datos actualizados
        const timestamp = new Date().toLocaleString('es-CR');
        
        // Parsear datos del funcionamiento académico
        let logrosEspanol = '';
        let nivelEspanol = '';
        let docenteEspanol = '';
        let logrosMatematicas = '';
        let nivelMatematicas = '';
        let docenteMatematicas = '';
        
        if (data.funcionamientoAcademico) {
          try {
            const academico = typeof data.funcionamientoAcademico === 'string' 
              ? JSON.parse(data.funcionamientoAcademico) 
              : data.funcionamientoAcademico;
            
            logrosEspanol = academico.logros_espanol || '';
            nivelEspanol = academico.nivel_espanol || '';
            docenteEspanol = academico.docente_espanol || '';
            logrosMatematicas = academico.logros_matematicas || '';
            nivelMatematicas = academico.nivel_matematicas || '';
            docenteMatematicas = academico.docente_matematicas || '';
          } catch (e) {
            console.log('Error parseando funcionamiento académico:', e);
          }
        }
        
        // Parsear datos del desarrollo vocacional
        let interesesHabilidades = '';
        let expectativasVocacionales = '';
        let observacionesGenerales = '';
        
        if (data.desarrolloVocacional) {
          try {
            const vocacional = typeof data.desarrolloVocacional === 'string' 
              ? JSON.parse(data.desarrolloVocacional) 
              : data.desarrolloVocacional;
            
            interesesHabilidades = vocacional.intereses_habilidades || '';
            expectativasVocacionales = vocacional.expectativas_vocacionales || '';
            observacionesGenerales = vocacional.observaciones_generales || '';
          } catch (e) {
            console.log('Error parseando desarrollo vocacional:', e);
          }
        }
        
        // Parsear datos del docente
        let docenteEvaluador = '';
        let fechaEvaluacion = '';
        
        if (data.docente) {
          try {
            const docente = typeof data.docente === 'string' 
              ? JSON.parse(data.docente) 
              : data.docente;
            
            docenteEvaluador = docente.nombre || '';
            fechaEvaluacion = docente.fechaEvaluacion || '';
          } catch (e) {
            console.log('Error parseando docente:', e);
          }
        }
        
        // Crear fila actualizada
        const updatedRow = [
          data.cedula || '',
          data.nombre || '',
          data.grado || '',
          data.seccion || '',
          logrosEspanol,
          nivelEspanol,
          docenteEspanol,
          logrosMatematicas,
          nivelMatematicas,
          docenteMatematicas,
          interesesHabilidades,
          expectativasVocacionales,
          observacionesGenerales,
          docenteEvaluador,
          fechaEvaluacion,
          timestamp, // Actualizar fecha de registro
          'estudiante'
        ];
        
        console.log('Actualizando fila:', updatedRow);
        
        // Actualizar la fila (fila i+2 porque empezamos desde la fila 2)
        sheet.getRange(i + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
        
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true, 
            message: 'Estudiante actualizado exitosamente',
            timestamp: timestamp
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: 'Estudiante no encontrado para actualizar'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('Error en actualizarEstudianteExistente:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: 'Error al actualizar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función de prueba
 */
function testFinal() {
  try {
    const testData = {
      cedula: '777777777',
      nombre: 'Estudiante Prueba Final',
      grado: '11°',
      seccion: 'C',
      funcionamientoAcademico: '{"logros_espanol":"Prueba final","nivel_espanol":"Bueno","docente_espanol":"Prof. Prueba"}',
      desarrolloVocacional: '{"intereses_habilidades":"Prueba final","expectativas_vocacionales":"Estudiar"}',
      docente: '{"nombre":"Docente Prueba Final","fechaEvaluacion":"2025-09-02"}',
      fechaRegistro: new Date().toLocaleString('es-CR'),
      tipo: 'estudiante'
    };
    
    const result = guardarEstudianteFinal(testData);
    return result.getContent();
  } catch (error) {
    return 'Error en prueba: ' + error.toString();
  }
}
