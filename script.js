// Google Apps Script Web App URL - Replace with your actual deployment URL
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

// DOM Elements
const submitBtn = document.getElementById('submitBtn');
const queryBtn = document.getElementById('queryBtn');
const clearBtn = document.getElementById('clearBtn');
const queryModal = document.getElementById('queryModal');
const closeModal = document.querySelector('.close');
const searchBtn = document.getElementById('searchBtn');
const queryResults = document.getElementById('queryResults');
const messageContainer = document.getElementById('messageContainer');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    submitBtn.addEventListener('click', handleFormSubmit);
    queryBtn.addEventListener('click', openQueryModal);
    clearBtn.addEventListener('click', clearForm);
    closeModal.addEventListener('click', closeQueryModal);
    searchBtn.addEventListener('click', searchStudent);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === queryModal) {
            closeQueryModal();
        }
    });
});

// Form Submission Handler
async function handleFormSubmit() {
    try {
        // Validate required fields
        if (!validateForm()) {
            showMessage('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        // Collect form data
        const formData = collectFormData();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        // Submit to Google Apps Script
        const response = await submitToGoogleAppsScript(formData);
        
        if (response.success) {
            showMessage('Formulario guardado exitosamente', 'success');
            clearForm();
        } else {
            showMessage('Error al guardar el formulario: ' + response.message, 'error');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Error de conexión. Por favor intente nuevamente.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Formulario';
    }
}

// Form Validation
function validateForm() {
    const requiredFields = [
        'studentName',
        'studentId',
        'grade',
        'year'
    ];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    
    return true;
}

// Collect Form Data
function collectFormData() {
    const formData = {
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
    
    return formData;
}

// Submit to Google Apps Script
async function submitToGoogleAppsScript(formData) {
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'submit',
                data: formData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error submitting to Google Apps Script:', error);
        throw error;
    }
}

// Query Modal Functions
function openQueryModal() {
    queryModal.style.display = 'block';
    document.getElementById('queryStudentId').value = '';
    queryResults.innerHTML = '';
    queryResults.classList.remove('show');
}

function closeQueryModal() {
    queryModal.style.display = 'none';
}

// Search Student Function
async function searchStudent() {
    const studentId = document.getElementById('queryStudentId').value.trim();
    
    if (!studentId) {
        showMessage('Por favor ingrese la cédula del estudiante', 'error');
        return;
    }
    
    try {
        searchBtn.disabled = true;
        searchBtn.textContent = 'Buscando...';
        
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'query',
                studentId: studentId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayQueryResults(result.data);
        } else {
            showMessage('Estudiante no encontrado', 'info');
            queryResults.innerHTML = '<p>No se encontró información para la cédula ingresada.</p>';
            queryResults.classList.add('show');
        }
        
    } catch (error) {
        console.error('Error searching student:', error);
        showMessage('Error de conexión. Por favor intente nuevamente.', 'error');
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    }
}

// Display Query Results
function displayQueryResults(studentData) {
    const resultsHtml = `
        <h4>Información del Estudiante</h4>
        <p><strong>Nombre:</strong> ${studentData.studentInfo.name}</p>
        <p><strong>Cédula:</strong> ${studentData.studentInfo.id}</p>
        <p><strong>Grado:</strong> ${studentData.studentInfo.grade}</p>
        <p><strong>Año:</strong> ${studentData.studentInfo.year}</p>
        
        <h4>Funcionamiento Académico</h4>
        <p><strong>Español:</strong> ${studentData.academicPerformance.espanol.nivel} - ${studentData.academicPerformance.espanol.docente}</p>
        <p><strong>Matemáticas:</strong> ${studentData.academicPerformance.matematicas.nivel} - ${studentData.academicPerformance.matematicas.docente}</p>
        <p><strong>Ciencias:</strong> ${studentData.academicPerformance.ciencias.nivel} - ${studentData.academicPerformance.ciencias.docente}</p>
        <p><strong>Estudios Sociales:</strong> ${studentData.academicPerformance.estudiosSociales.nivel} - ${studentData.academicPerformance.estudiosSociales.docente}</p>
        <p><strong>Otras:</strong> ${studentData.academicPerformance.otras.nivel} - ${studentData.academicPerformance.otras.docente}</p>
        
        <h4>Desarrollo Vocacional</h4>
        <p><strong>Intereses:</strong> ${studentData.vocationalDevelopment.interests}</p>
        <p><strong>Expectativas:</strong> ${studentData.vocationalDevelopment.expectations}</p>
        <p><strong>Habilidades Productivas:</strong> ${studentData.vocationalDevelopment.productiveSkills}</p>
    `;
    
    queryResults.innerHTML = resultsHtml;
    queryResults.classList.add('show');
}

// Clear Form Function
function clearForm() {
    // Clear student info
    document.getElementById('studentName').value = '';
    document.getElementById('studentId').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('year').value = '2025';
    
    // Clear academic performance
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.value = '');
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    
    // Clear vocational development
    document.getElementById('vocational_interests').value = '';
    document.getElementById('vocational_expectations').value = '';
    document.getElementById('productive_skills').value = '';
    
    showMessage('Formulario limpiado', 'info');
}

// Message Display Function
function showMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for testing
window.formFunctions = {
    validateForm,
    collectFormData,
    clearForm,
    showMessage
};
