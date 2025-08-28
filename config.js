// Configuración para ANEXO 7 - CTP SABALITO 2025
const config = {
    SPREADSHEET_ID: '1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus',
    SHEET_NAME: 'Hoja 1',
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbysRAs_Swk0mJVSmq0LrMrTLarDfKwJMAkNNKh5ZZcKbBNpdhinqtS02ouvsrMtWIC1VA/exec'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

// Para uso en navegador
if (typeof window !== 'undefined') {
    window.config = config;
}
