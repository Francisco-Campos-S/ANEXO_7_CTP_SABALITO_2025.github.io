/**
 * Google Apps Script JSONP - ANEXO 7 - CTP Sabalito 2025
 * Versión que soporta JSONP para evitar problemas de CORS
 */

// ID de la hoja de cálculo
const SHEET_ID = '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus';
const SHEET_NAME = 'Docentes';

/**
 * Función principal para recibir datos POST
 */
function doPost(e) {
  try {
    console.log('doPost llamado con:', e);
    
    // Validar que e no sea undefined
    if (!e) {
      console.log('⚠️ Parámetro e es undefined, usando valores por defecto');
      e = { parameter: {}, postData: {} };
    }
    
    console.log('e.parameter:', e.parameter);
    console.log('e.postData:', e.postData);
    
    // Intentar obtener parámetros de diferentes fuentes
    let params = e.parameter || {};
    
    // Si no hay parámetros en e.parameter, intentar parsear postData
    if (!params || Object.keys(params).length === 0) {
      if (e.postData && e.postData.contents) {
        try {
          const postData = e.postData.contents;
          console.log('PostData contents:', postData);
          
          // Parsear URLSearchParams
          const urlParams = new URLSearchParams(postData);
          params = {};
          for (const [key, value] of urlParams) {
            params[key] = value;
          }
          console.log('Parámetros parseados:', params);
        } catch (parseError) {
          console.error('Error parseando postData:', parseError);
        }
      }
    }
    
    const action = params.action;
    console.log('Acción detectada:', action);
    
    let result;
    
    if (action === 'saveStudent') {
      result = guardarEstudiante(params);
    } else {
      result = {
        success: false, 
        error: `Acción no válida para POST: ${action}`,
        receivedParams: params,
        availableActions: ['saveStudent']
      };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función principal para recibir datos GET
 */
function doGet(e) {
  try {
    console.log('doGet llamado con:', e);
    
    // Validar que e no sea undefined
    if (!e) {
      console.log('⚠️ Parámetro e es undefined, usando valores por defecto');
      e = { parameter: {} };
    }
    
    // Validar que e.parameter no sea undefined
    if (!e.parameter) {
      console.log('⚠️ e.parameter es undefined, inicializando objeto vacío');
      e.parameter = {};
    }
    
    console.log('Parámetros procesados:', e.parameter);
    
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    let result;
    
    console.log('Acción detectada:', action);
    
    if (action === 'getAllStudents') {
      console.log('=== EJECUTANDO getAllStudents ===');
      result = obtenerTodosEstudiantes();
      console.log('Resultado de getAllStudents:', result);
    } else if (action === 'getAllTeachers') {
      console.log('=== EJECUTANDO getAllTeachers ===');
      result = obtenerTodosDocentes();
    } else if (action === 'getStudent') {
      console.log('=== GET STUDENT ===');
      console.log('Parámetros recibidos:', e.parameter);
      console.log('Cédula recibida:', e.parameter.cedula, 'Tipo:', typeof e.parameter.cedula);
      result = obtenerEstudiantePorCedula(e.parameter.cedula);
    } else if (action === 'saveStudent') {
      console.log('=== EJECUTANDO saveStudent ===');
      result = guardarEstudiante(e.parameter);
    } else {
      console.log('=== ACCIÓN NO RECONOCIDA ===');
      console.log('Acción recibida:', action);
      result = {
        success: true, 
        message: 'Script funcionando correctamente',
        availableActions: ['getAllStudents', 'getAllTeachers', 'getStudent', 'saveStudent']
      };
    }
    
    // Si hay callback, usar JSONP
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(result)});`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Respuesta JSON normal
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.log('Error en doGet:', error);
    const errorResult = {success: false, error: error.toString()};
    
    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(`${e.parameter.callback}(${JSON.stringify(errorResult)});`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

/**
 * Obtener solo estudiantes (FILTRADO CORRECTAMENTE)
 */
function obtenerTodosEstudiantes() {
  try {
    console.log('=== INICIANDO obtenerTodosEstudiantes ===');
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('⚠️ Hoja no encontrada, creando nueva hoja:', SHEET_NAME);
      
      // Crear nueva hoja
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Agregar headers a la nueva hoja
      const headers = [
        'Cédula', 'Nombre', 'Grado', 'Sección',
        'Logros Español', 'Nivel Español', 'Docente Español',
        'Logros Matemáticas', 'Nivel Matemáticas', 'Docente Matemáticas',
        'Logros Ciencias', 'Nivel Ciencias', 'Docente Ciencias',
        'Logros Estudios Sociales', 'Nivel Estudios Sociales', 'Docente Estudios Sociales',
        'Logros Otras', 'Nivel Otras', 'Docente Otras',
        'Intereses y Habilidades', 'Expectativas Vocacionales', 'Observaciones Generales',
        'Docente Evaluador', 'Cédula Docente Evaluador', 'Fecha Evaluación',
        'Fecha Registro', 'Tipo'
      ];
      
      // Escribir headers en la primera fila
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      console.log('✅ Hoja creada exitosamente con headers:', headers);
      
      // Devolver lista vacía ya que es una hoja nueva
      return {
        success: true,
        data: [],
        message: 'Hoja creada exitosamente. No hay estudiantes registrados aún.',
        headers: headers,
        hojaCreada: true
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: false, 
        error: 'No hay datos en la hoja',
        totalRows: data.length
      };
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('Headers:', headers);
    console.log('Total rows:', rows.length);
    console.log('Primeras 3 filas de datos:', rows.slice(0, 3));
    
    // Encontrar la columna "Tipo" automáticamente
    const tipoColumnIndex = headers.findIndex(header => 
      header && header.toString().toLowerCase().includes('tipo')
    );
    
    console.log('Columna Tipo encontrada en índice:', tipoColumnIndex);
    
    // Mostrar todos los valores de la columna Tipo para diagnóstico
    if (tipoColumnIndex !== -1) {
      console.log('=== DIAGNÓSTICO DE COLUMNA TIPO ===');
      const tiposEncontrados = rows.map((row, index) => ({
        fila: index + 2, // +2 porque empezamos desde fila 2
        tipo: row[tipoColumnIndex],
        cedula: row[0] // Mostrar también la cédula para referencia
      }));
      console.log('Tipos encontrados en todas las filas:', tiposEncontrados);
    }
    
    if (tipoColumnIndex === -1) {
      console.log('Columna Tipo no encontrada, devolviendo todos los datos');
      // Si no encuentra la columna Tipo, devolver todos los datos
      const todosLosDatos = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      return {
        success: true, 
        data: todosLosDatos,
        message: `Total de registros (sin filtrar): ${todosLosDatos.length}`
      };
    }
    
    // Filtrar solo estudiantes (columna Tipo = 'estudiante') - CORRECCIÓN: comparación case-insensitive
    const estudiantes = rows
      .filter((row, idx) => {
        let tipo = row[tipoColumnIndex];
        const tipoNormalizado = (tipo || '').toString().trim().toLowerCase();
        const esEstudiante = tipoNormalizado === 'estudiante';
        // Fallback: si la columna Tipo quedó vacía por error anterior de índices, considerar estudiante
        const posibleRegistroPrevioSinTipo = !tipo && row[0] && row[1]; // Tiene cédula y nombre
        const decision = esEstudiante || posibleRegistroPrevioSinTipo;
        console.log(`Fila ${idx + 2}: TipoOriginal="${tipo}" Normalizado="${tipoNormalizado}" -> Estudiante=${decision}`);
        return decision;
      })
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        // Normalizar también claves en minúscula para front-end legacy
        obj.cedula = obj['Cédula'] || '';
        obj.nombre = obj['Nombre'] || '';
        obj.grado = obj['Grado'] || '';
        obj.seccion = obj['Sección'] || '';
        return obj;
      });
    
    console.log('✅ Estudiantes filtrados:', estudiantes.length);
    console.log('Estudiantes encontrados:', estudiantes);
    
    return {
      success: true, 
      data: estudiantes,
      message: `Total de estudiantes: ${estudiantes.length}`,
      headers: headers,
      tipoColumnIndex: tipoColumnIndex
    };
      
  } catch (error) {
    console.log('Error en obtenerTodosEstudiantes:', error);
    return {success: false, error: error.toString()};
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
      return {success: true, data: []};
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {success: true, data: []};
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Encontrar la columna "Tipo" automáticamente
    const tipoColumnIndex = headers.findIndex(header => 
      header && header.toString().toLowerCase().includes('tipo')
    );
    
    if (tipoColumnIndex === -1) {
      return {success: true, data: []};
    }
    
    const docentes = rows
      .filter(row => row[tipoColumnIndex] === 'docente')
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    
    return {success: true, data: docentes};
      
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

/**
 * Obtener estudiante por cédula
 */
function obtenerEstudiantePorCedula(cedula) {
  try {
    console.log('=== OBTENER ESTUDIANTE POR CÉDULA ===');
    console.log('Cédula buscada:', cedula, 'Tipo:', typeof cedula);
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('⚠️ Hoja no encontrada, creando nueva hoja:', SHEET_NAME);
      
      // Crear nueva hoja
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Agregar headers a la nueva hoja
      const headers = [
        'Cédula', 'Nombre', 'Grado', 'Sección',
        'Logros Español', 'Nivel Español', 'Docente Español',
        'Logros Matemáticas', 'Nivel Matemáticas', 'Docente Matemáticas',
        'Logros Ciencias', 'Nivel Ciencias', 'Docente Ciencias',
        'Logros Estudios Sociales', 'Nivel Estudios Sociales', 'Docente Estudios Sociales',
        'Logros Otras', 'Nivel Otras', 'Docente Otras',
        'Intereses y Habilidades', 'Expectativas Vocacionales', 'Observaciones Generales',
        'Docente Evaluador', 'Cédula Docente Evaluador', 'Fecha Evaluación',
        'Fecha Registro', 'Tipo'
      ];
      
      // Escribir headers en la primera fila
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      console.log('✅ Hoja creada exitosamente con headers:', headers);
      
      return {success: false, error: 'Hoja creada exitosamente. No hay estudiantes registrados aún.'};
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {success: false, error: 'No hay datos'};
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('Headers encontrados:', headers);
    console.log('Número de filas:', rows.length);
    console.log('Primeras 3 cédulas encontradas:', rows.slice(0, 3).map(row => ({cedula: row[0], tipo: typeof row[0]})));
    
    // Verificar que la cédula no sea undefined
    if (!cedula || cedula === undefined || cedula === null) {
      console.log('❌ Error: Cédula es undefined, null o vacía');
      return {success: false, error: 'Cédula es requerida'};
    }
    
    console.log('✅ Cédula válida recibida:', cedula, 'Tipo:', typeof cedula);
    
    // Buscar por cédula - manejar tanto string como número
    const estudiante = rows.find(row => {
      const rowCedula = row[0];
      // Normalizar ambos valores para comparación
      const cedulaNormalizada = cedula.toString().trim();
      const rowCedulaNormalizada = rowCedula.toString().trim();
      
      const match = rowCedulaNormalizada === cedulaNormalizada || 
                   rowCedula == cedula || 
                   rowCedula === cedula;
      
      if (match) {
        console.log('✅ Estudiante encontrado:', {
          cedulaBuscada: cedula, 
          cedulaEncontrada: rowCedula, 
          cedulaNormalizada: cedulaNormalizada,
          rowCedulaNormalizada: rowCedulaNormalizada,
          fila: row
        });
      }
      return match;
    });
    
    if (!estudiante) {
      console.log('Estudiante no encontrado con cédula:', cedula);
      return {success: false, error: 'Estudiante no encontrado'};
    }
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = estudiante[index] || '';
    });
    
    console.log('Objeto estudiante creado:', obj);
    console.log('=== DATOS ESPECÍFICOS DEL ESTUDIANTE ===');
    console.log('Cédula:', obj.Cédula);
    console.log('Nombre:', obj.Nombre);
    console.log('Logros Español:', obj['Logros Español']);
    console.log('Nivel Matemáticas:', obj['Nivel Matemáticas']);
    console.log('Docente Ciencias:', obj['Docente Ciencias']);
    console.log('==========================================');
    
    return {success: true, data: obj};
      
  } catch (error) {
    console.error('Error en obtenerEstudiantePorCedula:', error);
    return {success: false, error: error.toString()};
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
      return {success: true, data: []};
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {success: true, data: []};
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
    
    return {success: true, data: result};
      
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

/**
 * Guardar estudiante (crear nuevo o actualizar existente) - VERSIÓN SIMPLIFICADA
 */
function guardarEstudiante(params) {
  try {
    console.log('=== GUARDAR ESTUDIANTE ===');
    console.log('Parámetros recibidos:', params);
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('⚠️ Hoja no encontrada, creando nueva hoja:', SHEET_NAME);
      
      // Crear nueva hoja
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Agregar headers a la nueva hoja
      const headers = [
        'Cédula', 'Nombre', 'Grado', 'Sección',
        'Logros Español', 'Nivel Español', 'Docente Español',
        'Logros Matemáticas', 'Nivel Matemáticas', 'Docente Matemáticas',
        'Logros Ciencias', 'Nivel Ciencias', 'Docente Ciencias',
        'Logros Estudios Sociales', 'Nivel Estudios Sociales', 'Docente Estudios Sociales',
        'Logros Otras', 'Nivel Otras', 'Docente Otras',
        'Intereses y Habilidades', 'Expectativas Vocacionales', 'Observaciones Generales',
        'Docente Evaluador', 'Cédula Docente Evaluador', 'Fecha Evaluación',
        'Fecha Registro', 'Tipo'
      ];
      
      // Escribir headers en la primera fila
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      console.log('✅ Hoja creada exitosamente con headers:', headers);
    }
    
    const cedula = params.cedula || params.Cédula;
    console.log('Cédula a procesar:', cedula);
    
    if (!cedula) {
      return {success: false, error: 'Cédula es obligatoria'};
    }
    
    // Obtener todos los datos actuales
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('Headers encontrados:', headers);
    console.log('Número de filas existentes:', rows.length);
    
    // Buscar si ya existe un estudiante con esta cédula
    let existingRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === cedula) { // Columna Cédula (índice 0)
        existingRowIndex = i + 2; // +2 porque empezamos desde fila 2 (después de headers)
        console.log('Estudiante encontrado en fila:', existingRowIndex);
        break;
      }
    }
    
    if (existingRowIndex > 0) {
      // ACTUALIZAR fila existente
      console.log('ACTUALIZANDO estudiante existente...');

      const existingRow = rows[existingRowIndex - 2];
      const newRow = [...existingRow];

      // Mapeo corregido (27 columnas)
      const fieldMapping = {
        'cedula': 0, 'Cédula': 0,
        'nombre': 1, 'Nombre': 1,
        'grado': 2, 'Grado': 2,
        'seccion': 3, 'Sección': 3,
        'logros_espanol': 4, 'Logros Español': 4,
        'nivel_espanol': 5, 'Nivel Español': 5,
        'docente_espanol': 6, 'Docente Español': 6,
        'logros_matematicas': 7, 'Logros Matemáticas': 7,
        'nivel_matematicas': 8, 'Nivel Matemáticas': 8,
        'docente_matematicas': 9, 'Docente Matemáticas': 9,
        'logros_ciencias': 10, 'Logros Ciencias': 10,
        'nivel_ciencias': 11, 'Nivel Ciencias': 11,
        'docente_ciencias': 12, 'Docente Ciencias': 12,
        'logros_estudios_sociales': 13, 'Logros Estudios Sociales': 13,
        'nivel_estudios_sociales': 14, 'Nivel Estudios Sociales': 14,
        'docente_estudios_sociales': 15, 'Docente Estudios Sociales': 15,
        'logros_otras': 16, 'Logros Otras': 16,
        'nivel_otras': 17, 'Nivel Otras': 17,
        'docente_otras': 18, 'Docente Otras': 18,
        'intereses_habilidades': 19, 'Intereses y Habilidades': 19,
        'expectativas_vocacionales': 20, 'Expectativas Vocacionales': 20,
        'observaciones_generales': 21, 'Observaciones Generales': 21,
        'nombreDocenteEvaluador': 22, 'Docente Evaluador': 22,
        'cedulaDocenteEvaluador': 23, 'Cédula Docente Evaluador': 23,
        'fechaEvaluacion': 24, 'Fecha Evaluación': 24,
        'fechaRegistro': 25, 'Fecha Registro': 25,
        'tipo': 26, 'Tipo': 26
      };

      Object.keys(params).forEach(key => {
        if (fieldMapping[key] !== undefined && params[key] !== undefined && params[key] !== null && params[key] !== '') {
          const columnIndex = fieldMapping[key];
            newRow[columnIndex] = params[key];
            console.log(`Campo "${key}" (col ${columnIndex}) actualizado: "${params[key]}"`);
        }
      });

      const range = sheet.getRange(existingRowIndex, 1, 1, headers.length);
      range.setValues([newRow]);

      return { success: true, message: 'Estudiante actualizado exitosamente', action: 'updated', rowIndex: existingRowIndex };
    } else {
      // CREAR nueva fila
      console.log('CREANDO nuevo estudiante...');
      const newRow = new Array(headers.length).fill('');

      const fieldMapping = {
        'cedula': 0, 'Cédula': 0,
        'nombre': 1, 'Nombre': 1,
        'grado': 2, 'Grado': 2,
        'seccion': 3, 'Sección': 3,
        'logros_espanol': 4, 'Logros Español': 4,
        'nivel_espanol': 5, 'Nivel Español': 5,
        'docente_espanol': 6, 'Docente Español': 6,
        'logros_matematicas': 7, 'Logros Matemáticas': 7,
        'nivel_matematicas': 8, 'Nivel Matemáticas': 8,
        'docente_matematicas': 9, 'Docente Matemáticas': 9,
        'logros_ciencias': 10, 'Logros Ciencias': 10,
        'nivel_ciencias': 11, 'Nivel Ciencias': 11,
        'docente_ciencias': 12, 'Docente Ciencias': 12,
        'logros_estudios_sociales': 13, 'Logros Estudios Sociales': 13,
        'nivel_estudios_sociales': 14, 'Nivel Estudios Sociales': 14,
        'docente_estudios_sociales': 15, 'Docente Estudios Sociales': 15,
        'logros_otras': 16, 'Logros Otras': 16,
        'nivel_otras': 17, 'Nivel Otras': 17,
        'docente_otras': 18, 'Docente Otras': 18,
        'intereses_habilidades': 19, 'Intereses y Habilidades': 19,
        'expectativas_vocacionales': 20, 'Expectativas Vocacionales': 20,
        'observaciones_generales': 21, 'Observaciones Generales': 21,
        'nombreDocenteEvaluador': 22, 'Docente Evaluador': 22,
        'cedulaDocenteEvaluador': 23, 'Cédula Docente Evaluador': 23,
        'fechaEvaluacion': 24, 'Fecha Evaluación': 24,
        'fechaRegistro': 25, 'Fecha Registro': 25,
        'tipo': 26, 'Tipo': 26
      };

      Object.keys(params).forEach(key => {
        if (fieldMapping[key] !== undefined && params[key] !== undefined && params[key] !== null) {
          const columnIndex = fieldMapping[key];
          newRow[columnIndex] = params[key];
          console.log(`Campo "${key}" (col ${columnIndex}) establecido: "${params[key]}"`);
        }
      });

      // Asegurar campos esenciales
      if (!newRow[25]) newRow[25] = params.fechaRegistro || new Date().toLocaleString('es-CR');
      if (!newRow[26]) newRow[26] = params.tipo || 'estudiante';

      sheet.appendRow(newRow);
      return { success: true, message: 'Estudiante creado exitosamente', action: 'created' };
    }
      
  } catch (error) {
    console.error('Error en guardarEstudiante:', error);
    return {success: false, error: error.toString()};
  }
}
