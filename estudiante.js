/**
 * Script para el formulario de estudiantes - ANEXO 7
 * CTP Sabalito 2025
 */

// Función para obtener la URL del script
function getScriptUrl() {
    return 'https://script.google.com/macros/s/AKfycbxAhDehIJjEtCZvVprQj8ebTLRYAxxfOGsBGZDbHPFzcDj6gmWRu-bE27KelT5C-on7nQ/exec';
}

document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaEvaluacion').value = today;
    
    // Cargar lista de estudiantes al inicio
    loadAllStudents();
    
    // Cargar lista de estudiantes en el select
    cargarListaEstudiantes();
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
        showErrorMessage('Error al buscar estudiante: ' + error.message);
    }
}

// Función para llenar formulario con datos del estudiante
function llenarFormularioEstudiante(estudiante) {
    document.getElementById('cedula').value = estudiante.cedula || '';
    document.getElementById('nombre').value = estudiante.nombre || '';
    document.getElementById('grado').value = estudiante.grado || '';
    document.getElementById('seccion').value = estudiante.seccion || '';
    
    // Llenar datos académicos si existen
    if (estudiante.funcionamientoAcademico) {
        const academic = estudiante.funcionamientoAcademico;
        
        // Español
        document.querySelector('[name="logros_espanol"]').value = academic.logros_espanol || '';
        document.querySelector('[name="nivel_espanol"]').value = academic.nivel_espanol || '';
        document.querySelector('[name="docente_espanol"]').value = academic.docente_espanol || '';
        
        // Matemáticas
        document.querySelector('[name="logros_matematicas"]').value = academic.logros_matematicas || '';
        document.querySelector('[name="nivel_matematicas"]').value = academic.nivel_matematicas || '';
        document.querySelector('[name="docente_matematicas"]').value = academic.docente_matematicas || '';
        
        // Ciencias
        document.querySelector('[name="logros_ciencias"]').value = academic.logros_ciencias || '';
        document.querySelector('[name="nivel_ciencias"]').value = academic.nivel_ciencias || '';
        document.querySelector('[name="docente_ciencias"]').value = academic.docente_ciencias || '';
        
        // Estudios Sociales
        document.querySelector('[name="logros_estudios_sociales"]').value = academic.logros_estudios_sociales || '';
        document.querySelector('[name="nivel_estudios_sociales"]').value = academic.nivel_estudios_sociales || '';
        document.querySelector('[name="docente_estudios_sociales"]').value = academic.docente_estudios_sociales || '';
        
        // Otras
        document.querySelector('[name="logros_otras"]').value = academic.logros_otras || '';
        document.querySelector('[name="nivel_otras"]').value = academic.nivel_otras || '';
        document.querySelector('[name="docente_otras"]').value = academic.docente_otras || '';
    }
    
    // Llenar datos vocacionales si existen
    if (estudiante.desarrolloVocacional) {
        const vocational = estudiante.desarrolloVocacional;
        document.getElementById('intereses_habilidades').value = vocational.intereses_habilidades || '';
        document.getElementById('expectativas_vocacionales').value = vocational.expectativas_vocacionales || '';
        document.getElementById('observaciones_generales').value = vocational.observaciones_generales || '';
    }
    
    // Llenar datos del docente evaluador si existen
    if (estudiante.docente) {
        document.getElementById('nombreDocenteEvaluador').value = estudiante.docente.nombre || '';
        document.getElementById('cedulaDocenteEvaluador').value = estudiante.docente.cedula || '';
        document.getElementById('fechaEvaluacion').value = estudiante.docente.fechaEvaluacion || new Date().toISOString().split('T')[0];
    }
}

// Función para crear nuevo estudiante
function crearNuevoEstudiante(cedula) {
    // Limpiar formulario
    document.getElementById('studentForm').reset();
    
    // Llenar cédula
    document.getElementById('cedula').value = cedula;
    document.getElementById('cedulaEstudiante').value = cedula;
    
    // Configurar fecha actual
    document.getElementById('fechaEvaluacion').value = new Date().toISOString().split('T')[0];
    
    // Mostrar información del estudiante
    mostrarInfoEstudiante({
        cedula: cedula,
        nombre: 'Nuevo Estudiante',
        grado: '',
        seccion: ''
    });
}

// Función para crear nuevo estudiante manualmente
window.crearNuevoEstudianteManual = function() {
    // Limpiar formulario
    document.getElementById('studentForm').reset();
    
    // Limpiar campos de búsqueda
    document.getElementById('cedulaEstudiante').value = '';
    
    // Configurar fecha actual
    document.getElementById('fechaEvaluacion').value = new Date().toISOString().split('T')[0];
    
    // Mostrar formulario
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('studentInfo').style.display = 'none';
    
    // Mostrar mensaje
    showSuccessMessage('Formulario listo para nuevo estudiante');
};

// Función para mostrar información del estudiante
function mostrarInfoEstudiante(estudiante) {
    const studentInfo = document.getElementById('studentInfo');
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
            await loadAllStudents();
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
        const response = await fetch(getScriptUrl() + '?action=getAllStudents', {
            method: 'GET',
            mode: 'cors'
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayStudents(result.data);
        } else {
            showErrorMessage('Error al cargar estudiantes: ' + result.error);
        }
        
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        showErrorMessage('Error de conexión al cargar estudiantes');
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
    
    studentsList.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-header">
                <h4 class="student-name">${student.nombre || 'Sin nombre'}</h4>
                <span class="student-cedula">Cédula: ${student.cedula}</span>
            </div>
            <div class="student-info">
                <div class="student-info-item">
                    <span class="student-info-label">Grado:</span>
                    <span class="student-info-value">${student.grado || 'No especificado'}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Sección:</span>
                    <span class="student-info-value">${student.seccion || 'No especificada'}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Docente:</span>
                    <span class="student-info-value">${student.docente?.nombre || 'No especificado'}</span>
                </div>
                <div class="student-info-item">
                    <span class="student-info-label">Fecha:</span>
                    <span class="student-info-value">${student.docente?.fechaEvaluacion || 'No especificada'}</span>
                </div>
            </div>
            <div class="student-actions">
                <button type="button" class="btn-view" onclick="viewStudent('${student.cedula}')">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <button type="button" class="btn-edit" onclick="editStudent('${student.cedula}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>
    `).join('');
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
        const response = await fetch(getScriptUrl() + '?action=getAllStudents', {
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
        
        // Recopilar todos los datos del formulario
        const data = {
            cedula: document.getElementById('cedula').value || '',
            nombre: document.getElementById('nombre').value || '',
            grado: document.getElementById('grado').value || '',
            seccion: document.getElementById('seccion').value || '',
            funcionamientoAcademico: JSON.stringify({
                logros_espanol: document.querySelector('[name="logros_espanol"]').value || '',
                nivel_espanol: document.querySelector('[name="nivel_espanol"]').value || '',
                docente_espanol: document.querySelector('[name="docente_espanol"]').value || '',
                logros_matematicas: document.querySelector('[name="logros_matematicas"]').value || '',
                nivel_matematicas: document.querySelector('[name="nivel_matematicas"]').value || '',
                docente_matematicas: document.querySelector('[name="docente_matematicas"]').value || '',
                logros_ciencias: document.querySelector('[name="logros_ciencias"]').value || '',
                nivel_ciencias: document.querySelector('[name="nivel_ciencias"]').value || '',
                docente_ciencias: document.querySelector('[name="docente_ciencias"]').value || '',
                logros_estudios_sociales: document.querySelector('[name="logros_estudios_sociales"]').value || '',
                nivel_estudios_sociales: document.querySelector('[name="nivel_estudios_sociales"]').value || '',
                docente_estudios_sociales: document.querySelector('[name="docente_estudios_sociales"]').value || '',
                logros_otras: document.querySelector('[name="logros_otras"]').value || '',
                nivel_otras: document.querySelector('[name="nivel_otras"]').value || '',
                docente_otras: document.querySelector('[name="docente_otras"]').value || ''
            }),
            desarrolloVocacional: JSON.stringify({
                intereses_habilidades: document.getElementById('intereses_habilidades').value || '',
                expectativas_vocacionales: document.getElementById('expectativas_vocacionales').value || '',
                observaciones_generales: document.getElementById('observaciones_generales').value || ''
            }),
            docente: JSON.stringify({
                nombre: document.getElementById('nombreDocenteEvaluador').value || '',
                cedula: document.getElementById('cedulaDocenteEvaluador').value || '',
                fechaEvaluacion: document.getElementById('fechaEvaluacion').value || new Date().toISOString().split('T')[0]
            }),
            fechaRegistro: new Date().toLocaleString('es-CR'),
            tipo: 'estudiante'
        };
        
        console.log('Datos a enviar:', data);
        
        // Crear parámetros
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            params.append(key, data[key]);
        });
        
        // Enviar con método simple
        const scriptUrl = getScriptUrl();
        console.log('Enviando a:', scriptUrl);
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: params
        });
        
        // Mostrar éxito
        showSuccessMessage('✅ ¡Estudiante guardado exitosamente!');
        
        // Actualizar lista
        setTimeout(async () => {
            await loadAllStudents();
        }, 2000);
        
        // Limpiar formulario
        document.getElementById('studentForm').reset();
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
        
        const scriptUrl = getScriptUrl();
        const response = await fetch(`${scriptUrl}?action=getAllStudents`);
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = document.getElementById('listaEstudiantes');
                select.innerHTML = '<option value="">-- Seleccionar un estudiante --</option>';
                
                result.data.forEach(estudiante => {
                    const option = document.createElement('option');
                    option.value = estudiante.Cédula || estudiante.cedula;
                    option.textContent = `${estudiante.Nombre || estudiante.nombre} - ${estudiante.Cédula || estudiante.cedula} (${estudiante.Grado || estudiante.grado}° ${estudiante.Sección || estudiante.seccion})`;
                    select.appendChild(option);
                });
                
                showSuccessMessage(`✅ Lista actualizada: ${result.data.length} estudiantes encontrados`);
            } else {
                showErrorMessage('❌ No se encontraron estudiantes');
            }
        } else {
            showErrorMessage('❌ Error al cargar la lista de estudiantes');
        }
    } catch (error) {
        console.error('Error al cargar lista de estudiantes:', error);
        showErrorMessage('❌ Error de conexión al cargar estudiantes');
    }
};

// Función para cargar estudiante seleccionado
window.cargarEstudianteSeleccionado = async function() {
    const select = document.getElementById('listaEstudiantes');
    const cedula = select.value;
    
    if (!cedula) {
        return;
    }
    
    try {
        showLoadingMessage();
        
        const scriptUrl = getScriptUrl();
        const response = await fetch(`${scriptUrl}?action=getStudent&cedula=${cedula}`);
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
                llenarFormularioEstudiante(result.data);
                document.getElementById('studentForm').style.display = 'block';
                mostrarInfoEstudiante(result.data);
                showSuccessMessage('✅ Estudiante cargado correctamente');
            } else {
                showErrorMessage('❌ No se pudo cargar la información del estudiante');
            }
        } else {
            showErrorMessage('❌ Error al cargar el estudiante');
        }
    } catch (error) {
        console.error('Error al cargar estudiante:', error);
        showErrorMessage('❌ Error de conexión al cargar estudiante');
    }
};
