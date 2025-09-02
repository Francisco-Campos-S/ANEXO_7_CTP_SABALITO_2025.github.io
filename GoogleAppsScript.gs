/**
 * Google Apps Script para ANEXO 7 - CTP Sabalito 2025
 * Maneja el almacenamiento y recuperación de datos de docentes
 */

// ID de la hoja de cálculo (se debe configurar)
const SHEET_ID = '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus'; // ID de la hoja de CTP Sabalito
const SHEET_NAME = 'Docentes';

/**
 * Función para obtener o crear la hoja de trabajo
 */
function getOrCreateSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      initializeSheetHeaders(sheet);
    }
    
    return sheet;
  } catch (error) {
    throw new Error('Error al acceder a la hoja de cálculo: ' + error.toString());
  }
}

/**
 * Función para inicializar los encabezados de la hoja
 */
function initializeSheetHeaders(sheet) {
  const headers = [
    'Cédula',
    'Nombre',
    'Teléfono',
    'Email',
    'Dirección',
    'Fecha de Nacimiento',
    'Especialidad',
    'Nivel Académico',
    'Experiencia',
    'Estado',
    'Cursos',
    'Horas Semanales',
    'Modalidad',
    'Certificaciones',
    'Observaciones',
    'Fecha de Registro',
    'Grado', // Para estudiantes
    'Sección', // Para estudiantes
    'Funcionamiento Académico', // Para estudiantes
    'Desarrollo Vocacional', // Para estudiantes
    'Docente', // Para estudiantes
    'Tipo' // Para distinguir docentes de estudiantes
  ];
  
  // Establecer encabezados
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Función para agregar un nuevo docente o estudiante
 */
function doPost(e) {
  try {
    let data;
    
    // Manejar diferentes tipos de datos
    if (e.postData && e.postData.contents) {
      // Datos JSON
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // Datos de formulario
      data = e.parameter;
    } else {
      throw new Error('No se recibieron datos');
    }
    
    // Determinar si es docente o estudiante
    const isStudent = data.tipo === 'estudiante';
    
    if (isStudent) {
      return saveStudent(data);
    } else {
      return saveTeacher(data);
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar un docente
 */
function saveTeacher(data) {
  try {
    // Validar datos requeridos para docentes
    if (!data.cedula || !data.nombre || !data.email || !data.especialidad || !data.nivel || !data.estado) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Faltan datos requeridos'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener o crear la hoja
    const sheet = getOrCreateSheet();
    
    // Verificar si ya existe un docente con esa cédula
    const existingData = sheet.getDataRange().getValues();
    const cedulaExists = existingData.length > 1 && existingData.slice(1).some(row => row[0] === data.cedula);
    
    if (cedulaExists) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Ya existe un docente con esa cédula'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Agregar timestamp
    data.fechaRegistro = new Date().toLocaleString('es-CR');
    
    // Preparar fila para insertar
    const row = [
      data.cedula,
      data.nombre,
      data.telefono || '',
      data.email,
      data.direccion || '',
      data.fechaNacimiento || '',
      data.especialidad,
      data.nivel,
      data.experiencia || 0,
      data.estado,
      data.cursos || '',
      data.horasSemanales || '',
      data.modalidad || '',
      data.certificaciones || '',
      data.observaciones || '',
      data.fechaRegistro
    ];
    
    // Insertar nueva fila
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Docente agregado exitosamente'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para guardar un estudiante
 */
function saveStudent(data) {
  try {
    // Validar datos requeridos para estudiantes
    if (!data.cedula || !data.nombre) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Faltan datos requeridos del estudiante'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener o crear la hoja
    const sheet = getOrCreateSheet();
    
    // Verificar si ya existe un estudiante con esa cédula
    const existingData = sheet.getDataRange().getValues();
    const cedulaExists = existingData.length > 1 && existingData.slice(1).some(row => row[0] === data.cedula);
    
    if (cedulaExists) {
      // Actualizar estudiante existente
      return updateStudent(data, sheet, existingData);
    } else {
      // Crear nuevo estudiante
      return createNewStudent(data, sheet);
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para crear un nuevo estudiante
 */
function createNewStudent(data, sheet) {
  try {
    // Agregar timestamp
    data.fechaRegistro = new Date().toLocaleString('es-CR');
    
    // Preparar fila para insertar (formato completo con todas las columnas)
    const row = [
      data.cedula,                    // Cédula
      data.nombre,                    // Nombre
      '',                            // Teléfono
      '',                            // Email
      '',                            // Dirección
      '',                            // Fecha de Nacimiento
      '',                            // Especialidad
      '',                            // Nivel Académico
      '',                            // Experiencia
      '',                            // Estado
      '',                            // Cursos
      '',                            // Horas Semanales
      '',                            // Modalidad
      '',                            // Certificaciones
      '',                            // Observaciones
      data.fechaRegistro,            // Fecha de Registro
      data.grado || '',              // Grado
      data.seccion || '',            // Sección
      data.funcionamientoAcademico || '', // Funcionamiento Académico
      data.desarrolloVocacional || '',    // Desarrollo Vocacional
      data.docente || '',            // Docente
      'estudiante'                   // Tipo
    ];
    
    // Insertar nueva fila
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Estudiante agregado exitosamente'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para actualizar un estudiante existente
 */
function updateStudent(data, sheet, existingData) {
  try {
    // Buscar la fila del estudiante
    const headers = existingData[0];
    const rows = existingData.slice(1);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toString() === data.cedula && row[21] === 'estudiante') {
        // Actualizar la fila (formato completo con todas las columnas)
        const updatedRow = [
          data.cedula,                    // Cédula
          data.nombre,                    // Nombre
          row[2] || '',                   // Teléfono (mantener existente)
          row[3] || '',                   // Email (mantener existente)
          row[4] || '',                   // Dirección (mantener existente)
          row[5] || '',                   // Fecha de Nacimiento (mantener existente)
          row[6] || '',                   // Especialidad (mantener existente)
          row[7] || '',                   // Nivel Académico (mantener existente)
          row[8] || '',                   // Experiencia (mantener existente)
          row[9] || '',                   // Estado (mantener existente)
          row[10] || '',                  // Cursos (mantener existente)
          row[11] || '',                  // Horas Semanales (mantener existente)
          row[12] || '',                  // Modalidad (mantener existente)
          row[13] || '',                  // Certificaciones (mantener existente)
          row[14] || '',                  // Observaciones (mantener existente)
          new Date().toLocaleString('es-CR'), // Fecha de Registro (actualizar)
          data.grado || '',               // Grado
          data.seccion || '',             // Sección
          data.funcionamientoAcademico || '', // Funcionamiento Académico
          data.desarrolloVocacional || '',     // Desarrollo Vocacional
          data.docente || '',             // Docente
          'estudiante'                    // Tipo
        ];
        
        // Actualizar la fila (fila i+2 porque empezamos desde la fila 2)
        sheet.getRange(i + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
        
        return ContentService
          .createTextOutput(JSON.stringify({success: true, message: 'Estudiante actualizado exitosamente'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Estudiante no encontrado para actualizar'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para obtener todos los docentes o estudiantes
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getStudent') {
      // Buscar estudiante específico
      return getStudent(e.parameter.cedula);
    } else if (action === 'getAllStudents') {
      // Obtener todos los estudiantes
      return getAllStudents();
    } else {
      // Obtener todos los docentes (comportamiento por defecto)
      return getAllTeachers();
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para obtener todos los docentes
 */
function getAllTeachers() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Si solo hay encabezados, devolver array vacío
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Omitir la primera fila (encabezados)
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convertir a objetos (solo docentes, no estudiantes)
    const docentes = rows
      .filter(row => !row[21] || row[21] !== 'estudiante') // Filtrar estudiantes (columna 22, índice 21)
      .map(row => {
        const docente = {};
        headers.forEach((header, index) => {
          docente[header] = row[index] || '';
        });
        return docente;
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
 * Función para obtener todos los estudiantes
 */
function getAllStudents() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Si solo hay encabezados, devolver array vacío
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, data: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Omitir la primera fila (encabezados)
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convertir a objetos (solo estudiantes)
    const estudiantes = rows
      .filter(row => row[21] === 'estudiante') // Solo estudiantes (columna 22, índice 21)
      .map(row => {
        const estudiante = {};
        headers.forEach((header, index) => {
          estudiante[header] = row[index] || '';
        });
        
        // Parsear JSON strings si existen
        try {
          if (estudiante['Funcionamiento Académico']) {
            estudiante.funcionamientoAcademico = JSON.parse(estudiante['Funcionamiento Académico']);
          }
          if (estudiante['Desarrollo Vocacional']) {
            estudiante.desarrolloVocacional = JSON.parse(estudiante['Desarrollo Vocacional']);
          }
          if (estudiante['Docente']) {
            estudiante.docente = JSON.parse(estudiante['Docente']);
          }
        } catch (e) {
          console.log('Error parsing JSON:', e);
        }
        
        return estudiante;
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
 * Función para obtener un estudiante específico
 */
function getStudent(cedula) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'Estudiante no encontrado'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Buscar estudiante por cédula
    const headers = data[0];
    const rows = data.slice(1);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toString() === cedula && row[21] === 'estudiante') {
        const estudiante = {};
        headers.forEach((header, index) => {
          estudiante[header] = row[index] || '';
        });
        
        // Parsear JSON strings si existen
        try {
          if (estudiante['Funcionamiento Académico']) {
            estudiante.funcionamientoAcademico = JSON.parse(estudiante['Funcionamiento Académico']);
          }
          if (estudiante['Desarrollo Vocacional']) {
            estudiante.desarrolloVocacional = JSON.parse(estudiante['Desarrollo Vocacional']);
          }
          if (estudiante['Docente']) {
            estudiante.docente = JSON.parse(estudiante['Docente']);
          }
        } catch (e) {
          console.log('Error parsing JSON:', e);
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({success: true, data: estudiante}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Estudiante no encontrado'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para inicializar la hoja de cálculo
 */
function initializeSheet() {
  try {
    // Obtener o crear la hoja
    const sheet = getOrCreateSheet();
    
    // Verificar si ya tiene encabezados
    const existingData = sheet.getDataRange().getValues();
    if (existingData.length === 0) {
      initializeSheetHeaders(sheet);
    }
    
    return 'Hoja inicializada correctamente';
  } catch (error) {
    return 'Error al inicializar la hoja: ' + error.toString();
  }
}

/**
 * Función de prueba para verificar que el script funciona
 */
function testStudentSave() {
  try {
    const testData = {
      cedula: '999999999',
      nombre: 'Estudiante Prueba',
      grado: '11°',
      seccion: 'A',
      funcionamientoAcademico: '{"logros_espanol":"Prueba","nivel_espanol":"Bueno"}',
      desarrolloVocacional: '{"intereses_habilidades":"Prueba"}',
      docente: '{"nombre":"Docente Prueba","cedula":"111111111"}',
      fechaRegistro: new Date().toLocaleString('es-CR'),
      tipo: 'estudiante'
    };
    
    const result = saveStudent(testData);
    return result.getContent();
  } catch (error) {
    return 'Error en prueba: ' + error.toString();
  }
}
