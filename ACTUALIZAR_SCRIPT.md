# 🔧 Actualizar Google Apps Script

## ⚠️ **IMPORTANTE: Debes actualizar el Google Apps Script**

He corregido varios errores en el código del Google Apps Script. Necesitas actualizar el script en Google Apps Script para que funcione correctamente.

## 📋 **Pasos para Actualizar**

### 1. **Abrir Google Apps Script**
- Ve a [script.google.com](https://script.google.com)
- Abre tu proyecto "ANEXO 7 - CTP Sabalito 2025"

### 2. **Reemplazar el Código**
- Copia todo el contenido del archivo `GoogleAppsScript.gs` de este proyecto
- Pega el código completo en el editor de Google Apps Script
- **Guarda** el proyecto (Ctrl+S)

### 3. **Ejecutar Función de Prueba**
- En el editor, selecciona la función `testStudentSave`
- Haz clic en **"Ejecutar"** (▶️)
- Autoriza los permisos si es necesario
- Verifica que aparezca: `{"success":true,"message":"Estudiante agregado exitosamente"}`

### 4. **Redesplegar la Aplicación Web**
- Ve a **"Implementar"** → **"Nueva implementación"**
- Tipo: **"Aplicación web"**
- Ejecutar como: **"Yo"**
- Quién tiene acceso: **"Cualquiera"**
- Haz clic en **"Implementar"**
- **Copia la nueva URL** que aparece

### 5. **Actualizar la URL en el Proyecto**
- Abre el archivo `config.js` en tu proyecto
- Reemplaza la URL antigua con la nueva URL del paso 4
- También actualiza la URL en `estudiante.js` (función `getScriptUrl()`)

## 🧪 **Probar el Sistema**

### Opción 1: Página de Prueba
1. Abre `test-estudiante.html` en tu navegador
2. Haz clic en **"Guardar Prueba Simple"**
3. Deberías ver notificación verde: "¡Prueba simple enviada exitosamente!"

### Opción 2: Formulario Original
1. Abre `estudiante.html`
2. Haz clic en **"Nuevo Estudiante"**
3. Haz clic en **"Guardar Prueba Simple"** (botón morado)
4. Deberías ver notificación verde

## 🔍 **Verificar en Google Sheets**

1. Ve a tu hoja de cálculo: [Google Sheets](https://docs.google.com/spreadsheets/d/1I3_cpVR8wvAwXFWuXgJEkUf8bEuARwuq6p5JaDbbfus/edit)
2. Busca la pestaña **"Docentes"**
3. Deberías ver una nueva fila con:
   - Cédula: 999999999
   - Nombre: Estudiante Prueba Simple
   - Grado: 11°
   - Sección: A
   - Tipo: estudiante

## ❌ **Si No Funciona**

1. **Verifica la URL**: Asegúrate de que la URL en `config.js` y `estudiante.js` sea la correcta
2. **Revisa permisos**: El script debe tener permisos para editar la hoja de cálculo
3. **Ejecuta `initializeSheet()`**: En Google Apps Script, ejecuta esta función para crear los encabezados
4. **Revisa la consola**: Presiona F12 en el navegador y ve si hay errores

## 📞 **Soporte**

Si sigues teniendo problemas:
1. Ejecuta `testStudentSave()` en Google Apps Script
2. Copia el resultado y compártelo
3. Revisa los logs en la consola del navegador (F12)

---

**¡Una vez actualizado, el sistema debería funcionar perfectamente!** 🚀
