// Sistema ANEXO 7 - Versión Local Funcional
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const queryBtn = document.getElementById('queryBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    const searchBtn = document.getElementById('searchBtn');
    
    submitBtn.addEventListener('click', handleFormSubmit);
    queryBtn.addEventListener('click', openQueryModal);
    clearBtn.addEventListener('click', clearForm);
    loadSampleBtn.addEventListener('click', loadSampleDataIntoForm);
    searchBtn.addEventListener('click', searchStudent);
    
    // Agregar botón de descarga CSV
    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.id = 'downloadBtn';
    downloadBtn.className = 'btn btn-success';
    downloadBtn.textContent = 'Descargar CSV';
    downloadBtn.addEventListener('click', downloadCSV);
    
    // Insertar después del botón de limpiar
    clearBtn.parentNode.insertBefore(downloadBtn, clearBtn.nextSibling);
    
    // Cargar datos de prueba si no hay datos existentes
    loadSampleData();
});

function loadSampleData() {
    const existingData = JSON.parse(localStorage.getItem('anexo7_data') || '[]');
    
    if (existingData.length === 0) {
        const sampleData = [
            {
                timestamp: '2025-01-15T08:30:00.000Z',
                studentInfo: {
                    name: 'María Fernanda Rodríguez López',
                    id: '123456789',
                    grade: '11° Año',
                    year: '2025'
                },
                academicPerformance: {
                    espanol: {
                        logros: 'Excelente comprensión lectora, redacción clara y creativa, dominio de la gramática avanzada.',
                        nivel: 'Excelente',
                        docente: 'Prof. Ana María Vargas'
                    },
                    matematicas: {
                        logros: 'Resuelve problemas complejos de álgebra y geometría, aplica fórmulas correctamente.',
                        nivel: 'Muy Bueno',
                        docente: 'Prof. Carlos Méndez'
                    },
                    ciencias: {
                        logros: 'Comprensión profunda de conceptos científicos, excelente en laboratorios.',
                        nivel: 'Excelente',
                        docente: 'Prof. Laura Jiménez'
                    },
                    estudiosSociales: {
                        logros: 'Análisis crítico de eventos históricos, excelente participación en debates.',
                        nivel: 'Muy Bueno',
                        docente: 'Prof. Roberto Silva'
                    },
                    otras: {
                        logros: 'Destacada en informática y tecnología, proyectos innovadores.',
                        nivel: 'Excelente',
                        docente: 'Prof. Diego Ramírez'
                    }
                },
                vocationalDevelopment: {
                    interests: 'Interés en medicina y ciencias de la salud. Habilidades en liderazgo estudiantil y deportes (fútbol).',
                    expectations: 'Aspira a estudiar medicina en la Universidad de Costa Rica. Interés en especializarse en pediatría.',
                    productiveSkills: 'Excelente comunicación oral y escrita, trabajo en equipo, resolución de problemas, uso de tecnología.'
                }
            },
            {
                timestamp: '2025-01-14T14:20:00.000Z',
                studentInfo: {
                    name: 'Juan Carlos Mora Brenes',
                    id: '987654321',
                    grade: '10° Año',
                    year: '2025'
                },
                academicPerformance: {
                    espanol: {
                        logros: 'Buena comprensión lectora, mejora en redacción, necesita práctica en ortografía.',
                        nivel: 'Bueno',
                        docente: 'Prof. Ana María Vargas'
                    },
                    matematicas: {
                        logros: 'Progreso constante en álgebra básica, buen manejo de operaciones fundamentales.',
                        nivel: 'Bueno',
                        docente: 'Prof. Carlos Méndez'
                    },
                    ciencias: {
                        logros: 'Interés en experimentos, comprensión básica de conceptos científicos.',
                        nivel: 'Regular',
                        docente: 'Prof. Laura Jiménez'
                    },
                    estudiosSociales: {
                        logros: 'Participación activa en clase, comprensión de conceptos básicos.',
                        nivel: 'Bueno',
                        docente: 'Prof. Roberto Silva'
                    },
                    otras: {
                        logros: 'Habilidad en dibujo técnico, interés en mecánica automotriz.',
                        nivel: 'Bueno',
                        docente: 'Prof. Diego Ramírez'
                    }
                },
                vocationalDevelopment: {
                    interests: 'Interés en mecánica automotriz y tecnología. Habilidades manuales y creativas.',
                    expectations: 'Desea estudiar ingeniería mecánica o técnico en mecánica automotriz.',
                    productiveSkills: 'Habilidades manuales, creatividad, trabajo en equipo, interés en tecnología.'
                }
            },
            {
                timestamp: '2025-01-13T10:15:00.000Z',
                studentInfo: {
                    name: 'Sofía Alejandra Chaves Mora',
                    id: '456789123',
                    grade: '12° Año',
                    year: '2025'
                },
                academicPerformance: {
                    espanol: {
                        logros: 'Excelente dominio del idioma, creatividad literaria excepcional, liderazgo en proyectos de lectura.',
                        nivel: 'Excelente',
                        docente: 'Prof. Ana María Vargas'
                    },
                    matematicas: {
                        logros: 'Dominio avanzado de cálculo, excelente en estadística y probabilidad.',
                        nivel: 'Excelente',
                        docente: 'Prof. Carlos Méndez'
                    },
                    ciencias: {
                        logros: 'Investigación científica destacada, premios en ferias científicas.',
                        nivel: 'Excelente',
                        docente: 'Prof. Laura Jiménez'
                    },
                    estudiosSociales: {
                        logros: 'Análisis crítico excepcional, liderazgo en proyectos sociales.',
                        nivel: 'Excelente',
                        docente: 'Prof. Roberto Silva'
                    },
                    otras: {
                        logros: 'Excelente en inglés avanzado, programación y robótica.',
                        nivel: 'Excelente',
                        docente: 'Prof. Diego Ramírez'
                    }
                },
                vocationalDevelopment: {
                    interests: 'Interés en ingeniería biomédica y investigación científica. Habilidades en programación y robótica.',
                    expectations: 'Aspira a estudiar ingeniería biomédica en el extranjero. Interés en investigación y desarrollo tecnológico.',
                    productiveSkills: 'Liderazgo, investigación, programación, comunicación multilingüe, trabajo en equipo.'
                }
            }
        ];
        
        localStorage.setItem('anexo7_data', JSON.stringify(sampleData));
        console.log('✅ Datos de prueba cargados exitosamente');
        showMessage('Datos de prueba cargados. Puedes consultar estudiantes o agregar nuevos.', 'info');
    }
}

function loadSampleDataIntoForm() {
    // Cargar datos del primer estudiante de ejemplo
    const existingData = JSON.parse(localStorage.getItem('anexo7_data') || '[]');
    
    if (existingData.length === 0) {
        showMessage('No hay datos de ejemplo disponibles', 'error');
        return;
    }
    
    const sampleStudent = existingData[0]; // Usar el primer estudiante como ejemplo
    
    // Llenar información del estudiante
    document.getElementById('studentName').value = sampleStudent.studentInfo.name;
    document.getElementById('studentId').value = sampleStudent.studentInfo.id;
    document.getElementById('grade').value = sampleStudent.studentInfo.grade;
    document.getElementById('year').value = sampleStudent.studentInfo.year;
    
    // Llenar funcionamiento académico
    document.querySelector('textarea[name="espanol_logros"]').value = sampleStudent.academicPerformance.espanol.logros;
    document.querySelector('select[name="espanol_nivel"]').value = sampleStudent.academicPerformance.espanol.nivel;
    document.querySelector('input[name="espanol_docente"]').value = sampleStudent.academicPerformance.espanol.docente;
    
    document.querySelector('textarea[name="matematicas_logros"]').value = sampleStudent.academicPerformance.matematicas.logros;
    document.querySelector('select[name="matematicas_nivel"]').value = sampleStudent.academicPerformance.matematicas.nivel;
    document.querySelector('input[name="matematicas_docente"]').value = sampleStudent.academicPerformance.matematicas.docente;
    
    document.querySelector('textarea[name="ciencias_logros"]').value = sampleStudent.academicPerformance.ciencias.logros;
    document.querySelector('select[name="ciencias_nivel"]').value = sampleStudent.academicPerformance.ciencias.nivel;
    document.querySelector('input[name="ciencias_docente"]').value = sampleStudent.academicPerformance.ciencias.docente;
    
    document.querySelector('textarea[name="estudios_sociales_logros"]').value = sampleStudent.academicPerformance.estudiosSociales.logros;
    document.querySelector('select[name="estudios_sociales_nivel"]').value = sampleStudent.academicPerformance.estudiosSociales.nivel;
    document.querySelector('input[name="estudios_sociales_docente"]').value = sampleStudent.academicPerformance.estudiosSociales.docente;
    
    document.querySelector('textarea[name="otras_logros"]').value = sampleStudent.academicPerformance.otras.logros;
    document.querySelector('select[name="otras_nivel"]').value = sampleStudent.academicPerformance.otras.nivel;
    document.querySelector('input[name="otras_docente"]').value = sampleStudent.academicPerformance.otras.docente;
    
    // Llenar desarrollo vocacional
    document.getElementById('vocational_interests').value = sampleStudent.vocationalDevelopment.interests;
    document.getElementById('vocational_expectations').value = sampleStudent.vocationalDevelopment.expectations;
    document.getElementById('productive_skills').value = sampleStudent.vocationalDevelopment.productiveSkills;
    
    showMessage('Datos de ejemplo cargados en el formulario. Ahora puedes enviarlo o modificarlo.', 'success');
    
    // Hacer scroll al formulario
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function handleFormSubmit() {
    if (!validateForm()) {
        showMessage('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    const formData = collectFormData();
    
    // Guardar en localStorage para consultas posteriores
    saveToLocalStorage(formData);
    
    // Mostrar mensaje de éxito
    showMessage('Formulario guardado exitosamente en el navegador', 'success');
    
    // Mostrar resumen
    showFormSummary(formData);
    
    // Limpiar formulario
    clearForm();
}

function validateForm() {
    const requiredFields = ['studentName', 'studentId', 'grade', 'year'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    return true;
}

function collectFormData() {
    return {
        timestamp: new Date().toISOString(),
        studentInfo: {
            name: document.getElementById('studentName').value.trim(),
            id: document.getElementById('studentId').value.trim(),
            grade: document.getElementById('grade').value.trim(),
            year: document.getElementById('year').value.trim()
        },
        academicPerformance: {
            espanol: {
                logros: document.querySelector('textarea[name="espanol_logros"]').value.trim(),
                nivel: document.querySelector('select[name="espanol_nivel"]').value,
                docente: document.querySelector('input[name="espanol_docente"]').value.trim()
            },
            matematicas: {
                logros: document.querySelector('textarea[name="matematicas_logros"]').value.trim(),
                nivel: document.querySelector('select[name="matematicas_nivel"]').value,
                docente: document.querySelector('input[name="matematicas_docente"]').value.trim()
            },
            ciencias: {
                logros: document.querySelector('textarea[name="ciencias_logros"]').value.trim(),
                nivel: document.querySelector('select[name="ciencias_nivel"]').value,
                docente: document.querySelector('input[name="ciencias_docente"]').value.trim()
            },
            estudiosSociales: {
                logros: document.querySelector('textarea[name="estudios_sociales_logros"]').value.trim(),
                nivel: document.querySelector('select[name="estudios_sociales_nivel"]').value,
                docente: document.querySelector('input[name="estudios_sociales_docente"]').value.trim()
            },
            otras: {
                logros: document.querySelector('textarea[name="otras_logros"]').value.trim(),
                nivel: document.querySelector('select[name="otras_nivel"]').value,
                docente: document.querySelector('input[name="otras_docente"]').value.trim()
            }
        },
        vocationalDevelopment: {
            interests: document.getElementById('vocational_interests').value.trim(),
            expectations: document.getElementById('vocational_expectations').value.trim(),
            productiveSkills: document.getElementById('productive_skills').value.trim()
        }
    };
}

function saveToLocalStorage(formData) {
    const existingData = JSON.parse(localStorage.getItem('anexo7_data') || '[]');
    existingData.push(formData);
    localStorage.setItem('anexo7_data', JSON.stringify(existingData));
}

function clearForm() {
    document.getElementById('studentName').value = '';
    document.getElementById('studentId').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('year').value = '2025';
    
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.value = '');
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    
    showMessage('Formulario limpiado', 'info');
}

function openQueryModal() {
    const queryModal = document.getElementById('queryModal');
    queryModal.style.display = 'block';
    
    // Limpiar campo de búsqueda
    document.getElementById('queryStudentId').value = '';
    document.getElementById('queryResults').innerHTML = '';
}

function searchStudent() {
    const studentId = document.getElementById('queryStudentId').value.trim();
    
    if (!studentId) {
        showMessage('Por favor ingrese la cédula del estudiante', 'error');
        return;
    }
    
    const existingData = JSON.parse(localStorage.getItem('anexo7_data') || '[]');
    const student = existingData.find(s => s.studentInfo.id === studentId);
    
    const queryResults = document.getElementById('queryResults');
    
    if (!student) {
        queryResults.innerHTML = '<p>No se encontró información para la cédula ingresada.</p>';
        queryResults.classList.add('show');
        return;
    }
    
    const html = `
        <h4>Información del Estudiante</h4>
        <p><strong>Nombre:</strong> ${student.studentInfo.name}</p>
        <p><strong>Cédula:</strong> ${student.studentInfo.id}</p>
        <p><strong>Grado:</strong> ${student.studentInfo.grade}</p>
        <p><strong>Año:</strong> ${student.studentInfo.year}</p>
        
        <h4>Funcionamiento Académico</h4>
        <p><strong>Español:</strong> ${student.academicPerformance.espanol.nivel} - ${student.academicPerformance.espanol.docente}</p>
        <p><strong>Matemáticas:</strong> ${student.academicPerformance.matematicas.nivel} - ${student.academicPerformance.matematicas.docente}</p>
        <p><strong>Ciencias:</strong> ${student.academicPerformance.ciencias.nivel} - ${student.academicPerformance.ciencias.docente}</p>
        <p><strong>Estudios Sociales:</strong> ${student.academicPerformance.estudiosSociales.nivel} - ${student.academicPerformance.estudiosSociales.docente}</p>
        <p><strong>Otras:</strong> ${student.academicPerformance.otras.nivel} - ${student.academicPerformance.otras.docente}</p>
        
        <h4>Desarrollo Vocacional</h4>
        <p><strong>Intereses:</strong> ${student.vocationalDevelopment.interests}</p>
        <p><strong>Expectativas:</strong> ${student.vocationalDevelopment.expectations}</p>
        <p><strong>Habilidades Productivas:</strong> ${student.vocationalDevelopment.productiveSkills}</p>
    `;
    
    queryResults.innerHTML = html;
    queryResults.classList.add('show');
}

function downloadCSV() {
    const existingData = JSON.parse(localStorage.getItem('anexo7_data') || '[]');
    
    if (existingData.length === 0) {
        showMessage('No hay datos para descargar', 'error');
        return;
    }
    
    // Crear CSV
    const headers = [
        'Timestamp', 'Nombre', 'Cédula', 'Grado', 'Año',
        'Esp-Logros', 'Esp-Nivel', 'Esp-Docente',
        'Mat-Logros', 'Mat-Nivel', 'Mat-Docente',
        'Cien-Logros', 'Cien-Nivel', 'Cien-Docente',
        'Soc-Logros', 'Soc-Nivel', 'Soc-Docente',
        'Otras-Logros', 'Otras-Nivel', 'Otras-Docente',
        'Intereses', 'Expectativas', 'Habilidades'
    ];
    
    const csvRows = [headers];
    
    existingData.forEach(student => {
        const row = [
            student.timestamp,
            student.studentInfo.name,
            student.studentInfo.id,
            student.studentInfo.grade,
            student.studentInfo.year,
            student.academicPerformance.espanol.logros,
            student.academicPerformance.espanol.nivel,
            student.academicPerformance.espanol.docente,
            student.academicPerformance.matematicas.logros,
            student.academicPerformance.matematicas.nivel,
            student.academicPerformance.matematicas.docente,
            student.academicPerformance.ciencias.logros,
            student.academicPerformance.ciencias.nivel,
            student.academicPerformance.ciencias.docente,
            student.academicPerformance.estudiosSociales.logros,
            student.academicPerformance.estudiosSociales.nivel,
            student.academicPerformance.estudiosSociales.docente,
            student.academicPerformance.otras.logros,
            student.academicPerformance.otras.nivel,
            student.academicPerformance.otras.docente,
            student.vocationalDevelopment.interests,
            student.vocationalDevelopment.expectations,
            student.vocationalDevelopment.productiveSkills
        ];
        csvRows.push(row);
    });
    
    const csvContent = csvRows.map(row => 
        row.map(cell => `"${cell || ''}"`).join(',')
    ).join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `anexo7_estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('Archivo CSV descargado exitosamente', 'success');
}

function showFormSummary(formData) {
    const summary = `
        ✅ Formulario guardado para: ${formData.studentInfo.name}
        🆔 Cédula: ${formData.studentInfo.id}
        🎓 Grado: ${formData.studentInfo.grade}
        📅 Año: ${formData.studentInfo.year}
        
        Los datos se han guardado en el navegador y puedes:
        • Consultar estudiantes existentes
        • Descargar todos los datos como CSV
        • Los datos persisten entre sesiones
    `;
    
    console.log(summary);
}

function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    const queryModal = document.getElementById('queryModal');
    if (event.target === queryModal) {
        queryModal.style.display = 'none';
    }
});

// Cerrar modal con X
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('queryModal').style.display = 'none';
});
