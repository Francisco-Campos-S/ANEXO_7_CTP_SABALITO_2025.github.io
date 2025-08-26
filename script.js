// Funcionalidad del formulario ANEXO 7
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('anexo7Form');
    const saveBtn = document.getElementById('saveBtn');
    const previewBtn = document.getElementById('previewBtn');
    const printBtn = document.getElementById('printBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Cargar datos guardados al iniciar
    loadFormData();

    // Event listeners para los botones
    saveBtn.addEventListener('click', saveFormData);
    previewBtn.addEventListener('click', previewForm);
    printBtn.addEventListener('click', printForm);
    clearBtn.addEventListener('click', clearForm);

    // Auto-guardar cuando se cambian los campos
    form.addEventListener('input', autoSave);

    // Función para auto-guardar
    function autoSave() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('anexo7FormData', JSON.stringify(data));
        
        // Mostrar indicador de guardado
        showSaveIndicator();
    }

    // Función para mostrar indicador de guardado
    function showSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.textContent = 'Guardado automáticamente';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }, 2000);
    }

    // Función para guardar datos del formulario
    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Guardar en localStorage
        localStorage.setItem('anexo7FormData', JSON.stringify(data));
        
        // Crear archivo para descargar
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ANEXO7_${data.estudiante || 'Estudiante'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Mostrar mensaje de éxito
        showMessage('Formulario guardado exitosamente', 'success');
    }

    // Función para cargar datos guardados
    function loadFormData() {
        const savedData = localStorage.getItem('anexo7FormData');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Llenar los campos del formulario
                for (let key in data) {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                    }
                }
                
                showMessage('Datos cargados automáticamente', 'info');
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        }
    }

    // Función para limpiar formulario
    function clearForm() {
        if (confirm('¿Está seguro de que desea limpiar todo el formulario? Esta acción no se puede deshacer.')) {
            form.reset();
            localStorage.removeItem('anexo7FormData');
            showMessage('Formulario limpiado', 'warning');
        }
    }

    // Función para vista previa de impresión
    function previewForm() {
        // Ocultar botones y elementos no deseados
        const formActions = document.querySelector('.form-actions');
        const saveIndicator = document.querySelector('.save-indicator');
        const messages = document.querySelectorAll('.message');
        
        if (formActions) formActions.style.display = 'none';
        if (saveIndicator) saveIndicator.style.display = 'none';
        messages.forEach(msg => msg.style.display = 'none');
        
        // Agregar clase para estilos de impresión
        document.body.classList.add('printing');
        
        // Mostrar mensaje de instrucciones
        showMessage('Vista previa activada. Presiona Ctrl+P para imprimir o Esc para salir', 'info');
        
        // Agregar evento para salir de la vista previa
        const exitPreview = (e) => {
            if (e.key === 'Escape') {
                // Restaurar elementos
                if (formActions) formActions.style.display = 'flex';
                if (saveIndicator) saveIndicator.style.display = 'block';
                messages.forEach(msg => msg.style.display = 'block');
                document.body.classList.remove('printing');
                
                // Remover evento
                document.removeEventListener('keydown', exitPreview);
                showMessage('Vista previa desactivada', 'info');
            }
        };
        
        document.addEventListener('keydown', exitPreview);
    }

    // Función para imprimir formulario
    function printForm() {
        // Ocultar botones y elementos no deseados antes de imprimir
        const formActions = document.querySelector('.form-actions');
        const saveIndicator = document.querySelector('.save-indicator');
        const messages = document.querySelectorAll('.message');
        
        if (formActions) formActions.style.display = 'none';
        if (saveIndicator) saveIndicator.style.display = 'none';
        messages.forEach(msg => msg.style.display = 'none');
        
        // Agregar clase para estilos de impresión
        document.body.classList.add('printing');
        
        // Imprimir
        window.print();
        
        // Restaurar elementos después de imprimir
        setTimeout(() => {
            if (formActions) formActions.style.display = 'flex';
            if (saveIndicator) saveIndicator.style.display = 'block';
            messages.forEach(msg => msg.style.display = 'block');
            document.body.classList.remove('printing');
        }, 1000);
    }

    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        
        // Estilos según el tipo de mensaje
        switch(type) {
            case 'success':
                messageDiv.style.background = '#28a745';
                break;
            case 'warning':
                messageDiv.style.background = '#ffc107';
                messageDiv.style.color = '#212529';
                break;
            case 'error':
                messageDiv.style.background = '#dc3545';
                break;
            default:
                messageDiv.style.background = '#17a2b8';
        }
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // Validación de campos requeridos
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
                
                isValid = false;
            } else {
                field.style.borderColor = '#e9ecef';
                field.style.boxShadow = 'none';
            }
        });
        
        if (!isValid) {
            showMessage('Por favor complete todos los campos requeridos', 'error');
            firstInvalidField.focus();
        } else {
            saveFormData();
        }
    });

    // Restaurar estilo de borde cuando se escribe en campos requeridos
    form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e9ecef';
                this.style.boxShadow = 'none';
            }
        });
    });

    // Función para exportar a PDF (simulada)
    function exportToPDF() {
        showMessage('Función de exportación a PDF en desarrollo', 'info');
    }

    // Agregar estilos CSS para las animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
        
        .save-indicator {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .message {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);

    // Función para validar formato de cédula costarricense
    function validateCedula(cedula) {
        // Formato básico: 9 dígitos
        const cedulaRegex = /^\d{9}$/;
        return cedulaRegex.test(cedula);
    }

    // Validar cédula en tiempo real
    const cedulaField = document.getElementById('cedula');
    if (cedulaField) {
        cedulaField.addEventListener('blur', function() {
            if (this.value && !validateCedula(this.value)) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                showMessage('La cédula debe tener 9 dígitos numéricos', 'error');
            } else if (this.value) {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            }
        });
    }

    // Función para validar edad
    function validateAge(edad) {
        return edad >= 0 && edad <= 25;
    }

    // Validar edad en tiempo real
    const edadField = document.getElementById('edad');
    if (edadField) {
        edadField.addEventListener('blur', function() {
            if (this.value && !validateAge(parseInt(this.value))) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                showMessage('La edad debe estar entre 0 y 25 años', 'error');
            } else if (this.value) {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            }
        });
    }

    // Mostrar información de ayuda al hacer hover sobre campos
    const helpTexts = {
        'institucion': 'Nombre completo de la institución educativa',
        'circuito': 'Número del circuito escolar al que pertenece',
        'estudiante': 'Nombre completo del estudiante',
        'edad': 'Edad actual del estudiante en años',
        'nivel': 'Nivel educativo que está cursando actualmente',
        'cedula': 'Número de cédula del estudiante (9 dígitos)',
        'fechaNacimiento': 'Fecha de nacimiento del estudiante',
        'direccion': 'Dirección completa del estudiante',
        'encargado': 'Nombre completo del padre, madre o encargado legal'
    };

    // Agregar tooltips de ayuda
    Object.keys(helpTexts).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.title = helpTexts[fieldName];
        }
    });

    console.log('Formulario ANEXO 7 cargado correctamente');
});
