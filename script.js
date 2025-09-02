// Formulario ANEXO 7 - CTP Sabalito 2025
// Funcionalidad para el formulario de docentes con Google Sheets

document.addEventListener('DOMContentLoaded', function() {
    // Verificar configuración
    if (showConfigMessage()) {
        showConfigAlert();
    }
    const form = document.getElementById('docenteForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');

    // Solo inicializar si el formulario existe (página de docentes)
    if (!form) return;

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
            
            try {
                // Mostrar indicador de carga
                showLoadingMessage();
                
                // Guardar en Google Sheets
                await saveToGoogleSheets(formData);
                
                // Mostrar resultados
                displayResults(formData);
                showSuccessMessage();
                
            } catch (error) {
                showErrorMessage('Error al guardar los datos: ' + error.message);
            }
        }
    });

    // Validación de campos individuales
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remover clases de error previas
        field.classList.remove('error');
        
        // Validaciones específicas
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Ingrese un correo electrónico válido');
                return false;
            }
        }
        
        if (field.id === 'cedula' && value) {
            const cedulaRegex = /^\d{9}$/;
            if (!cedulaRegex.test(value)) {
                showFieldError(field, 'La cédula debe tener 9 dígitos');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Ingrese un número de teléfono válido');
                return false;
            }
        }
        
        return true;
    }

    // Mostrar error en campo
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remover mensaje de error previo
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Crear nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }

    // Limpiar error del campo
    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Validación completa del formulario
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Recopilar datos del formulario
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        // Agregar timestamp
        data.fechaRegistro = new Date().toLocaleString('es-CR');
        
        return data;
    }

    // Mostrar resultados
    function displayResults(data) {
        const html = `
            <h4><i class="fas fa-user"></i> Información Personal</h4>
            <p><strong>Cédula:</strong> ${data.cedula}</p>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Teléfono:</strong> ${data.telefono || 'No especificado'}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Dirección:</strong> ${data.direccion || 'No especificada'}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${data.fechaNacimiento || 'No especificada'}</p>
            
            <h4><i class="fas fa-briefcase"></i> Información Profesional</h4>
            <p><strong>Especialidad:</strong> ${getEspecialidadText(data.especialidad)}</p>
            <p><strong>Nivel Académico:</strong> ${getNivelText(data.nivel)}</p>
            <p><strong>Experiencia:</strong> ${data.experiencia || '0'} años</p>
            <p><strong>Estado:</strong> ${getEstadoText(data.estado)}</p>
            
            <h4><i class="fas fa-chalkboard-teacher"></i> Información de Enseñanza</h4>
            <p><strong>Cursos:</strong> ${data.cursos || 'No especificados'}</p>
            <p><strong>Horas Semanales:</strong> ${data.horasSemanales || 'No especificadas'}</p>
            <p><strong>Modalidad:</strong> ${getModalidadText(data.modalidad)}</p>
            
            <h4><i class="fas fa-plus-circle"></i> Información Adicional</h4>
            <p><strong>Certificaciones:</strong> ${data.certificaciones || 'Ninguna especificada'}</p>
            <p><strong>Observaciones:</strong> ${data.observaciones || 'Ninguna'}</p>
            
            <p><strong>Fecha de Registro:</strong> ${data.fechaRegistro}</p>
        `;
        
        resultsContent.innerHTML = html;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Funciones auxiliares para obtener texto de opciones
    function getEspecialidadText(value) {
        const especialidades = {
            'matematicas': 'Matemáticas',
            'espanol': 'Español',
            'ciencias': 'Ciencias',
            'estudios-sociales': 'Estudios Sociales',
            'educacion-fisica': 'Educación Física',
            'artes': 'Artes',
            'ingles': 'Inglés',
            'religion': 'Religión',
            'tecnico': 'Técnico',
            'orientacion': 'Orientación',
            'otro': 'Otro'
        };
        return especialidades[value] || value;
    }

    function getNivelText(value) {
        const niveles = {
            'bachillerato': 'Bachillerato',
            'tecnico': 'Técnico',
            'diplomado': 'Diplomado',
            'licenciatura': 'Licenciatura',
            'maestria': 'Maestría',
            'doctorado': 'Doctorado'
        };
        return niveles[value] || value;
    }

    function getEstadoText(value) {
        const estados = {
            'activo': 'Activo',
            'licencia': 'En Licencia',
            'jubilado': 'Jubilado',
            'contratado': 'Contratado'
        };
        return estados[value] || value;
    }

    function getModalidadText(value) {
        const modalidades = {
            'presencial': 'Presencial',
            'virtual': 'Virtual',
            'hibrida': 'Híbrida'
        };
        return modalidades[value] || value || 'No especificada';
    }

    // Guardar en Google Sheets
    async function saveToGoogleSheets(data) {
        try {
            // Usar JSONP para evitar problemas de CORS
            const scriptUrl = getScriptUrl();
            const formData = new FormData();
            
            // Agregar datos como parámetros de formulario
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
            
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Cambiar a no-cors para evitar problemas de CORS
                body: formData
            });
            
            // Con no-cors no podemos leer la respuesta, pero podemos asumir que funcionó
            // Actualizar la lista de docentes automáticamente
            setTimeout(async () => {
                await loadAllTeachers();
            }, 1000);
            
            return true;
            
        } catch (error) {
            console.error('Error al guardar en Google Sheets:', error);
            
            // Intentar método alternativo con JSONP
            try {
                await saveWithJSONP(data);
                setTimeout(async () => {
                    await loadAllTeachers();
                }, 1000);
                return true;
            } catch (jsonpError) {
                console.error('Error con JSONP:', jsonpError);
                throw error;
            }
        }
    }

    // Método alternativo usando JSONP
    async function saveWithJSONP(data) {
        return new Promise((resolve, reject) => {
            // Crear un callback único
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            
            // Crear script tag
            const script = document.createElement('script');
            script.src = getScriptUrl() + '?callback=' + callbackName + '&data=' + encodeURIComponent(JSON.stringify(data));
            
            // Definir función callback global
            window[callbackName] = function(response) {
                document.head.removeChild(script);
                delete window[callbackName];
                
                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.error || 'Error al guardar'));
                }
            };
            
            // Manejar errores
            script.onerror = function() {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('Error de red al guardar datos'));
            };
            
            // Agregar script al DOM
            document.head.appendChild(script);
            
            // Timeout de 10 segundos
            setTimeout(() => {
                if (window[callbackName]) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('Timeout al guardar datos'));
                }
            }, 10000);
        });
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage() {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Información guardada exitosamente</span>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Función para limpiar formulario
    window.clearForm = function() {
        if (confirm('¿Está seguro de que desea limpiar todos los campos del formulario?')) {
            form.reset();
            resultsSection.style.display = 'none';
            
            // Limpiar errores
            inputs.forEach(input => {
                input.classList.remove('error');
                const errorMessage = input.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
        }
    };

    // Función para llenar datos de prueba
    window.fillTestData = function() {
        if (confirm('¿Desea llenar el formulario con datos de prueba?')) {
            // Datos de prueba para un docente
            const testData = {
                cedula: '123456789',
                nombre: 'María Elena Rodríguez González',
                telefono: '8888-1234',
                email: 'maria.rodriguez@ctpsabalito.edu.cr',
                direccion: 'Sabalito, Coto Brus, Puntarenas',
                fechaNacimiento: '1985-03-15',
                especialidad: 'matematicas',
                nivel: 'licenciatura',
                experiencia: '12',
                estado: 'activo',
                cursos: 'Matemática 7°, Matemática 8°, Álgebra 9°, Geometría 10°',
                horasSemanales: '32',
                modalidad: 'presencial',
                certificaciones: 'Certificación en Matemáticas Avanzadas, Curso de Actualización Pedagógica 2024',
                observaciones: 'Docente con amplia experiencia en educación secundaria. Especialista en metodologías activas de enseñanza de matemáticas.'
            };

            // Llenar todos los campos
            document.getElementById('cedula').value = testData.cedula;
            document.getElementById('nombre').value = testData.nombre;
            document.getElementById('telefono').value = testData.telefono;
            document.getElementById('email').value = testData.email;
            document.getElementById('direccion').value = testData.direccion;
            document.getElementById('fechaNacimiento').value = testData.fechaNacimiento;
            document.getElementById('especialidad').value = testData.especialidad;
            document.getElementById('nivel').value = testData.nivel;
            document.getElementById('experiencia').value = testData.experiencia;
            document.getElementById('estado').value = testData.estado;
            document.getElementById('cursos').value = testData.cursos;
            document.getElementById('horasSemanales').value = testData.horasSemanales;
            document.getElementById('modalidad').value = testData.modalidad;
            document.getElementById('certificaciones').value = testData.certificaciones;
            document.getElementById('observaciones').value = testData.observaciones;

            // Mostrar mensaje de confirmación
            showTestDataMessage();
        }
    };

    // Función para mostrar mensaje de datos de prueba
    function showTestDataMessage() {
        const notification = document.createElement('div');
        notification.className = 'test-data-notification';
        notification.innerHTML = `
            <i class="fas fa-flask"></i>
            <span>Datos de prueba cargados. Puede modificar cualquier campo antes de guardar.</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffc107;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Función para probar la conectividad con Google Apps Script
    window.testConnection = async function() {
        try {
            showLoadingMessage();
            
            const response = await fetch(getScriptUrl(), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage('✅ Conexión exitosa con Google Apps Script');
                console.log('Respuesta del servidor:', result);
            } else {
                showErrorMessage('❌ Error en el servidor: ' + result.error);
            }
            
        } catch (error) {
            console.error('Error de conexión:', error);
            showErrorMessage('❌ Error de conexión: ' + error.message);
            
            // Mostrar información de diagnóstico
            showDiagnosticInfo(error);
        }
    };

    // Función para probar el guardado de datos
    window.testSave = async function() {
        try {
            const testData = {
                cedula: '999999999',
                nombre: 'Prueba de Conexión',
                telefono: '0000-0000',
                email: 'prueba@test.com',
                direccion: 'Dirección de prueba',
                fechaNacimiento: '1990-01-01',
                especialidad: 'matematicas',
                nivel: 'licenciatura',
                experiencia: '1',
                estado: 'activo',
                cursos: 'Curso de prueba',
                horasSemanales: '10',
                modalidad: 'presencial',
                certificaciones: 'Certificación de prueba',
                observaciones: 'Datos de prueba para verificar conexión'
            };

            showLoadingMessage();
            
            const response = await fetch(getScriptUrl(), {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(testData)
            });
            
            // Con no-cors no podemos leer la respuesta, pero podemos asumir que funcionó
            showSuccessMessage('✅ Datos de prueba enviados. Verifica en Google Sheets.');
            
            // Actualizar la lista después de un momento
            setTimeout(async () => {
                await loadAllTeachers();
            }, 2000);
            
        } catch (error) {
            console.error('Error al probar guardado:', error);
            showErrorMessage('❌ Error al probar guardado: ' + error.message);
        }
    };

    // Función para mostrar información de diagnóstico
    function showDiagnosticInfo(error) {
        const diagnosticDiv = document.createElement('div');
        diagnosticDiv.className = 'diagnostic-info';
        diagnosticDiv.innerHTML = `
            <div class="diagnostic-content">
                <h3><i class="fas fa-bug"></i> Información de Diagnóstico</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>URL del Script:</strong> ${getScriptUrl()}</p>
                <p><strong>Configuración:</strong> ${isConfigComplete() ? '✅ Completa' : '❌ Incompleta'}</p>
                <div class="diagnostic-actions">
                    <button onclick="testConnection()" class="btn-test">
                        <i class="fas fa-sync-alt"></i> Reintentar
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-close">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;
        
        diagnosticDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(diagnosticDiv);
    }

    // Función para imprimir resultados
    window.printResults = function() {
        const printContent = resultsContent.innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1 style="text-align: center; color: #333; margin-bottom: 30px;">
                    CTP Sabalito 2025 - ANEXO 7
                </h1>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    ${printContent}
                </div>
            </div>
        `;
        
        window.print();
        document.body.innerHTML = originalContent;
        
        // Recargar la página para restaurar funcionalidad
        location.reload();
    };

    // Función para mostrar mensaje de configuración
    function showConfigAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'config-alert';
        alertDiv.innerHTML = `
            <div class="config-alert-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Configuración Requerida</h3>
                <p>Para que el formulario funcione correctamente, debe configurar la integración con Google Sheets.</p>
                <p>Consulte las instrucciones de configuración en el archivo README.md</p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-close">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        `;
        
        alertDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(alertDiv);
    }

    // Función para mostrar mensaje de carga
    function showLoadingMessage() {
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        submitBtn.disabled = true;
        
        // Restaurar después de 3 segundos como fallback
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }

    // Función para mostrar mensaje de error
    function showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Función para cargar y mostrar todos los docentes
    window.loadAllTeachers = async function() {
        const teachersList = document.getElementById('teachersList');
        
        try {
            // Mostrar indicador de carga
            teachersList.innerHTML = `
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Cargando información de docentes...</span>
                </div>
            `;
            
            // Obtener datos de Google Sheets
            const response = await fetch(getScriptUrl());
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al cargar los datos');
            }
            
            const savedData = result.data || [];
            
            if (savedData.length === 0) {
                teachersList.innerHTML = `
                    <div class="no-teachers">
                        <i class="fas fa-users"></i>
                        <h4>No hay docentes registrados</h4>
                        <p>Los docentes que completen el formulario aparecerán aquí</p>
                    </div>
                `;
                return;
            }

            // Ordenar por nombre
            savedData.sort((a, b) => a.Nombre.localeCompare(b.Nombre));

            let html = '';
            savedData.forEach((teacher, index) => {
                html += `
                    <div class="teacher-card">
                        <div class="teacher-header">
                            <h4 class="teacher-name">${teacher.Nombre}</h4>
                            <span class="teacher-cedula">Cédula: ${teacher.Cédula}</span>
                        </div>
                        <div class="teacher-info">
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Especialidad</span>
                                <span class="teacher-specialty">${getEspecialidadText(teacher.Especialidad)}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Nivel Académico</span>
                                <span class="teacher-info-value">${getNivelText(teacher['Nivel Académico'])}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Experiencia</span>
                                <span class="teacher-info-value">${teacher.Experiencia || '0'} años</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Estado</span>
                                <span class="teacher-info-value">${getEstadoText(teacher.Estado)}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Email</span>
                                <span class="teacher-info-value">${teacher.Email}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Teléfono</span>
                                <span class="teacher-info-value">${teacher.Teléfono || 'No especificado'}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Cursos</span>
                                <span class="teacher-info-value">${teacher.Cursos || 'No especificados'}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Horas Semanales</span>
                                <span class="teacher-info-value">${teacher['Horas Semanales'] || 'No especificadas'}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Modalidad</span>
                                <span class="teacher-info-value">${getModalidadText(teacher.Modalidad)}</span>
                            </div>
                            <div class="teacher-info-item">
                                <span class="teacher-info-label">Fecha de Registro</span>
                                <span class="teacher-info-value">${teacher['Fecha de Registro']}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            teachersList.innerHTML = html;
            
        } catch (error) {
            console.error('Error al cargar docentes:', error);
            teachersList.innerHTML = `
                <div class="no-teachers">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error al cargar los datos</h4>
                    <p>${error.message}</p>
                    <button onclick="loadAllTeachers()" class="btn-refresh">
                        <i class="fas fa-sync-alt"></i> Reintentar
                    </button>
                </div>
            `;
        }
    };

    // Función para exportar a CSV
    window.exportToCSV = async function() {
        try {
            const response = await fetch(getScriptUrl());
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al cargar los datos');
            }
            
            const savedData = result.data || [];
            
            if (savedData.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

        // Crear encabezados CSV
        const headers = [
            'Cédula', 'Nombre', 'Teléfono', 'Email', 'Dirección', 'Fecha de Nacimiento',
            'Especialidad', 'Nivel Académico', 'Experiencia', 'Estado', 'Cursos',
            'Horas Semanales', 'Modalidad', 'Certificaciones', 'Observaciones', 'Fecha de Registro'
        ];

            // Crear filas de datos
            const csvContent = [
                headers.join(','),
                ...savedData.map(teacher => [
                    teacher.Cédula,
                    `"${teacher.Nombre}"`,
                    `"${teacher.Teléfono || ''}"`,
                    `"${teacher.Email}"`,
                    `"${teacher.Dirección || ''}"`,
                    `"${teacher['Fecha de Nacimiento'] || ''}"`,
                    `"${getEspecialidadText(teacher.Especialidad)}"`,
                    `"${getNivelText(teacher['Nivel Académico'])}"`,
                    teacher.Experiencia || '0',
                    `"${getEstadoText(teacher.Estado)}"`,
                    `"${teacher.Cursos || ''}"`,
                    teacher['Horas Semanales'] || '',
                    `"${getModalidadText(teacher.Modalidad)}"`,
                    `"${teacher.Certificaciones || ''}"`,
                    `"${teacher.Observaciones || ''}"`,
                    `"${teacher['Fecha de Registro']}"`
                ].join(','))
            ].join('\n');

            // Crear y descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `docentes_ctp_sabalito_2025_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error al exportar:', error);
            showErrorMessage('Error al exportar los datos: ' + error.message);
        }
    };

    // Función para imprimir todos los docentes
    window.printAllTeachers = async function() {
        try {
            const response = await fetch(getScriptUrl());
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al cargar los datos');
            }
            
            const savedData = result.data || [];
            
            if (savedData.length === 0) {
                alert('No hay datos para imprimir');
                return;
            }

        let printContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1 style="text-align: center; color: #333; margin-bottom: 30px;">
                    CTP Sabalito 2025 - ANEXO 7
                </h1>
                <h2 style="text-align: center; color: #555; margin-bottom: 40px;">
                    Información de Todos los Docentes
                </h2>
        `;

            savedData.forEach((teacher, index) => {
                printContent += `
                    <div style="page-break-inside: avoid; margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                            ${index + 1}. ${teacher.Nombre} - Cédula: ${teacher.Cédula}
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div><strong>Email:</strong> ${teacher.Email}</div>
                            <div><strong>Teléfono:</strong> ${teacher.Teléfono || 'No especificado'}</div>
                            <div><strong>Especialidad:</strong> ${getEspecialidadText(teacher.Especialidad)}</div>
                            <div><strong>Nivel Académico:</strong> ${getNivelText(teacher['Nivel Académico'])}</div>
                            <div><strong>Experiencia:</strong> ${teacher.Experiencia || '0'} años</div>
                            <div><strong>Estado:</strong> ${getEstadoText(teacher.Estado)}</div>
                            <div><strong>Cursos:</strong> ${teacher.Cursos || 'No especificados'}</div>
                            <div><strong>Horas Semanales:</strong> ${teacher['Horas Semanales'] || 'No especificadas'}</div>
                            <div><strong>Modalidad:</strong> ${getModalidadText(teacher.Modalidad)}</div>
                            <div><strong>Fecha de Registro:</strong> ${teacher['Fecha de Registro']}</div>
                        </div>
                        ${teacher.Certificaciones ? `<div style="margin-top: 10px;"><strong>Certificaciones:</strong> ${teacher.Certificaciones}</div>` : ''}
                        ${teacher.Observaciones ? `<div style="margin-top: 10px;"><strong>Observaciones:</strong> ${teacher.Observaciones}</div>` : ''}
                    </div>
                `;
            });

            printContent += `
                    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9rem;">
                        <p>Documento generado el ${new Date().toLocaleString('es-CR')}</p>
                        <p>CTP Sabalito 2025 - ANEXO 7</p>
                    </div>
                </div>
            `;

            const originalContent = document.body.innerHTML;
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
            location.reload();
            
        } catch (error) {
            console.error('Error al imprimir:', error);
            showErrorMessage('Error al cargar los datos para imprimir: ' + error.message);
        }
    };

    // Inicializar
    loadAllTeachers();
});

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-field input.error,
    .form-field select.error,
    .form-field textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
`;
document.head.appendChild(style);
