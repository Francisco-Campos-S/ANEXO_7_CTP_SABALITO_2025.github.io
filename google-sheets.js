// Clase para manejar la integración con Google Sheets a través de Google Apps Script
class GoogleSheetsManager {
    constructor() {
        this.isConnected = false;
        this.currentSpreadsheetId = null;
        this.currentSheetName = null;
        this.webAppUrl = null;
    }

    // Inicializar el manager
    async init() {
        try {
            // Usar configuración del archivo config.js
            this.webAppUrl = CONFIG.GOOGLE_APPS_SCRIPT.WEB_APP_URL;
            this.currentSpreadsheetId = CONFIG.GOOGLE_APPS_SCRIPT.SPREADSHEET_ID;
            this.currentSheetName = CONFIG.GOOGLE_APPS_SCRIPT.SHEET_NAME;
            
            console.log('Google Apps Script Manager inicializado');
            return true;
        } catch (error) {
            console.error('Error al inicializar Google Apps Script Manager:', error);
            throw error;
        }
    }

    // Realizar petición HTTP al Web App de Google Apps Script
    async makeRequest(action, data = {}) {
        try {
            const requestData = {
                action: action,
                ...data
            };

            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || result.error || 'Error desconocido');
            }

            return result;
        } catch (error) {
            console.error(`Error en petición ${action}:`, error);
            throw error;
        }
    }

    // Probar conexión con Google Sheets
    async testConnection() {
        try {
            const response = await this.makeRequest('testConnection');
            if (response.success) {
                this.isConnected = true;
                return response.data;
            } else {
                throw new Error(response.message || 'Error en la conexión');
            }
        } catch (error) {
            console.error('Error al probar conexión:', error);
            throw error;
        }
    }

    // Conectar a la hoja de cálculo
    async connectToSpreadsheet(spreadsheetId, sheetName) {
        try {
            // Actualizar configuración local
            this.currentSpreadsheetId = spreadsheetId;
            this.currentSheetName = sheetName;
            
            // Probar conexión
            const connectionResult = await this.testConnection();
            this.isConnected = true;
            
            console.log(`Conectado exitosamente a: ${sheetName} en ${spreadsheetId}`);
            return connectionResult;
        } catch (error) {
            console.error('Error al conectar a la hoja:', error);
            throw error;
        }
    }

    // Guardar datos de un estudiante
    async saveStudentData(studentData) {
        try {
            if (!this.isConnected) {
                throw new Error('No hay conexión activa con Google Sheets');
            }

            const response = await this.makeRequest('saveStudent', { studentData });
            console.log('Estudiante guardado exitosamente');
            return response.data;
        } catch (error) {
            console.error('Error al guardar estudiante:', error);
            throw error;
        }
    }

    // Actualizar datos de un estudiante existente
    async updateStudentData(studentId, studentData) {
        try {
            if (!this.isConnected) {
                throw new Error('No hay conexión activa con Google Sheets');
            }

            const response = await this.makeRequest('updateStudent', { 
                studentId, 
                studentData 
            });
            console.log('Estudiante actualizado exitosamente');
            return response.data;
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            throw error;
        }
    }

    // Eliminar un estudiante
    async deleteStudent(studentId) {
        try {
            if (!this.isConnected) {
                throw new Error('No hay conexión activa con Google Sheets');
            }

            const response = await this.makeRequest('deleteStudent', { studentId });
            console.log('Estudiante eliminado exitosamente');
            return response.data;
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            throw error;
        }
    }

    // Obtener todos los estudiantes
    async getAllStudents() {
        try {
            if (!this.isConnected) {
                throw new Error('No hay conexión activa con Google Sheets');
            }

            const response = await this.makeRequest('getAllStudents');
            const students = response.data || [];
            
            // Convertir datos de la hoja a objetos de estudiantes
            const formattedStudents = students.map(student => {
                const formattedStudent = {};
                
                // Mapear campos de la hoja a nombres del formulario
                Object.keys(FIELD_MAPPING).forEach(formField => {
                    const sheetHeader = FIELD_MAPPING[formField];
                    if (student[sheetHeader] !== undefined) {
                        formattedStudent[formField] = student[sheetHeader];
                    }
                });
                
                // Agregar ID del estudiante
                formattedStudent.id = student['ID'] || student['Nombre Estudiante'];
                
                return formattedStudent;
            });

            console.log(`${formattedStudents.length} estudiantes cargados`);
            return formattedStudents;
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            throw error;
        }
    }

    // Obtener un estudiante específico
    async getStudent(studentId) {
        try {
            if (!this.isConnected) {
                throw new Error('No hay conexión activa con Google Sheets');
            }

            const response = await this.makeRequest('getStudent', { studentId });
            const student = response.data;
            
            // Convertir datos de la hoja a formato del formulario
            const formattedStudent = {};
            Object.keys(FIELD_MAPPING).forEach(formField => {
                const sheetHeader = FIELD_MAPPING[formField];
                if (student[sheetHeader] !== undefined) {
                    formattedStudent[formField] = student[sheetHeader];
                }
            });
            
            formattedStudent.id = student['ID'] || student['Nombre Estudiante'];
            
            return formattedStudent;
        } catch (error) {
            console.error('Error al obtener estudiante:', error);
            throw error;
        }
    }

    // Verificar si está autenticado (para compatibilidad con código existente)
    get isAuthenticated() {
        return this.isConnected;
    }

    // Mostrar mensaje de estado
    showStatus(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsManager;
}
