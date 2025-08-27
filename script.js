// Sistema de Gestión Estudiantil - CTP Sabalito
// Funcionalidad para guardar y consultar información de estudiantes

// Variables globales
let students = [];
const STORAGE_KEY = 'ctp_sabalito_students';

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupEventListeners();
    showSection('form'); // Mostrar formulario por defecto
});

// Configurar event listeners
function setupEventListeners() {
    // Formulario de estudiantes
    const form = document.getElementById('student-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Modal
    const modal = document.getElementById('student-modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Búsqueda en tiempo real
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                showAllStudents();
            } else {
                searchStudents();
            }
        });
    }
}

// Navegación entre secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar botones de navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    const activeButton = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Si es la sección de búsqueda, cargar estudiantes
    if (sectionName === 'search') {
        showAllStudents();
    }
}

// Manejo del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const studentData = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        basicInfo: {
            name: formData.get('student-name'),
            studentId: formData.get('student-id'),
            grade: formData.get('grade'),
            year: formData.get('year'),
            requestingTeacher: formData.get('requesting-teacher'),
            legalGuardian: formData.get('legal-guardian')
        },
        academic: {
            espanol: {
                logros: formData.get('espanol-logros'),
                nivel: formData.get('espanol-nivel'),
                docente: formData.get('espanol-docente')
            },
            matematicas: {
                logros: formData.get('matematicas-logros'),
                nivel: formData.get('matematicas-nivel'),
                docente: formData.get('matematicas-docente')
            },
            ciencias: {
                logros: formData.get('ciencias-logros'),
                nivel: formData.get('ciencias-nivel'),
                docente: formData.get('ciencias-docente')
            },
            sociales: {
                logros: formData.get('sociales-logros'),
                nivel: formData.get('sociales-nivel'),
                docente: formData.get('sociales-docente')
            },
            otras: {
                asignatura: formData.get('otras-asignatura'),
                logros: formData.get('otras-logros'),
                nivel: formData.get('otras-nivel'),
                docente: formData.get('otras-docente')
            }
        },
        vocational: {
            deportivas: formData.get('deportivas'),
            creativas: formData.get('creativas'),
            ocupacionales: formData.get('ocupacionales'),
            vocacionales: formData.get('vocacionales'),
            expectativas: formData.get('expectativas')
        }
    };

    // Validar datos requeridos
    if (!studentData.basicInfo.name || !studentData.basicInfo.studentId) {
        showMessage('Por favor complete los campos obligatorios', 'error');
        return;
    }

    // Verificar si el estudiante ya existe
    const existingIndex = students.findIndex(s => s.basicInfo.studentId === studentData.basicInfo.studentId);
    
    if (existingIndex !== -1) {
        // Actualizar estudiante existente
        students[existingIndex] = studentData;
        showMessage('Estudiante actualizado exitosamente', 'success');
    } else {
        // Agregar nuevo estudiante
        students.push(studentData);
        showMessage('Estudiante registrado exitosamente', 'success');
    }

    // Guardar en localStorage
    saveStudents();
    
    // Limpiar formulario
    e.target.reset();
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
        showSection('search');
    }, 1500);
}

// Generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Guardar estudiantes en localStorage
function saveStudents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
        console.error('Error al guardar estudiantes:', error);
        showMessage('Error al guardar los datos', 'error');
    }
}

// Cargar estudiantes desde localStorage
function loadStudents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            students = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        students = [];
    }
}

// Mostrar todos los estudiantes
function showAllStudents() {
    const studentsList = document.getElementById('students-list');
    if (!studentsList) return;

    if (students.length === 0) {
        studentsList.innerHTML = '<div class="no-results">No hay estudiantes registrados</div>';
        return;
    }

    // Ordenar por fecha más reciente
    const sortedStudents = [...students].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    studentsList.innerHTML = sortedStudents.map(student => `
        <div class="student-card" onclick="showStudentDetails('${student.id}')">
            <h3>${student.basicInfo.name}</h3>
            <div class="student-info">
                <span><strong>ID:</strong> ${student.basicInfo.studentId}</span>
                <span><strong>Grado:</strong> ${student.basicInfo.grade}</span>
                <span><strong>Año:</strong> ${student.basicInfo.year}</span>
                <span><strong>Docente:</strong> ${student.basicInfo.requestingTeacher}</span>
            </div>
            <div class="student-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Buscar estudiantes
function searchStudents() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const studentsList = document.getElementById('students-list');
    
    if (!studentsList) return;

    if (searchTerm === '') {
        showAllStudents();
        return;
    }

    const filteredStudents = students.filter(student => 
        student.basicInfo.name.toLowerCase().includes(searchTerm) ||
        student.basicInfo.studentId.toLowerCase().includes(searchTerm) ||
        student.basicInfo.grade.toLowerCase().includes(searchTerm)
    );

    if (filteredStudents.length === 0) {
        studentsList.innerHTML = '<div class="no-results">No se encontraron estudiantes que coincidan con la búsqueda</div>';
        return;
    }

    studentsList.innerHTML = filteredStudents.map(student => `
        <div class="student-card" onclick="showStudentDetails('${student.id}')">
            <h3>${student.basicInfo.name}</h3>
            <div class="student-info">
                <span><strong>ID:</strong> ${student.basicInfo.studentId}</span>
                <span><strong>Grado:</strong> ${student.basicInfo.grade}</span>
                <span><strong>Año:</strong> ${student.basicInfo.year}</span>
                <span><strong>Docente:</strong> ${student.basicInfo.requestingTeacher}</span>
            </div>
            <div class="student-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Mostrar detalles del estudiante
function showStudentDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('student-modal');

    modalBody.innerHTML = `
        <div class="student-details">
            <h2><i class="fas fa-user-graduate"></i> ${student.basicInfo.name}</h2>
            
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Información Básica</h3>
                <div class="detail-grid">
                    <div><strong>ID del Estudiante:</strong> ${student.basicInfo.studentId}</div>
                    <div><strong>Nivel/Grado:</strong> ${student.basicInfo.grade}</div>
                    <div><strong>Año:</strong> ${student.basicInfo.year}</div>
                    <div><strong>Docente Solicitante:</strong> ${student.basicInfo.requestingTeacher}</div>
                    <div><strong>Encargado Legal:</strong> ${student.basicInfo.legalGuardian}</div>
                    <div><strong>Fecha de Registro:</strong> ${new Date(student.timestamp).toLocaleDateString('es-ES')}</div>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-book"></i> Funcionamiento Académico</h3>
                <div class="academic-details">
                    <div class="subject-detail">
                        <h4>Español</h4>
                        <p><strong>Logros:</strong> ${student.academic.espanol.logros || 'No especificado'}</p>
                        <p><strong>Nivel:</strong> ${student.academic.espanol.nivel || 'No especificado'}</p>
                        <p><strong>Docente:</strong> ${student.academic.espanol.docente || 'No especificado'}</p>
                    </div>
                    
                    <div class="subject-detail">
                        <h4>Matemáticas</h4>
                        <p><strong>Logros:</strong> ${student.academic.matematicas.logros || 'No especificado'}</p>
                        <p><strong>Nivel:</strong> ${student.academic.matematicas.nivel || 'No especificado'}</p>
                        <p><strong>Docente:</strong> ${student.academic.matematicas.docente || 'No especificado'}</p>
                    </div>
                    
                    <div class="subject-detail">
                        <h4>Ciencias</h4>
                        <p><strong>Logros:</strong> ${student.academic.ciencias.logros || 'No especificado'}</p>
                        <p><strong>Nivel:</strong> ${student.academic.ciencias.nivel || 'No especificado'}</p>
                        <p><strong>Docente:</strong> ${student.academic.ciencias.docente || 'No especificado'}</p>
                    </div>
                    
                    <div class="subject-detail">
                        <h4>Estudios Sociales</h4>
                        <p><strong>Logros:</strong> ${student.academic.sociales.logros || 'No especificado'}</p>
                        <p><strong>Nivel:</strong> ${student.academic.sociales.nivel || 'No especificado'}</p>
                        <p><strong>Docente:</strong> ${student.academic.sociales.docente || 'No especificado'}</p>
                    </div>
                    
                    ${student.academic.otras.asignatura ? `
                    <div class="subject-detail">
                        <h4>${student.academic.otras.asignatura}</h4>
                        <p><strong>Logros:</strong> ${student.academic.otras.logros || 'No especificado'}</p>
                        <p><strong>Nivel:</strong> ${student.academic.otras.nivel || 'No especificado'}</p>
                        <p><strong>Docente:</strong> ${student.academic.otras.docente || 'No especificado'}</p>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-lightbulb"></i> Desarrollo Vocacional</h3>
                <div class="vocational-details">
                    <div class="vocational-item">
                        <h4>Intereses y Habilidades Deportivas</h4>
                        <p>${student.vocational.deportivas || 'No especificado'}</p>
                    </div>
                    
                    <div class="vocational-item">
                        <h4>Intereses y Habilidades Creativas</h4>
                        <p>${student.vocational.creativas || 'No especificado'}</p>
                    </div>
                    
                    <div class="vocational-item">
                        <h4>Intereses y Habilidades Ocupacionales</h4>
                        <p>${student.vocational.ocupacionales || 'No especificado'}</p>
                    </div>
                    
                    <div class="vocational-item">
                        <h4>Intereses y Habilidades Vocacionales</h4>
                        <p>${student.vocational.vocacionales || 'No especificado'}</p>
                    </div>
                    
                    <div class="vocational-item">
                        <h4>Expectativas Vocacionales y Laborales</h4>
                        <p>${student.vocational.expectativas || 'No especificado'}</p>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-file-alt"></i> Información de Archivo</h3>
                <p><em>C.C Expediente Único del Estudiante.</em></p>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('student-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Eliminar estudiante
function deleteStudent(studentId) {
    if (confirm('¿Está seguro de que desea eliminar este estudiante? Esta acción no se puede deshacer.')) {
        students = students.filter(s => s.id !== studentId);
        saveStudents();
        showAllStudents();
        showMessage('Estudiante eliminado exitosamente', 'success');
    }
}

// Mostrar mensajes
function showMessage(message, type = 'info') {
    // Remover mensajes existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;

    // Insertar al inicio del contenedor principal
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Exportar datos (funcionalidad adicional)
function exportData() {
    try {
        const dataStr = JSON.stringify(students, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `estudiantes_ctp_sabalito_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showMessage('Datos exportados exitosamente', 'success');
    } catch (error) {
        console.error('Error al exportar:', error);
        showMessage('Error al exportar los datos', 'error');
    }
}

// Importar datos (funcionalidad adicional)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                students = importedData;
                saveStudents();
                showAllStudents();
                showMessage('Datos importados exitosamente', 'success');
            } else {
                showMessage('Formato de archivo inválido', 'error');
            }
        } catch (error) {
            console.error('Error al importar:', error);
            showMessage('Error al importar los datos', 'error');
        }
    };
    reader.readAsText(file);
}

// Agregar estilos adicionales para el modal de detalles
const additionalStyles = `
    .student-details h2 {
        color: #333;
        margin-bottom: 25px;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
    }

    .detail-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e1e5e9;
    }

    .detail-section h3 {
        color: #333;
        margin-bottom: 15px;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }

    .detail-grid > div {
        padding: 10px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
    }

    .academic-details, .vocational-details {
        display: grid;
        gap: 20px;
    }

    .subject-detail, .vocational-item {
        background: white;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e1e5e9;
    }

    .subject-detail h4, .vocational-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }

    .subject-detail p, .vocational-item p {
        margin-bottom: 5px;
        color: #555;
    }

    .message {
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
    }

    .info-message {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
