// Configuración básica del sistema ANEXO 7
const CONFIG = {
    // Configuración de Google Apps Script
    GOOGLE_APPS_SCRIPT: {
        SPREADSHEET_ID: '1Bn-_gSDE4graJk4-Vo_FxUJtSzD8FbCfFQ2mfWwvohM',
        SHEET_NAME: 'ANEXO7_Estudiantes',
        WEB_APP_URL: 'TU_NUEVA_URL_AQUI' // ⚠️ Pega aquí la nueva URL del Web App
    },
    
    // Configuración de la aplicación
    APP: {
        NAME: 'ANEXO 7 - Sistema de Gestión Estudiantil',
        VERSION: '1.0.0'
    }
};

// Campos requeridos del formulario
const REQUIRED_FIELDS = [
    'institucion', 'estudiante', 'edad', 'nivel', 'cedula', 
    'fechaNacimiento', 'encargado', 'firmaDocente', 'firmaEncargado'
];

// Mapeo de campos del formulario a encabezados de Google Sheets
const FIELD_MAPPING = {
    'institucion': 'Institución',
    'circuito': 'Circuito Escolar',
    'estudiante': 'Nombre Estudiante',
    'edad': 'Edad',
    'nivel': 'Nivel que Cursa',
    'cedula': 'Cédula',
    'fechaNacimiento': 'Fecha Nacimiento',
    'direccion': 'Dirección',
    'encargado': 'Nombre Encargado',
    'condicionSalud': 'Condición General de Salud',
    'condicionFisica': 'Condición Física y Movilidad',
    'desarrolloSocial': 'Desarrollo Socio Afectivo',
    'aspectosFamilia': 'Aspectos Familia y Comunidad',
    'comunicacion': 'Comunicación y Lenguaje',
    'estilosAprendizaje': 'Estilos de Aprendizaje',
    'ritmoAprendizaje': 'Ritmo de Aprendizaje',
    'memoria': 'Memoria',
    'atencion': 'Atención y Concentración',
    'razonamiento': 'Razonamiento',
    'agrupamientos': 'Tipo de Agrupamientos',
    'materiales': 'Materiales y Apoyos',
    'logrosEspanol': 'Logros Español',
    'nivelEspanol': 'Nivel Español',
    'firmaEspanol': 'Firma Español',
    'logrosMatematicas': 'Logros Matemáticas',
    'nivelMatematicas': 'Nivel Matemáticas',
    'firmaMatematicas': 'Firma Matemáticas',
    'logrosCiencias': 'Logros Ciencias',
    'nivelCiencias': 'Nivel Ciencias',
    'firmaCiencias': 'Firma Ciencias',
    'logrosEstudiosSoc': 'Logros Estudios Sociales',
    'nivelEstudiosSoc': 'Nivel Estudios Sociales',
    'firmaEstudiosSoc': 'Firma Estudios Sociales',
    'logrosOtras': 'Logros Otras',
    'nivelOtras': 'Nivel Otras',
    'firmaOtras': 'Firma Otras',
    'desarrolloVocacional': 'Desarrollo Vocacional',
    'firmaDocente': 'Firma Docente Solicitante',
    'firmaEncargado': 'Firma Encargado Legal'
};
