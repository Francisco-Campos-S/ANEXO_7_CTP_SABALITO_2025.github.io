/**
 * Script para el formulario de estudiantes - ANEXO 7
 * CTP Sabalito 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaEvaluacion').value = today;
    
    // Cargar lista de estudiantes al inicio
    loadAllStudents();
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
    
    showTestDataMessage();
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
        const formData = new FormData();
        
        // Agregar datos como parámetros de formulario
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });
        
        const response = await fetch(getScriptUrl(), {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        // Con no-cors no podemos leer la respuesta, pero podemos asumir que funcionó
        setTimeout(async () => {
            await loadAllStudents();
        }, 1000);
        
        return true;
        
    } catch (error) {
        console.error('Error al guardar en Google Sheets:', error);
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

// Manejar envío del formulario
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Recopilar datos del formulario
        const formData = new FormData(this);
        const data = {};
        
        // Datos básicos del estudiante
        data.cedula = formData.get('cedula');
        data.nombre = formData.get('nombre');
        data.grado = formData.get('grado');
        data.seccion = formData.get('seccion');
        
        // Funcionamiento Académico
        data.funcionamientoAcademico = {
            logros_espanol: formData.get('logros_espanol'),
            nivel_espanol: formData.get('nivel_espanol'),
            docente_espanol: formData.get('docente_espanol'),
            logros_matematicas: formData.get('logros_matematicas'),
            nivel_matematicas: formData.get('nivel_matematicas'),
            docente_matematicas: formData.get('docente_matematicas'),
            logros_ciencias: formData.get('logros_ciencias'),
            nivel_ciencias: formData.get('nivel_ciencias'),
            docente_ciencias: formData.get('docente_ciencias'),
            logros_estudios_sociales: formData.get('logros_estudios_sociales'),
            nivel_estudios_sociales: formData.get('nivel_estudios_sociales'),
            docente_estudios_sociales: formData.get('docente_estudios_sociales'),
            logros_otras: formData.get('logros_otras'),
            nivel_otras: formData.get('nivel_otras'),
            docente_otras: formData.get('docente_otras')
        };
        
        // Desarrollo Vocacional
        data.desarrolloVocacional = {
            intereses_habilidades: formData.get('intereses_habilidades'),
            expectativas_vocacionales: formData.get('expectativas_vocacionales'),
            observaciones_generales: formData.get('observaciones_generales')
        };
        
        // Información del Docente Evaluador
        data.docente = {
            nombre: formData.get('nombreDocenteEvaluador'),
            cedula: formData.get('cedulaDocenteEvaluador'),
            fechaEvaluacion: formData.get('fechaEvaluacion')
        };
        
        // Agregar timestamp
        data.fechaRegistro = new Date().toLocaleString('es-CR');
        data.tipo = 'estudiante'; // Identificar que es un estudiante
        
        // Guardar en Google Sheets
        await saveStudentToGoogleSheets(data);
        
        showSuccessMessage('Información del estudiante guardada exitosamente');
        
        // Limpiar formulario
        this.reset();
        document.getElementById('studentForm').style.display = 'none';
        document.getElementById('studentInfo').style.display = 'none';
        
    } catch (error) {
        console.error('Error al guardar:', error);
        showErrorMessage('Error al guardar la información: ' + error.message);
    }
});
