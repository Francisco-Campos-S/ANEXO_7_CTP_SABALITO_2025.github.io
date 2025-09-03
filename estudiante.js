/**
 * Script para el formulario de estudiantes - ANEXO 7
 * CTP Sabalito 2025
 */

// Función para obtener la URL del script
function getScriptUrl() {
    // URL deployment actualizado (02/09/2025)
    return 'https://script.google.com/macros/s/AKfycbyH8GmiD0GJTO_MCvdypRU8_LtcAJYxkIobGOVh67m8WLhdcuPcClY-u9SiBlcR5eJoxg/exec';
}

document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual solo si el campo existe
    const today = new Date().toISOString().split('T')[0];
    var fechaInput = document.getElementById('fechaEvaluacion');
    if (fechaInput) fechaInput.value = today;

    // Actualizar lista de estudiantes SIEMPRE al abrir o recargar
    if (typeof loadAllStudents === 'function') {
        loadAllStudents();
    }

    // Cargar lista de estudiantes en el select (si existe)
    if (typeof cargarListaEstudiantes === 'function') {
        cargarListaEstudiantes();
    }
});

// Función para buscar estudiante
async function buscarEstudiante() {
    const cedula = document.getElementById('cedulaEstudiante').value.trim();
    
    if (!cedula) {
        showErrorMessage('Por favor ingrese la cédula del estudiante');
        return;
    }
    
    if (cedula.length !== 9) {
        showErrorMessage('La cédula debe tener 9 dígitos');
        return;
    }
    
    try {
        showLoadingMessage();
        // Buscar en la lista de estudiantes existentes
        const response = await fetch(getScriptUrl() + '?action=getStudent&cedula=' + cedula, {
            method: 'GET',
            mode: 'cors'
        });
        const result = await response.json();
        if (result.success && result.data) {
            // Estudiante encontrado, llenar formulario
            llenarFormularioEstudiante(result.data);
            document.getElementById('studentForm').style.display = 'block';
            showSuccessMessage('Estudiante encontrado');
        } else {
            // Estudiante no encontrado, crear nuevo
            crearNuevoEstudiante(cedula);
            document.getElementById('studentForm').style.display = 'block';
            showSuccessMessage('Nuevo estudiante creado');
        }
    } catch (error) {
        console.error('Error al buscar estudiante:', error);
        // Solo mostrar el error si el usuario intentó buscar, no al inicio
        if (cedula) {
            showErrorMessage('Error al buscar estudiante: ' + error.message);
        }
    }
}

// Función para llenar formulario con datos del estudiante
function llenarFormularioEstudiante(estudiante) {
    // Llenar campos básicos
    var cedulaInput = document.getElementById('cedula');
    if (cedulaInput) cedulaInput.value = estudiante.Cédula || estudiante.cedula || '';
    var nombreInput = document.getElementById('nombre');
    if (nombreInput) nombreInput.value = estudiante.Nombre || estudiante.nombre || '';
    var gradoInput = document.getElementById('grado');
    if (gradoInput) gradoInput.value = estudiante.Grado || estudiante.grado || '';
    var seccionInput = document.getElementById('seccion');
    if (seccionInput) seccionInput.value = estudiante.Sección || estudiante.seccion || '';

    // Hacer campos de solo lectura para estudiante existente
    if (cedulaInput) cedulaInput.readOnly = true;
    if (nombreInput) nombreInput.readOnly = true;
    if (gradoInput) gradoInput.readOnly = true;
    if (seccionInput) seccionInput.readOnly = true;
    
    // Mostrar en consola los valores actuales
    console.log('Campos básicos llenados:', {
        cedula: cedulaInput ? cedulaInput.value : '',
        nombre: nombreInput ? nombreInput.value : '',
        grado: gradoInput ? gradoInput.value : '',
        seccion: seccionInput ? seccionInput.value : ''
    });
    
    // Llenar datos académicos - USAR DATOS DIRECTOS DEL GOOGLE SHEETS
    console.log('Llenando datos académicos con datos directos del Google Sheets');
    
    // Mapeo directo de los datos del Google Sheets a los campos del formulario
    // Los datos vienen directamente del Google Sheets con los nombres de las columnas
    
    // Español
    document.querySelector('[name="logros_espanol"]').value = estudiante['Logros Español'] || '';
    document.querySelector('[name="nivel_espanol"]').value = estudiante['Nivel Español'] || '';
    document.querySelector('[name="docente_espanol"]').value = estudiante['Docente Español'] || '';
    
    // Matemáticas
    document.querySelector('[name="logros_matematicas"]').value = estudiante['Logros Matemáticas'] || '';
    document.querySelector('[name="nivel_matematicas"]').value = estudiante['Nivel Matemáticas'] || '';
    document.querySelector('[name="docente_matematicas"]').value = estudiante['Docente Matemáticas'] || '';
    
    // Ciencias
    document.querySelector('[name="logros_ciencias"]').value = estudiante['Logros Ciencias'] || '';
    document.querySelector('[name="nivel_ciencias"]').value = estudiante['Nivel Ciencias'] || '';
    document.querySelector('[name="docente_ciencias"]').value = estudiante['Docente Ciencias'] || '';
    
    // Estudios Sociales
    document.querySelector('[name="logros_estudios_sociales"]').value = estudiante['Logros Estudios Sociales'] || '';
    document.querySelector('[name="nivel_estudios_sociales"]').value = estudiante['Nivel Estudios Sociales'] || '';
    document.querySelector('[name="docente_estudios_sociales"]').value = estudiante['Docente Estudios Sociales'] || '';
    
    // Otras
    document.querySelector('[name="logros_otras"]').value = estudiante['Logros Otras'] || '';
    document.querySelector('[name="nivel_otras"]').value = estudiante['Nivel Otras'] || '';
    document.querySelector('[name="docente_otras"]').value = estudiante['Docente Otras'] || '';
    
    console.log('Datos académicos llenados desde Google Sheets');
    
    // Llenar datos vocacionales - USAR DATOS DIRECTOS DEL GOOGLE SHEETS
    console.log('Llenando datos vocacionales desde Google Sheets');
    var interesesInput = document.getElementById('intereses_habilidades');
    if (interesesInput) interesesInput.value = estudiante['Intereses y Habilidades'] || '';
    var expectativasInput = document.getElementById('expectativas_vocacionales');
    if (expectativasInput) expectativasInput.value = estudiante['Expectativas Vocacionales'] || '';
    var observacionesInput = document.getElementById('observaciones_generales');
    if (observacionesInput) observacionesInput.value = estudiante['Observaciones Generales'] || '';
    
    // Llenar datos del docente evaluador - USAR DATOS DIRECTOS DEL GOOGLE SHEETS
    console.log('Llenando datos del docente desde Google Sheets');
    var nombreDocenteInput = document.getElementById('nombreDocenteEvaluador');
    if (nombreDocenteInput) nombreDocenteInput.value = estudiante['Docente Evaluador'] || '';
    var cedulaDocenteInput = document.getElementById('cedulaDocenteEvaluador');
    if (cedulaDocenteInput) cedulaDocenteInput.value = estudiante['Cédula Docente Evaluador'] || '';
    var fechaEvaluacionInput = document.getElementById('fechaEvaluacion');
    if (fechaEvaluacionInput) fechaEvaluacionInput.value = estudiante['Fecha Evaluación'] || new Date().toISOString().split('T')[0];
    
    console.log('Todos los datos llenados desde Google Sheets');
}

// Función para limpiar completamente el formulario
function limpiarFormularioCompleto() {
    console.log('Limpiando formulario completamente...');
    // Limpiar campos básicos y hacer editables solo si existen
    var cedulaInput = document.getElementById('cedula');
    if (cedulaInput) {
        cedulaInput.value = '';
        cedulaInput.readOnly = false;
    }
    var nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.value = '';
        nombreInput.readOnly = false;
    }
    var gradoInput = document.getElementById('grado');
    if (gradoInput) {
        gradoInput.value = '';
        gradoInput.readOnly = false;
    }
    var seccionInput = document.getElementById('seccion');
    if (seccionInput) {
        seccionInput.value = '';
        seccionInput.readOnly = false;
    }
    
    // Limpiar campos académicos - Español
    document.querySelector('[name="logros_espanol"]').value = '';
    document.querySelector('[name="nivel_espanol"]').value = '';
    document.querySelector('[name="docente_espanol"]').value = '';
    
    // Limpiar campos académicos - Matemáticas
    document.querySelector('[name="logros_matematicas"]').value = '';
    document.querySelector('[name="nivel_matematicas"]').value = '';
    document.querySelector('[name="docente_matematicas"]').value = '';
    
    // Limpiar campos académicos - Ciencias
    document.querySelector('[name="logros_ciencias"]').value = '';
    document.querySelector('[name="nivel_ciencias"]').value = '';
    document.querySelector('[name="docente_ciencias"]').value = '';
    
    // Limpiar campos académicos - Estudios Sociales
    document.querySelector('[name="logros_estudios_sociales"]').value = '';
    document.querySelector('[name="nivel_estudios_sociales"]').value = '';
    document.querySelector('[name="docente_estudios_sociales"]').value = '';
    
    // Limpiar campos académicos - Otras
    document.querySelector('[name="logros_otras"]').value = '';
    document.querySelector('[name="nivel_otras"]').value = '';
    document.querySelector('[name="docente_otras"]').value = '';
    
    // Limpiar campos vocacionales
    var interesesInput = document.getElementById('intereses_habilidades');
    if (interesesInput) interesesInput.value = '';
    var expectativasInput = document.getElementById('expectativas_vocacionales');
    if (expectativasInput) expectativasInput.value = '';
    var observacionesInput = document.getElementById('observaciones_generales');
    if (observacionesInput) observacionesInput.value = '';
    // Limpiar campos del docente evaluador
    var nombreDocenteInput = document.getElementById('nombreDocenteEvaluador');
    if (nombreDocenteInput) nombreDocenteInput.value = '';
    var cedulaDocenteInput = document.getElementById('cedulaDocenteEvaluador');
    if (cedulaDocenteInput) cedulaDocenteInput.value = '';
    var fechaEvaluacionInput = document.getElementById('fechaEvaluacion');
    if (fechaEvaluacionInput) fechaEvaluacionInput.value = new Date().toISOString().split('T')[0];
    // Limpiar lista de estudiantes
    const select = document.getElementById('listaEstudiantes');
    if (select) select.innerHTML = '<option value="">-- Seleccionar un estudiante --</option>';
    
    console.log('Formulario limpiado completamente');
}

// Función para crear nuevo estudiante
function crearNuevoEstudiante(cedula) {
    // Limpiar formulario completamente
    limpiarFormularioCompleto();
    // Llenar cédula
    var cedulaInput = document.getElementById('cedula');
    if (cedulaInput) cedulaInput.value = cedula;
    // Configurar fecha actual
    var fechaEvaluacionInput = document.getElementById('fechaEvaluacion');
    if (fechaEvaluacionInput) fechaEvaluacionInput.value = new Date().toISOString().split('T')[0];
    // Mostrar información del estudiante
    mostrarInfoEstudiante({
        cedula: cedula,
        nombre: 'Nuevo Estudiante',
        grado: '',
        seccion: ''
    });
    console.log('Nuevo estudiante creado con cédula:', cedula);
}

// Función para crear nuevo estudiante manualmente
window.crearNuevoEstudianteManual = function() {
    console.log('Creando nuevo estudiante...');
    
    // Limpiar formulario completamente
    limpiarFormularioCompleto();
    
    // Configurar fecha actual
    document.getElementById('fechaEvaluacion').value = new Date().toISOString().split('T')[0];
    
    // Mostrar formulario
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('studentInfo').style.display = 'none';
    
    // Enfocar en el primer campo
    document.getElementById('cedula').focus();
    
    // Mostrar mensaje
    showSuccessMessage('✅ Formulario listo para nuevo estudiante - Campos editables');
    
    console.log('Formulario preparado para nuevo estudiante');
};

// Función para mostrar información del estudiante
function mostrarInfoEstudiante(estudiante) {
    const studentInfo = document.getElementById('studentInfo');
    if (!studentInfo) return; // Si no existe el elemento, no hacer nada
    studentInfo.innerHTML = `
        <div class="student-card">
            <h4><i class="fas fa-user"></i> ${estudiante.nombre || 'Nuevo Estudiante'}</h4>
            <p><strong>Cédula:</strong> ${estudiante.cedula}</p>
            <p><strong>Grado:</strong> ${estudiante.grado || 'No especificado'}</p>
            <p><strong>Sección:</strong> ${estudiante.seccion || 'No especificada'}</p>
        </div>
    `;
    studentInfo.style.display = 'block';
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    // Eliminar notificaciones previas de éxito
    document.querySelectorAll('.notification.success').forEach(n => n.remove());
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
    // Eliminar notificaciones previas de error
    document.querySelectorAll('.notification.error').forEach(n => n.remove());
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para mostrar mensaje de carga
function showLoadingMessage() {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification loading';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Guardando información...</span>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2000);
}

// Función para llenar datos de prueba
window.fillTestDataStudent = function() {
    // Información del estudiante
    document.getElementById('cedula').value = '123456789';
    document.getElementById('nombre').value = 'Juan Carlos Pérez González';
    document.getElementById('grado').value = '11°';
    document.getElementById('seccion').value = 'A';
    
    // Funcionamiento Académico - Español
    document.querySelector('[name="logros_espanol"]').value = 'Demuestra excelente comprensión lectora y habilidades de escritura. Participa activamente en discusiones literarias.';
    document.querySelector('[name="nivel_espanol"]').value = 'Excelente';
    document.querySelector('[name="docente_espanol"]').value = 'María Elena Rodríguez';
    
    // Funcionamiento Académico - Matemáticas
    document.querySelector('[name="logros_matematicas"]').value = 'Resuelve problemas complejos con facilidad. Aplica conceptos matemáticos en situaciones reales.';
    document.querySelector('[name="nivel_matematicas"]').value = 'Muy Bueno';
    document.querySelector('[name="docente_matematicas"]').value = 'Carlos Alberto Méndez';
    
    // Funcionamiento Académico - Ciencias
    document.querySelector('[name="logros_ciencias"]').value = 'Muestra gran interés por la experimentación. Comprende conceptos científicos básicos.';
    document.querySelector('[name="nivel_ciencias"]').value = 'Bueno';
    document.querySelector('[name="docente_ciencias"]').value = 'Ana Patricia Jiménez';
    
    // Funcionamiento Académico - Estudios Sociales
    document.querySelector('[name="logros_estudios_sociales"]').value = 'Conoce la historia de Costa Rica. Participa en debates sobre temas sociales.';
    document.querySelector('[name="nivel_estudios_sociales"]').value = 'Bueno';
    document.querySelector('[name="docente_estudios_sociales"]').value = 'Roberto Carlos Vega';
    
    // Desarrollo Vocacional
    document.getElementById('intereses_habilidades').value = 'Muestra interés en la tecnología y programación. Participa en actividades deportivas, especialmente fútbol. Tiene habilidades artísticas en dibujo y pintura.';
    document.getElementById('expectativas_vocacionales').value = 'Aspira a estudiar Ingeniería en Sistemas o Diseño Gráfico. Interesado en trabajar en empresas tecnológicas.';
    document.getElementById('observaciones_generales').value = 'Estudiante responsable y comprometido. Liderazgo natural en actividades grupales.';
    
    // Información del Docente Evaluador
    document.getElementById('nombreDocenteEvaluador').value = 'Lic. María Elena Rodríguez';
    document.getElementById('cedulaDocenteEvaluador').value = '123456789';
    
    showSuccessMessage('✅ Datos de prueba cargados exitosamente');
};

// Función para llenar docentes por materia desde el docente evaluador
window.fillTeachersFromEvaluator = function() {
    const nombreEvaluador = document.getElementById('nombreDocenteEvaluador').value.trim();
    
    if (!nombreEvaluador) {
        showErrorMessage('Por favor ingrese primero el nombre del docente evaluador');
        return;
    }
    
    // Llenar todos los campos de docentes con el nombre del evaluador
    document.querySelector('[name="docente_espanol"]').value = nombreEvaluador;
    document.querySelector('[name="docente_matematicas"]').value = nombreEvaluador;
    document.querySelector('[name="docente_ciencias"]').value = nombreEvaluador;
    document.querySelector('[name="docente_estudios_sociales"]').value = nombreEvaluador;
    document.querySelector('[name="docente_otras"]').value = nombreEvaluador;
    
    showSuccessMessage('Docentes por materia llenados automáticamente');
};

// Función para buscar estudiante por cédula
window.buscarEstudiante = async function() {
    try {
        const cedula = document.getElementById('cedulaEstudiante').value.trim();
        
        if (!cedula) {
            showErrorMessage('❌ Por favor ingresa una cédula');
            return;
        }
        
        showLoadingMessage('🔍 Buscando estudiante...');
        
        const scriptUrl = getScriptUrl();
        const response = await fetch(`${scriptUrl}?action=getStudent&cedula=${cedula}`);
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar datos del estudiante en el formulario
                cargarDatosEstudiante(result.data);
                showSuccessMessage('✅ Estudiante encontrado y cargado');
            } else {
                showErrorMessage('❌ Estudiante no encontrado');
            }
        } else {
            showErrorMessage('❌ Error al buscar estudiante');
        }
        
    } catch (error) {
        console.error('Error al buscar estudiante:', error);
        showErrorMessage('❌ Error al buscar: ' + error.message);
    }
};

// Función para cargar datos del estudiante en el formulario
function cargarDatosEstudiante(estudiante) {
    // Datos básicos
    document.getElementById('cedula').value = estudiante.Cédula || '';
    document.getElementById('nombre').value = estudiante.Nombre || '';
    document.getElementById('grado').value = estudiante.Grado || '';
    document.getElementById('seccion').value = estudiante.Sección || '';
    
    // Funcionamiento Académico
    if (estudiante.funcionamientoAcademico) {
        document.querySelector('[name="logros_espanol"]').value = estudiante.funcionamientoAcademico.logros_espanol || '';
        document.querySelector('[name="nivel_espanol"]').value = estudiante.funcionamientoAcademico.nivel_espanol || '';
        document.querySelector('[name="docente_espanol"]').value = estudiante.funcionamientoAcademico.docente_espanol || '';
        document.querySelector('[name="logros_matematicas"]').value = estudiante.funcionamientoAcademico.logros_matematicas || '';
        document.querySelector('[name="nivel_matematicas"]').value = estudiante.funcionamientoAcademico.nivel_matematicas || '';
        document.querySelector('[name="docente_matematicas"]').value = estudiante.funcionamientoAcademico.docente_matematicas || '';
        document.querySelector('[name="logros_ciencias"]').value = estudiante.funcionamientoAcademico.logros_ciencias || '';
        document.querySelector('[name="nivel_ciencias"]').value = estudiante.funcionamientoAcademico.nivel_ciencias || '';
        document.querySelector('[name="docente_ciencias"]').value = estudiante.funcionamientoAcademico.docente_ciencias || '';
        document.querySelector('[name="logros_estudios_sociales"]').value = estudiante.funcionamientoAcademico.logros_estudios_sociales || '';
        document.querySelector('[name="nivel_estudios_sociales"]').value = estudiante.funcionamientoAcademico.nivel_estudios_sociales || '';
        document.querySelector('[name="docente_estudios_sociales"]').value = estudiante.funcionamientoAcademico.docente_estudios_sociales || '';
        document.querySelector('[name="logros_otras"]').value = estudiante.funcionamientoAcademico.logros_otras || '';
        document.querySelector('[name="nivel_otras"]').value = estudiante.funcionamientoAcademico.nivel_otras || '';
        document.querySelector('[name="docente_otras"]').value = estudiante.funcionamientoAcademico.docente_otras || '';
    }
    
    // Desarrollo Vocacional
    if (estudiante.desarrolloVocacional) {
        document.getElementById('intereses_habilidades').value = estudiante.desarrolloVocacional.intereses_habilidades || '';
        document.getElementById('expectativas_vocacionales').value = estudiante.desarrolloVocacional.expectativas_vocacionales || '';
        document.getElementById('observaciones_generales').value = estudiante.desarrolloVocacional.observaciones_generales || '';
    }
    
    // Docente Evaluador
    if (estudiante.docente) {
        document.getElementById('nombreDocenteEvaluador').value = estudiante.docente.nombre || '';
        document.getElementById('cedulaDocenteEvaluador').value = estudiante.docente.cedula || '';
        document.getElementById('fechaEvaluacion').value = estudiante.docente.fechaEvaluacion || '';
    }
    
    // Mostrar información del estudiante
    mostrarInfoEstudiante();
}

// Función para guardar estudiante simple (prueba)
window.guardarEstudianteSimple = async function() {
    try {
        showLoadingMessage();
        
        // Datos mínimos para probar
        const data = {
            cedula: '999999999',
            nombre: 'Estudiante Prueba Simple',
            grado: '11°',
            seccion: 'A',
            funcionamientoAcademico: '{"logros_espanol":"Prueba simple","nivel_espanol":"Bueno"}',
            desarrolloVocacional: '{"intereses_habilidades":"Prueba simple"}',
            docente: '{"nombre":"Docente Prueba","cedula":"111111111"}',
            fechaRegistro: new Date().toLocaleString('es-CR'),
            tipo: 'estudiante'
        };
        
        console.log('Enviando datos simples:', data);
        
        // Crear parámetros
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            params.append(key, data[key]);
        });
        
        // Enviar
        const scriptUrl = getScriptUrl();
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: params
        });
        
        showSuccessMessage('✅ ¡Prueba simple enviada!');
        
        // Actualizar lista
        setTimeout(async () => {
            await cargarListaEstudiantes();
        }, 2000);
        
    } catch (error) {
        console.error('Error en prueba simple:', error);
        showErrorMessage('❌ Error en prueba: ' + error.message);
    }
};

// Función para probar el guardado de estudiantes
window.testSaveStudent = async function() {
    try {
        const testData = {
            cedula: '999999999',
            nombre: 'Estudiante de Prueba',
            grado: '11°',
            seccion: 'A',
            funcionamientoAcademico: {
                logros_espanol: 'Prueba de logros en español',
                nivel_espanol: 'Bueno',
                docente_espanol: 'Docente de Prueba',
                logros_matematicas: 'Prueba de logros en matemáticas',
                nivel_matematicas: 'Muy Bueno',
                docente_matematicas: 'Docente de Prueba'
            },
            desarrolloVocacional: {
                intereses_habilidades: 'Intereses de prueba',
                expectativas_vocacionales: 'Expectativas de prueba',
                observaciones_generales: 'Observaciones de prueba'
            },
            docente: {
                nombre: 'Docente Evaluador de Prueba',
                cedula: '111111111',
                fechaEvaluacion: new Date().toISOString().split('T')[0]
            },
            fechaRegistro: new Date().toLocaleString('es-CR'),
            tipo: 'estudiante'
        };

        showLoadingMessage();
        
        await saveStudentToGoogleSheets(testData);
        
    } catch (error) {
        console.error('Error en prueba de guardado:', error);
        showErrorMessage('❌ Error en prueba: ' + error.message);
    }
};

// Función para llenar docentes individuales por materia
window.fillTeacherForSubject = function(subject) {
    const nombreEvaluador = document.getElementById('nombreDocenteEvaluador').value.trim();
    
    if (!nombreEvaluador) {
        showErrorMessage('Por favor ingrese primero el nombre del docente evaluador');
        return;
    }
    
    // Llenar solo el docente de la materia específica
    document.querySelector(`[name="docente_${subject}"]`).value = nombreEvaluador;
};

// Función para guardar información del estudiante
async function saveStudentToGoogleSheets(data) {
    try {
        console.log('Datos a guardar:', data);
        
        // Crear URL con parámetros
        const scriptUrl = getScriptUrl();
        const params = new URLSearchParams();
        
        // Agregar datos como parámetros
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                params.append(key, JSON.stringify(data[key]));
            } else {
                params.append(key, data[key]);
            }
        });
        
        console.log('URL:', scriptUrl);
        console.log('Parámetros:', params.toString());
        
        // Intentar con fetch normal primero
        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });
            
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            
            if (result.success) {
                showSuccessMessage('✅ Información guardada exitosamente');
                setTimeout(async () => {
                    await loadAllStudents();
                }, 1000);
                return true;
            } else {
                throw new Error(result.error || 'Error al guardar');
            }
            
        } catch (corsError) {
            console.log('Error CORS, intentando con no-cors:', corsError);
            
            // Fallback con no-cors
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: params
            });
            
            // Con no-cors no podemos leer la respuesta
            showSuccessMessage('✅ Información enviada (verificando...)');
            setTimeout(async () => {
                await loadAllStudents();
            }, 2000);
            
            return true;
        }
        
    } catch (error) {
        console.error('Error al guardar en Google Sheets:', error);
        showErrorMessage('❌ Error al guardar: ' + error.message);
        throw error;
    }
}

// Función para cargar todos los estudiantes
async function loadAllStudents() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(getScriptUrl() + '?action=getAllStudents&t=' + timestamp, {
            method: 'GET',
            mode: 'cors'
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayStudents(result.data);
        } else {
            // Solo mostrar el error si hay un mensaje real
            if (result.error && result.error !== 'undefined' && result.error !== '') {
                showErrorMessage('Error al cargar estudiantes: ' + result.error);
            }
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        // Solo mostrar el error si el usuario interactuó (no al inicio)
        if (window.__userInteracted) {
            showErrorMessage('Error de conexión al cargar estudiantes');
        }
    }
}

// Función para mostrar estudiantes
function displayStudents(students) {
    const studentsList = document.getElementById('studentsList');
    
    if (!students || students.length === 0) {
        studentsList.innerHTML = `
            <div class="no-students">
                <i class="fas fa-user-graduate"></i>
                <p>No hay estudiantes registrados aún</p>
            </div>
        `;
        return;
    }
    
    studentsList.innerHTML = students.map(student => {
        // Compatibilidad de claves
        const cedula = student.cedula || student.Cédula || '';
        const nombre = student.nombre || student.Nombre || 'Sin nombre';
        const grado = student.grado || student.Grado || 'No especificado';
        const seccion = student.seccion || student.Sección || 'No especificada';
        const docente = (student.docente && (student.docente.nombre || student.docente.Nombre)) || student['Docente Evaluador'] || 'No especificado';
        const fecha = (student.docente && (student.docente.fechaEvaluacion || student.docente.FechaEvaluacion)) || student['Fecha Evaluación'] || 'No especificada';
        return `
        <div class="student-card">
            <div class="student-header">
                <h4 class="student-name">${nombre}</h4>
                <span class="student-cedula">Cédula: ${cedula}</span>
            </div>
            <div class="student-info">
                <div class="student-info-item">
                    <span class="student-info-label">Grado:</span>
                    <span class="student-info-value">${grado}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Sección:</span>
                    <span class="student-info-value">${seccion}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Docente:</span>
                    <span class="student-info-value">${docente}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Fecha:</span>
                    <span class="student-info-value">${fecha}</span>
                </div>
            </div>
            <div class="student-actions">
                <button type="button" class="btn-view" onclick="viewStudent('${cedula}')">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <button type="button" class="btn-edit" onclick="editStudent('${cedula}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>`;
    }).join('');
}

// Función para ver detalles del estudiante
function viewStudent(cedula) {
    // Buscar y mostrar estudiante
    document.getElementById('cedulaEstudiante').value = cedula;
    buscarEstudiante();
}

// Función para editar estudiante
function editStudent(cedula) {
    // Buscar y mostrar estudiante para edición
    document.getElementById('cedulaEstudiante').value = cedula;
    buscarEstudiante();
}

// Función para exportar estudiantes a CSV
async function exportStudentsToCSV() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(getScriptUrl() + '?action=getAllStudents&t=' + timestamp, {
            method: 'GET',
            mode: 'cors'
        });
        
        const result = await response.json();
        
        if (result.success) {
            exportToCSV(result.data, 'estudiantes_anexo7');
        } else {
            showErrorMessage('Error al exportar: ' + result.error);
        }
        
    } catch (error) {
        console.error('Error al exportar:', error);
        showErrorMessage('Error al exportar datos');
    }
}

// Función para imprimir formulario del estudiante
function printStudentForm() {
    const printContent = document.getElementById('studentForm').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>ANEXO 7 - Estudiante</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .form-section { margin-bottom: 30px; }
                    .academic-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .academic-table th, .academic-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .academic-table th { background-color: #f2f2f2; }
                    textarea { width: 100%; min-height: 60px; }
                </style>
            </head>
            <body>
                <h1>ANEXO 7 - Funcionamiento Académico y Desarrollo Vocacional</h1>
                <h2>Colegio Técnico Profesional Sabalito - 2025</h2>
                ${printContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Función para imprimir todos los estudiantes
function printAllStudents() {
    const studentsList = document.getElementById('studentsList').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>ANEXO 7 - Todos los Estudiantes</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .student-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
                    .student-header { border-bottom: 1px solid #eee; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>ANEXO 7 - Información de Todos los Estudiantes</h1>
                <h2>Colegio Técnico Profesional Sabalito - 2025</h2>
                ${studentsList}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Función para guardar formulario (llamada desde el botón)
window.guardarEstudiante = async function() {
    try {
        showLoadingMessage();
        
        const cedula = document.getElementById('cedula').value || '';
        
        // Validar que la cédula no esté vacía
        if (!cedula) {
            showErrorMessage('❌ La cédula es obligatoria');
            return;
        }
        
        // Verificar si ya existe un estudiante con esta cédula
        console.log('Verificando cédula duplicada:', cedula);
    const scriptUrl = getScriptUrl();
        
        try {
            const existingStudent = await cargarDatosConFetch(`${scriptUrl}?action=getStudent&cedula=${cedula}`);
            
            if (existingStudent.success && existingStudent.data) {
                // Si existe, preguntar si quiere editarlo
                const confirmEdit = confirm(`Ya existe un estudiante con la cédula ${cedula}. ¿Desea actualizar la información existente?`);
                if (!confirmEdit) {
                    showErrorMessage('❌ Operación cancelada');
                    return;
                }
                console.log('Editando estudiante existente');
            } else {
                console.log('Creando nuevo estudiante');
            }
        } catch (error) {
            console.log('Error al verificar cédula, continuando con guardado:', error);
        }
        
        // Recopilar todos los datos del formulario - ENVIAR COMO CAMPOS INDIVIDUALES
        const data = {
            cedula: cedula,
            nombre: document.getElementById('nombre').value || '',
            grado: document.getElementById('grado').value || '',
            seccion: document.getElementById('seccion').value || '',
            // Funcionamiento Académico - campos individuales
            logros_espanol: (document.querySelector('[name="logros_espanol"]') ? document.querySelector('[name="logros_espanol"]').value : ''),
            nivel_espanol: (document.querySelector('[name="nivel_espanol"]') ? document.querySelector('[name="nivel_espanol"]').value : ''),
            docente_espanol: (document.querySelector('[name="docente_espanol"]') ? document.querySelector('[name="docente_espanol"]').value : ''),
            logros_matematicas: (document.querySelector('[name="logros_matematicas"]') ? document.querySelector('[name="logros_matematicas"]').value : ''),
            nivel_matematicas: (document.querySelector('[name="nivel_matematicas"]') ? document.querySelector('[name="nivel_matematicas"]').value : ''),
            docente_matematicas: (document.querySelector('[name="docente_matematicas"]') ? document.querySelector('[name="docente_matematicas"]').value : ''),
            logros_ciencias: (document.querySelector('[name="logros_ciencias"]') ? document.querySelector('[name="logros_ciencias"]').value : ''),
            nivel_ciencias: (document.querySelector('[name="nivel_ciencias"]') ? document.querySelector('[name="nivel_ciencias"]').value : ''),
            docente_ciencias: (document.querySelector('[name="docente_ciencias"]') ? document.querySelector('[name="docente_ciencias"]').value : ''),
            logros_estudios_sociales: (document.querySelector('[name="logros_estudios_sociales"]') ? document.querySelector('[name="logros_estudios_sociales"]').value : ''),
            nivel_estudios_sociales: (document.querySelector('[name="nivel_estudios_sociales"]') ? document.querySelector('[name="nivel_estudios_sociales"]').value : ''),
            docente_estudios_sociales: (document.querySelector('[name="docente_estudios_sociales"]') ? document.querySelector('[name="docente_estudios_sociales"]').value : ''),
            logros_otras: (document.querySelector('[name="logros_otras"]') ? document.querySelector('[name="logros_otras"]').value : ''),
            nivel_otras: (document.querySelector('[name="nivel_otras"]') ? document.querySelector('[name="nivel_otras"]').value : ''),
            docente_otras: (document.querySelector('[name="docente_otras"]') ? document.querySelector('[name="docente_otras"]').value : ''),
            // Desarrollo Vocacional - campos individuales
            intereses_habilidades: (document.getElementById('intereses_habilidades') ? document.getElementById('intereses_habilidades').value : ''),
            expectativas_vocacionales: (document.getElementById('expectativas_vocacionales') ? document.getElementById('expectativas_vocacionales').value : ''),
            observaciones_generales: (document.getElementById('observaciones_generales') ? document.getElementById('observaciones_generales').value : ''),
            // Docente Evaluador - campos individuales
            nombreDocenteEvaluador: (document.getElementById('nombreDocenteEvaluador') ? document.getElementById('nombreDocenteEvaluador').value : ''),
            cedulaDocenteEvaluador: (document.getElementById('cedulaDocenteEvaluador') ? document.getElementById('cedulaDocenteEvaluador').value : ''),
            fechaEvaluacion: (document.getElementById('fechaEvaluacion') ? document.getElementById('fechaEvaluacion').value : new Date().toISOString().split('T')[0]),
            // Metadatos
            fechaRegistro: new Date().toLocaleString('es-CR'),
            tipo: 'estudiante'
        };
        
        console.log('=== ENVIANDO DATOS AL SERVIDOR ===');
        console.log('Datos a enviar:', data);
        console.log('Claves de datos:', Object.keys(data));
        console.log('Valores de datos:', Object.values(data));
        
        // Crear parámetros
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            params.append(key, data[key]);
        });
        
        // Enviar usando proxy CORS
        console.log('Enviando datos:', data);
        
        // Crear URL con parámetros GET (más compatible con proxy)
        const urlParams = new URLSearchParams();
        urlParams.append('action', 'saveStudent');
        Object.keys(data).forEach(key => {
            urlParams.append(key, data[key]);
        });
        
        const finalUrl = `${scriptUrl}?${urlParams.toString()}`;
        console.log('URL final:', finalUrl);
        console.log('Parámetros URL:', urlParams.toString());
        
        // Usar proxy CORS para enviar datos
        console.log('Enviando datos al servidor...');
        
        // Intentar primero con GET (más confiable con proxy CORS)
        let result;
        try {
            result = await cargarDatosConFetch(finalUrl);
            console.log('Respuesta del servidor (GET):', result);
        } catch (getError) {
            console.log('Error con GET, intentando POST:', getError);
            result = await enviarDatosConFetch(scriptUrl, data);
            console.log('Respuesta del servidor (POST):', result);
        }
        
        if (result && result.success) {
            const action = result.action || 'guardado';
            const message = result.message || 'Estudiante guardado exitosamente';
            
            if (action === 'updated') {
                showSuccessMessage('✅ ¡Estudiante actualizado exitosamente!');
            } else if (action === 'created') {
                showSuccessMessage('✅ ¡Nuevo estudiante creado exitosamente!');
            } else {
                showSuccessMessage('✅ ' + message);
            }
        } else {
            const errorMsg = result?.error || 'Error desconocido del servidor';
            console.error('Error del servidor:', errorMsg);
            showErrorMessage('❌ Error al guardar: ' + errorMsg);
            return;
        }
        
        // Actualizar lista
        setTimeout(async () => {
            await cargarListaEstudiantes();
        }, 2000);
        
        // Limpiar formulario COMPLETAMENTE
        limpiarFormularioCompleto();
        document.getElementById('studentInfo').style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('❌ Error: ' + error.message);
    }
};

// Manejar envío del formulario (mantener para compatibilidad)
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarEstudiante();
});

// Función para cargar la lista de estudiantes en el select
window.cargarListaEstudiantes = async function() {
    try {
        showLoadingMessage();
        
        // FORZAR LA URL CORRECTA (JSONP) para evitar problemas de caché
    const scriptUrl = getScriptUrl();
        console.log('=== CARGANDO LISTA DE ESTUDIANTES ===');
        console.log('URL del script (FORZADA):', scriptUrl);
    console.log('Deployment activo correcto');
        console.log('¿URL correcta?', scriptUrl.includes('AKfycbyFlfX1y9mOc_ibycu5AxhKJuak9hPFsoDDQjCtEG3K77JU8Qhr3oIqO4OAFpVjpQxBwA'));
        
        // Usar petición directa al Google Apps Script
        const timestamp = new Date().getTime();
        const result = await cargarDatosDirecto(`${scriptUrl}?action=getAllStudents&t=${timestamp}`);
        console.log('=== DIAGNÓSTICO COMPLETO DE RESPUESTA ===');
        console.log('Datos recibidos del servidor:', result);
        console.log('Tipo de datos:', typeof result);
        console.log('¿Es array?', Array.isArray(result));
        console.log('¿Tiene propiedad data?', result && result.data !== undefined);
        console.log('¿Tiene propiedad success?', result && result.success !== undefined);
        console.log('Claves del objeto:', result ? Object.keys(result) : 'No es objeto');
        console.log('==========================================');
        
        // Procesar datos directamente - asumir que siempre hay datos
        let estudiantes = [];
        
        // Intentar diferentes formatos de respuesta
        if (Array.isArray(result)) {
            estudiantes = result;
            console.log('Datos recibidos como array directo');
        } else if (result && result.data && Array.isArray(result.data)) {
            estudiantes = result.data;
            console.log('Datos recibidos con estructura {data}');
        } else if (result && result.success && result.data && Array.isArray(result.data)) {
            estudiantes = result.data;
            console.log('Datos recibidos con estructura {success, data}');
        }
        
        console.log('Estudiantes extraídos:', estudiantes);
        console.log('Cantidad de estudiantes:', estudiantes ? estudiantes.length : 'undefined');
        
        // Si no hay estudiantes, mostrar error
        if (!estudiantes || estudiantes.length === 0) {
            console.log('No se encontraron estudiantes en el servidor');
            console.log('Result completo:', result);
            showErrorMessage('❌ No se encontraron estudiantes en la base de datos');
            return;
        }
        
        console.log('Estudiantes a procesar:', estudiantes);
        
        // Procesar la lista
        const select = document.getElementById('listaEstudiantes');
        if (!select) {
            console.error('Elemento listaEstudiantes no encontrado');
            showErrorMessage('❌ Error: Elemento de lista no encontrado');
            return;
        }
        
        select.innerHTML = '<option value="">-- Seleccionar un estudiante --</option>';
        
        estudiantes.forEach((estudiante, index) => {
            const option = document.createElement('option');
            
            // Obtener datos del estudiante
            const cedula = estudiante.Cédula || estudiante.cedula || '';
            const nombre = estudiante.Nombre || estudiante.nombre || 'Sin nombre';
            const seccion = estudiante.Sección || estudiante.seccion || '';
            
            option.value = cedula;
            option.textContent = `${nombre} - ${seccion}`;
            
            select.appendChild(option);
        });
        
        console.log('Lista actualizada exitosamente');
        showSuccessMessage(`✅ Lista actualizada: ${estudiantes.length} estudiantes encontrados`);
    } catch (error) {
        console.error('Error al cargar lista de estudiantes:', error);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        // Manejar diferentes tipos de errores
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showErrorMessage('❌ Error de conexión: No se puede conectar al servidor. Verifica la URL del script.');
        } else if (error.name === 'SyntaxError') {
            showErrorMessage('❌ Error de datos: El servidor devolvió datos inválidos.');
        } else {
            showErrorMessage('❌ Error de conexión al cargar estudiantes: ' + error.message);
        }
    }
};

// Función para cargar estudiante seleccionado
window.cargarEstudianteSeleccionado = async function() {
    const select = document.getElementById('listaEstudiantes');
    const cedula = select.value;
    
    console.log('=== CARGAR ESTUDIANTE SELECCIONADO ===');
    console.log('Cédula seleccionada:', cedula);
    console.log('Tipo de cédula:', typeof cedula);
    console.log('¿Es válida?', cedula && cedula !== '' && cedula !== 'undefined');
    
    if (!cedula || cedula === '' || cedula === 'undefined' || cedula === '-- Seleccionar un estudiante --') {
        console.log('❌ Cédula no válida, cancelando carga');
        return;
    }
    
    try {
        showLoadingMessage();
        
        // FORZAR LA URL CORRECTA (JSONP) para evitar problemas de caché
        const scriptUrl = getScriptUrl();
        const timestamp = new Date().getTime();
        console.log('Buscando estudiante con cédula:', cedula);
        console.log('URL de búsqueda:', `${scriptUrl}?action=getStudent&cedula=${cedula}&t=${timestamp}`);
        
        // Usar petición directa para cargar estudiante con timestamp para evitar caché
        const result = await cargarDatosDirecto(`${scriptUrl}?action=getStudent&cedula=${cedula}&t=${timestamp}`);
        console.log('Respuesta de búsqueda:', result);
        
        if (result.success && result.data) {
            console.log('Datos del estudiante recibidos:', result.data);
            llenarFormularioEstudiante(result.data);
            document.getElementById('studentForm').style.display = 'block';
            mostrarInfoEstudiante(result.data);
            showSuccessMessage('✅ Estudiante cargado correctamente');
        } else {
            console.log('No se encontraron datos del estudiante:', result);
            showErrorMessage('❌ No se pudo cargar la información del estudiante');
        }
    } catch (error) {
        console.error('Error al cargar estudiante:', error);
        showErrorMessage('❌ Error de conexión al cargar estudiante: ' + error.message);
    }
};

// Función para probar la conexión y verificar datos
window.probarConexionCompleta = async function() {
    try {
        showLoadingMessage();
        
        // FORZAR LA URL CORRECTA (JSONP) para evitar problemas de caché
    const scriptUrl = getScriptUrl();
        console.log('=== PRUEBA DE CONEXIÓN COMPLETA ===');
        console.log('URL del script (FORZADA):', scriptUrl);
        
        // Probar obtener todos los estudiantes
        console.log('1. Probando obtener todos los estudiantes...');
        const timestamp = new Date().getTime();
        const response = await fetch(`${scriptUrl}?action=getAllStudents&t=${timestamp}`);
        
        if (response.ok) {
            const result = await response.json();
            console.log('2. Respuesta obtenida:', result);
            
            if (result.success && result.data) {
                console.log('3. Estudiantes encontrados:', result.data.length);
                console.log('4. Primer estudiante:', result.data[0]);
                
                if (result.data.length > 0) {
                    showSuccessMessage(`✅ Conexión exitosa: ${result.data.length} estudiantes encontrados`);
                } else {
                    showErrorMessage('⚠️ Conexión exitosa pero no hay estudiantes en la base de datos');
                }
            } else {
                console.log('3. No se encontraron datos:', result);
                showErrorMessage('❌ No se encontraron estudiantes en la base de datos');
            }
        } else {
            console.error('Error en la respuesta:', response.status);
            showErrorMessage('❌ Error de conexión con el servidor');
        }
    } catch (error) {
        console.error('Error en la prueba:', error);
        showErrorMessage('❌ Error de conexión: ' + error.message);
    }
};

// Función para enviar datos usando fetch con CORS proxy
async function enviarDatosConFetch(scriptUrl, data) {
    try {
        // Crear parámetros para POST
        const params = new URLSearchParams();
        params.append('action', 'saveStudent');
        Object.keys(data).forEach(key => {
            params.append(key, data[key]);
        });
        
        // Usar un proxy CORS público para POST
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(scriptUrl);
        
        console.log('Enviando POST a:', proxyUrl);
        console.log('Datos POST:', params.toString());
        
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: params.toString()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error enviando datos:', error);
        
        // Fallback: intentar con GET
        try {
            console.log('Fallback: intentando con GET...');
            const urlParams = new URLSearchParams();
            urlParams.append('action', 'saveStudent');
            Object.keys(data).forEach(key => {
                urlParams.append(key, data[key]);
            });
            
            const getUrl = `${scriptUrl}?${urlParams.toString()}`;
            return await cargarDatosConFetch(getUrl);
            
        } catch (fallbackError) {
            console.error('Error en fallback GET:', fallbackError);
            throw new Error(`Error de conexión: ${error.message}. Verifica la URL del script y tu conexión a internet.`);
        }
    }
}

// Función para cargar datos directamente del Google Apps Script
async function cargarDatosDirecto(url) {
    try {
        console.log('=== CARGANDO DATOS DIRECTO ===');
        console.log('URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        console.log('Respuesta recibida:', response);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos cargados directamente:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Error en carga directa:', error);
        console.log('Tipo de error:', error.name);
        console.log('Mensaje de error:', error.message);
        
        // Fallback: intentar con proxy CORS
        console.log('Intentando con proxy CORS como fallback...');
        return await cargarDatosConFetch(url);
    }
}

// Función para cargar datos usando fetch con proxy CORS
async function cargarDatosConFetch(url) {
    try {
        // Usar un proxy CORS público
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
        
        console.log('Usando proxy CORS:', proxyUrl);
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('=== RESPUESTA DEL PROXY CORS ===');
        console.log('Datos del proxy:', data);
        console.log('Tipo de datos:', typeof data);
        console.log('¿Es string?', typeof data === 'string');
        console.log('¿Es objeto?', typeof data === 'object');
        console.log('===============================');
        
        // Si el proxy devuelve un string, intentar parsearlo como JSON
        if (typeof data === 'string') {
            try {
                const parsedData = JSON.parse(data);
                console.log('Datos parseados desde string:', parsedData);
                return parsedData;
            } catch (parseError) {
                console.error('Error parseando string como JSON:', parseError);
                return data;
            }
        }
        
        return data;
        
    } catch (error) {
        console.error('Error con proxy CORS:', error);
        console.log('Tipo de error:', error.name);
        console.log('Mensaje de error:', error.message);
        
        // Fallback 1: intentar con proxy alternativo
        try {
            console.log('Intentando con proxy alternativo...');
            const altProxyUrl = 'https://cors-anywhere.herokuapp.com/' + url;
            const response = await fetch(altProxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Proxy alternativo funcionó:', data);
            return data;
            
        } catch (altError) {
            console.error('Error con proxy alternativo:', altError);
            
            // Fallback 2: intentar directamente (puede fallar por CORS)
            try {
                console.log('Intentando conexión directa...');
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                // Con no-cors no podemos leer la respuesta, pero podemos intentar
                throw new Error('Conexión directa no disponible');
                
            } catch (directError) {
                console.error('Error en conexión directa:', directError);
                throw new Error(`Error de conexión: ${error.message}. Verifica la URL del script y tu conexión a internet.`);
            }
        }
    }
}

// Función para cargar datos usando JSONP (evita problemas de CORS)
function cargarDatosConJSONP(url) {
    return new Promise((resolve, reject) => {
        // Crear un callback único
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        
        // Crear el script tag
        const script = document.createElement('script');
        script.src = url + '&callback=' + callbackName;
        
        // Definir la función callback global
        window[callbackName] = function(data) {
            // Limpiar
            document.head.removeChild(script);
            delete window[callbackName];
            
            // Resolver la promesa
            resolve(data);
        };
        
        // Manejar errores
        script.onerror = function() {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('Error al cargar datos con JSONP'));
        };
        
        // Agregar el script al head
        document.head.appendChild(script);
        
        // Timeout de 10 segundos
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('Timeout al cargar datos'));
            }
        }, 10000);
    });
}

// Ocultar info estudiante si existe el elemento
var studentInfo = document.getElementById('studentInfo');
if (studentInfo) studentInfo.style.display = 'none';

// Agregar listener a la lista de estudiantes
const listaEstudiantes = document.getElementById('listaEstudiantes');
if (listaEstudiantes) {
    listaEstudiantes.addEventListener('change', function() {
        const cedula = this.value;
        if (cedula) {
            // Buscar y mostrar estudiante
            document.getElementById('cedulaEstudiante').value = cedula;
            buscarEstudiante();
        } else {
            // Limpiar formulario si no hay cédula
            limpiarFormularioCompleto();
        }
    });
}

// Configurar fecha actual solo si el campo existe
const today = new Date().toISOString().split('T')[0];
var fechaInput = document.getElementById('fechaEvaluacion');
if (fechaInput) fechaInput.value = today;

// Actualizar lista de estudiantes SIEMPRE al abrir o recargar
if (typeof loadAllStudents === 'function') {
    loadAllStudents();
}

// Cargar lista de estudiantes en el select (si existe)
if (typeof cargarListaEstudiantes === 'function') {
    cargarListaEstudiantes();
}

// Registrar interacción del usuario
window.__userInteracted = false;
document.addEventListener('click', function() { window.__userInteracted = true; });
document.addEventListener('change', function() { window.__userInteracted = true; });
