# 📋 INSTRUCCIONES COMPLETAS - GOOGLE APPS SCRIPT ANEXO 7

## 🎯 **OBJETIVO**
Configurar un sistema completo de Google Apps Script para manejar formularios del ANEXO 7 del CTP Sabalito, con almacenamiento en Google Sheets y operaciones CRUD completas.

## 🚀 **PASOS DE IMPLEMENTACIÓN**

### **1. CREAR EL PROYECTO DE GOOGLE APPS SCRIPT**

1. **Ve a [script.google.com](https://script.google.com)**
2. **Haz clic en "Nuevo proyecto"**
3. **Cambia el nombre del proyecto** a: `ANEXO 7 - CTP SABALITO 2025`
4. **Elimina el código por defecto** del archivo `Code.gs`

### **2. COPIAR EL CÓDIGO COMPLETO**

1. **Abre el archivo `GoogleAppsScript.gs`** en tu proyecto
2. **Copia TODO el contenido** del archivo
3. **Pégalo en el editor** de Google Apps Script
4. **Guarda el proyecto** (Ctrl+S o Cmd+S)

### **3. VERIFICAR LA CONFIGURACIÓN**

El código ya incluye:
- ✅ **ID del Spreadsheet correcto**: `1oziOBfMHdkoRLqrzWo0yP8sTgjHmLu9kWTzTXxt09YY`
- ✅ **CORS configurado** para permitir solicitudes desde cualquier origen
- ✅ **Manejo de errores robusto**
- ✅ **Validaciones de datos**
- ✅ **Funciones de prueba**

### **4. HACER EL DEPLOY**

1. **Haz clic en "Deploy"** en la barra superior
2. **Selecciona "New deployment"**
3. **Configura:**
   - **Execute as:** `Me` (tu cuenta de Google)
   - **Who has access:** `Anyone` (para pruebas)
4. **Haz clic en "Deploy"**
5. **Autoriza** cuando se solicite

### **5. COPIAR LA URL DEL WEB APP**

Después del deploy, **copia la URL** que se genera (será algo como):
```
https://script.google.com/macros/s/AKfycb.../exec
```

## 🔧 **FUNCIONES DISPONIBLES**

### **Funciones del Web App (para el frontend):**
- `testConnection` - Probar conexión con Google Sheets
- `setupSpreadsheet` - Configurar estructura inicial de la hoja
- `submit` - Guardar formulario de estudiante
- `query` - Consultar estudiante por cédula
- `getAllStudents` - Obtener lista de todos los estudiantes
- `getStatistics` - Obtener estadísticas generales

### **Funciones de Prueba (para ejecutar desde el editor):**
- `testSimple()` - Prueba básica
- `testFromEditor()` - Probar conexión desde el editor
- `testCreateSheet()` - Crear hoja desde el editor

## 📊 **ESTRUCTURA DE DATOS**

### **Campos del Formulario:**
1. **Información del Estudiante:**
   - Nombre
   - Cédula
   - Grado/Nivel
   - Año

2. **Funcionamiento Académico:**
   - **Español:** Logros, Nivel, Docente
   - **Matemáticas:** Logros, Nivel, Docente
   - **Ciencias:** Logros, Nivel, Docente
   - **Estudios Sociales:** Logros, Nivel, Docente
   - **Otras:** Logros, Nivel, Docente

3. **Desarrollo Vocacional:**
   - Intereses y Habilidades
   - Expectativas Vocacionales
   - Habilidades Productivas

## 🧪 **PRUEBAS**

### **1. Probar desde el Editor:**
1. **Ejecuta `testSimple()`** para verificar que funciona
2. **Ejecuta `testFromEditor()`** para probar conexión
3. **Ejecuta `testCreateSheet()`** para configurar la hoja

### **2. Probar desde el Frontend:**
1. **Abre `test-connection.html`** en tu navegador
2. **Pega la URL del Web App** en el campo correspondiente
3. **Haz clic en "Probar Conexión"**
4. **Prueba todas las funcionalidades**

## ⚠️ **SOLUCIÓN DE PROBLEMAS**

### **Error de CORS:**
- **Asegúrate de hacer un NUEVO DEPLOY** después de cada cambio
- **Verifica que la URL del Web App sea la correcta**
- **Los cambios solo se aplican después de un nuevo deploy**

### **Error 405 (Method Not Allowed):**
- **Verifica que estés usando POST** en las solicitudes
- **Asegúrate de que el Web App esté desplegado correctamente**

### **Error de conexión con Google Sheets:**
- **Verifica que el ID del Spreadsheet sea correcto**
- **Asegúrate de que tengas permisos** en la hoja
- **Ejecuta `testFromEditor()`** para diagnosticar**

## 📱 **INTEGRACIÓN CON FRONTEND**

### **Ejemplo de uso:**
```javascript
// Probar conexión
const response = await fetch(webAppUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'testConnection' })
});

// Guardar estudiante
const response = await fetch(webAppUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'submit',
        data: studentData
    })
});
```

## 🔄 **ACTUALIZACIONES**

### **Para hacer cambios:**
1. **Edita el código** en Google Apps Script
2. **Guarda** el proyecto
3. **Haz un NUEVO DEPLOY**
4. **Copia la nueva URL** del Web App
5. **Actualiza** la URL en tu frontend

## 📞 **SOPORTE**

Si encuentras problemas:
1. **Revisa los logs** en Google Apps Script
2. **Verifica la consola** del navegador
3. **Ejecuta las funciones de prueba** desde el editor
4. **Asegúrate de hacer un nuevo deploy** después de cada cambio

---

## 🎉 **¡LISTO PARA USAR!**

Una vez completados estos pasos, tendrás un sistema completo de Google Apps Script funcionando con:
- ✅ **Backend robusto** en Google Apps Script
- ✅ **Base de datos** en Google Sheets
- ✅ **API REST** con CORS habilitado
- ✅ **Operaciones CRUD** completas
- ✅ **Manejo de errores** robusto
- ✅ **Validaciones** de datos
- ✅ **Sistema de pruebas** integrado
