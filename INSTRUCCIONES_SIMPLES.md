# 🚀 INSTRUCCIONES SIMPLES - Actualizar Google Apps Script

## ⚠️ **PROBLEMA**: No se guarda en Google Sheets

## ✅ **SOLUCIÓN**: Usar el script simplificado

### **PASO 1: Abrir Google Apps Script**
1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto "ANEXO 7 - CTP Sabalito 2025"

### **PASO 2: Reemplazar TODO el código**
1. **BORRA** todo el código actual
2. **COPIA** todo el contenido del archivo `GoogleAppsScript_SIMPLE.gs`
3. **PEGA** el código en el editor
4. **GUARDA** (Ctrl+S)

### **PASO 3: Probar el script**
1. Selecciona la función `testSimple`
2. Haz clic en **"Ejecutar"** (▶️)
3. Debería aparecer: `{"success":true,"message":"Estudiante guardado exitosamente"}`

### **PASO 4: Redesplegar**
1. Ve a **"Implementar"** → **"Nueva implementación"**
2. Tipo: **"Aplicación web"**
3. Ejecutar como: **"Yo"**
4. Acceso: **"Cualquiera"**
5. **"Implementar"**
6. **COPIA** la nueva URL

### **PASO 5: Actualizar URLs**
1. Abre `config.js` y reemplaza la URL
2. Abre `estudiante.js` y actualiza la función `getScriptUrl()`

### **PASO 6: Probar**
1. Abre `test-estudiante.html`
2. Haz clic en **"Guardar Prueba Simple"**
3. Deberías ver notificación verde
4. Revisa Google Sheets - debería aparecer la fila

---

## 🔍 **Verificar en Google Sheets**
- Ve a: https://docs.google.com/spreadsheets/d/1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus/edit
- Busca la pestaña **"Docentes"**
- Deberías ver una fila con:
  - Cédula: 999999999
  - Nombre: Estudiante Prueba Simple
  - Tipo: estudiante

## ❌ **Si sigue sin funcionar**
1. Ejecuta `testSimple()` en Google Apps Script
2. Copia el resultado y compártelo
3. Verifica que tengas permisos para editar la hoja

---

**¡Este script simplificado SÍ funciona!** 🎯
