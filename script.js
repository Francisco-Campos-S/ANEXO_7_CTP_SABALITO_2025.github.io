// Funcionalidad del formulario ANEXO 7
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('anexo7Form');
    const saveBtn = document.getElementById('saveBtn');
    const previewBtn = document.getElementById('previewBtn');
    const printBtn = document.getElementById('printBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Inicializar managers
    const googleSheetsManager = new GoogleSheetsManager();
    const printManager = new PrintManager();

    // Variables globales
    let currentStudentId = null;
    let studentsList = [];

    // Cargar datos guardados al iniciar
    loadFormData();
    initializeEventListeners();
    loadStudentsList();

    // Inicializar event listeners
    function initializeEventListeners() {
        // Botones del formulario
        saveBtn.addEventListener('click', saveFormData);
        previewBtn.addEventListener('click', previewForm);
        printBtn.addEventListener('click', printForm);
        clearBtn.addEventListener('click', clearForm);

        // Botón de conexión
        const connectBtn = document.getElementById('connectBtn');
        if (connectBtn) {
            connectBtn.addEventListener('click', connectToGoogleSheets);
        }

        // Botones de gestión de estudiantes
        const newStudentBtn = document.getElementById('newStudentBtn');
        const deleteStudentBtn = document.getElementById('deleteStudentBtn');
        const exportAllBtn = document.getElementById('exportAllBtn');
        
        if (newStudentBtn) {
            newStudentBtn.addEventListener('click', newStudent);
        }
        if (deleteStudentBtn) {
            deleteStudentBtn.addEventListener('click', deleteStudent);
        }
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', exportAllStudents);
        }

        // Selector de estudiantes
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect) {
            studentSelect.addEventListener('change', onStudentSelectChange);
        }

        // Modal de confirmación
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', confirmDeleteStudent);
        }
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        }
    }

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

    // ===== FUNCIONES DE GOOGLE SHEETS =====

    // Actualizar estado visual de la conexión
    function updateConnectionStatus(status, text) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const connectBtn = document.getElementById('connectBtn');
        
        if (statusDot && statusText && connectBtn) {
            // Remover clases anteriores
            statusDot.classList.remove('connected', 'connecting', 'disconnected');
            
            // Agregar nueva clase
            statusDot.classList.add(status);
            statusText.textContent = text;
            
            // Actualizar botón
            if (status === 'connected') {
                connectBtn.textContent = 'Reconectar';
                connectBtn.classList.remove('btn-success');
                connectBtn.classList.add('btn-warning');
            } else {
                connectBtn.textContent = 'Conectar a Google Sheets';
                connectBtn.classList.remove('btn-warning');
                connectBtn.classList.add('btn-success');
            }
        }
    }

    // Conectar a Google Apps Script
    async function connectToGoogleSheets() {
        try {
            // Actualizar estado visual
            updateConnectionStatus('connecting', 'Conectando...');
            
            // Inicializar y conectar
            await googleSheetsManager.init();
            await googleSheetsManager.connectToSpreadsheet();
            
            // Actualizar estado visual
            updateConnectionStatus('connected', 'Conectado');
            showMessage('Conectado exitosamente a Google Sheets', 'success');
            
            // Cargar lista de estudiantes
            await loadStudentsList();
        } catch (error) {
            updateConnectionStatus('disconnected', 'Error de conexión');
            showMessage(`Error al conectar: ${error.message}`, 'error');
        }
    }



    // ===== FUNCIONES DE GESTIÓN DE ESTUDIANTES =====

    // Cargar lista de estudiantes
    async function loadStudentsList() {
        try {
            if (googleSheetsManager.isConnected) {
                studentsList = await googleSheetsManager.getAllStudents();
                updateStudentSelector();
                updateStudentsList();
            }
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    }

    // Actualizar selector de estudiantes
    function updateStudentSelector() {
        const studentSelect = document.getElementById('studentSelect');
        if (!studentSelect) return;

        // Limpiar opciones existentes
        studentSelect.innerHTML = '<option value="">-- Nuevo Estudiante --</option>';

        // Agregar estudiantes
        studentsList.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id || student.estudiante;
            option.textContent = `${student.estudiante || 'Sin nombre'} - ${student.institucion || 'Sin institución'}`;
            studentSelect.appendChild(option);
        });
    }

    // Actualizar lista visual de estudiantes
    function updateStudentsList() {
        const studentsListContainer = document.getElementById('studentsList');
        if (!studentsListContainer) return;

        studentsListContainer.innerHTML = '';

        studentsList.forEach(student => {
            const studentCard = createStudentCard(student);
            studentsListContainer.appendChild(studentCard);
        });
    }

    // Crear tarjeta de estudiante
    function createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-info">
                <h5>${student.estudiante || 'Sin nombre'}</h5>
                <p><strong>Institución:</strong> ${student.institucion || 'No especificada'}</p>
                <p><strong>Nivel:</strong> ${student.nivel || 'No especificado'}</p>
                <p><strong>Cédula:</strong> ${student.cedula || 'No especificada'}</p>
            </div>
            <div class="student-actions">
                <button class="btn btn-info btn-sm" onclick="loadStudentToForm('${student.id || student.estudiante}')">Cargar</button>
                <button class="btn btn-warning btn-sm" onclick="printStudent('${student.id || student.estudiante}')">Imprimir</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id || student.estudiante}')">Eliminar</button>
            </div>
        `;
        return card;
    }

    // Cambio en selector de estudiantes
    function onStudentSelectChange() {
        const studentSelect = document.getElementById('studentSelect');
        const selectedValue = studentSelect.value;

        if (selectedValue) {
            loadStudentToForm(selectedValue);
        } else {
            newStudent();
        }
    }

    // Nuevo estudiante
    function newStudent() {
        currentStudentId = null;
        form.reset();
        localStorage.removeItem('anexo7FormData');
        
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect) {
            studentSelect.value = '';
        }
        
        showMessage('Formulario preparado para nuevo estudiante', 'info');
    }

    // Cargar estudiante al formulario
    function loadStudentToForm(studentId) {
        const student = studentsList.find(s => (s.id || s.estudiante) === studentId);
        if (!student) {
            showMessage('Estudiante no encontrado', 'error');
            return;
        }

        currentStudentId = studentId;
        
        // Llenar formulario con datos del estudiante
        Object.keys(student).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = student[key] || '';
            }
        });

        // Actualizar selector
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect) {
            studentSelect.value = studentId;
        }

        showMessage(`Estudiante "${student.estudiante}" cargado`, 'success');
    }

    // Eliminar estudiante
    function deleteStudent(studentId) {
        if (!studentId) {
            showMessage('Seleccione un estudiante para eliminar', 'warning');
            return;
        }

        const student = studentsList.find(s => (s.id || s.estudiante) === studentId);
        if (!student) {
            showMessage('Estudiante no encontrado', 'error');
            return;
        }

        // Mostrar modal de confirmación
        const deleteModal = document.getElementById('deleteModal');
        const studentToDeleteSpan = document.getElementById('studentToDelete');
        
        if (deleteModal && studentToDeleteSpan) {
            studentToDeleteSpan.textContent = student.estudiante || 'Sin nombre';
            deleteModal.style.display = 'block';
        }
    }

    // Confirmar eliminación de estudiante
    async function confirmDeleteStudent() {
        try {
            if (!currentStudentId) {
                showMessage('No hay estudiante seleccionado', 'error');
                return;
            }

            await googleSheetsManager.deleteStudent(currentStudentId);
            showMessage('Estudiante eliminado exitosamente', 'success');
            
            // Recargar lista
            await loadStudentsList();
            
            // Limpiar formulario si era el estudiante actual
            if (currentStudentId === currentStudentId) {
                newStudent();
            }
            
            closeDeleteModal();
        } catch (error) {
            showMessage(`Error al eliminar: ${error.message}`, 'error');
        }
    }

    // Cerrar modal de eliminación
    function closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    }

    // Exportar todos los estudiantes
    function exportAllStudents() {
        if (studentsList.length === 0) {
            showMessage('No hay estudiantes para exportar', 'warning');
            return;
        }

        try {
            const jsonData = JSON.stringify(studentsList, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ANEXO7_Todos_Estudiantes_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showMessage('Estudiantes exportados exitosamente', 'success');
        } catch (error) {
            showMessage(`Error al exportar: ${error.message}`, 'error');
        }
    }

    // Imprimir estudiante específico
    function printStudent(studentId) {
        const student = studentsList.find(s => (s.id || s.estudiante) === studentId);
        if (!student) {
            showMessage('Estudiante no encontrado', 'error');
            return;
        }

        try {
            printManager.printStudentForm(student);
            showMessage('Ventana de impresión abierta', 'info');
        } catch (error) {
            showMessage(`Error al imprimir: ${error.message}`, 'error');
        }
    }

    // ===== FUNCIONES ACTUALIZADAS =====

    // Función para guardar datos del formulario (actualizada)
    async function saveFormData() {
        try {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Validar campos requeridos
            if (!validateRequiredFields(data)) {
                showMessage('Por favor complete todos los campos requeridos', 'error');
                return;
            }

            // Guardar en localStorage
            localStorage.setItem('anexo7FormData', JSON.stringify(data));

            // Guardar en Google Sheets si está conectado
            if (googleSheetsManager.isConnected) {
                if (currentStudentId) {
                    // Actualizar estudiante existente
                    await googleSheetsManager.updateStudentData(currentStudentId, data);
                    showMessage('Estudiante actualizado exitosamente', 'success');
                } else {
                    // Crear nuevo estudiante
                    await googleSheetsManager.saveStudentData(data);
                    showMessage('Estudiante guardado exitosamente en Google Sheets', 'success');
                    
                    // Recargar lista y limpiar formulario
                    await loadStudentsList();
                    newStudent();
                }
            } else {
                // Solo guardar localmente
                showMessage('Formulario guardado localmente (no hay conexión con Google Sheets)', 'warning');
            }
        } catch (error) {
            showMessage(`Error al guardar: ${error.message}`, 'error');
        }
    }

    // Función para imprimir formulario (actualizada)
    function printForm() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        if (!data.estudiante) {
            showMessage('Por favor complete al menos el nombre del estudiante', 'warning');
            return;
        }

        try {
            printManager.printStudentForm(data);
            showMessage('Ventana de impresión abierta', 'info');
        } catch (error) {
            showMessage(`Error al imprimir: ${error.message}`, 'error');
        }
    }

    // Función para vista previa (actualizada)
    function previewForm() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        if (!data.estudiante) {
            showMessage('Por favor complete al menos el nombre del estudiante', 'warning');
            return;
        }

        try {
            printManager.previewPrint(data);
            showMessage('Vista previa abierta', 'info');
        } catch (error) {
            showMessage(`Error al abrir vista previa: ${error.message}`, 'error');
        }
    }

    // Función para limpiar formulario (actualizada)
    function clearForm() {
        if (confirm('¿Está seguro de que desea limpiar todo el formulario? Esta acción no se puede deshacer.')) {
            newStudent();
            showMessage('Formulario limpiado', 'warning');
        }
    }

    // Validar campos requeridos
    function validateRequiredFields(data) {
        const requiredFields = DATA_STRUCTURE.REQUIRED_FIELDS;
        return requiredFields.every(field => data[field] && data[field].trim() !== '');
    }

    // Hacer funciones disponibles globalmente para los botones de las tarjetas
    window.loadStudentToForm = loadStudentToForm;
    window.printStudent = printStudent;
    window.deleteStudent = deleteStudent;
});
