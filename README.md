# ANEXO 7 - CTP SABALITO 2025

Formulario web para el seguimiento del funcionamiento académico y desarrollo vocacional de estudiantes, integrado con Google Sheets mediante Google Apps Script.

## 🚀 Características

- **Formulario completo** que replica el ANEXO 7 original
- **Integración con Google Sheets** para almacenamiento de datos
- **Consulta de estudiantes** por número de cédula
- **Interfaz moderna y responsiva** optimizada para dispositivos móviles
- **Validación de formularios** en tiempo real
- **Mensajes de confirmación** para el usuario

## 📋 Estructura del Formulario

### 1. Información del Estudiante
- Nombre completo
- Número de cédula
- Nivel/Grado
- Año académico

### 2. Funcionamiento Académico
- **Español**: Logros, nivel de funcionamiento, docente
- **Matemáticas**: Logros, nivel de funcionamiento, docente
- **Ciencias**: Logros, nivel de funcionamiento, docente
- **Estudios Sociales**: Logros, nivel de funcionamiento, docente
- **Otras asignaturas**: Logros, nivel de funcionamiento, docente

### 3. Desarrollo Vocacional
- Intereses y habilidades (deportivas, creativas, ocupacionales)
- Expectativas vocacionales y laborales
- Habilidades productivas

## 🛠️ Configuración

### Paso 1: Configurar Google Apps Script

1. **Abrir Google Apps Script**
   - Ve a [script.google.com](https://script.google.com)
   - Crea un nuevo proyecto

2. **Copiar el código**
   - Copia todo el contenido del archivo `GoogleAppsScript.gs`
   - Pégalo en el editor de Google Apps Script

3. **Configurar la hoja de cálculo**
   - Asegúrate de que el ID de la hoja en el código coincida con tu Google Sheet
   - El ID está en la URL: `https://docs.google.com/spreadsheets/d/[ID]/edit`

4. **Ejecutar la función de configuración**
   - En el editor, selecciona la función `setupSpreadsheet`
   - Haz clic en "Ejecutar" para crear la estructura de la hoja

5. **Desplegar como aplicación web**
   - Haz clic en "Implementar" → "Nueva implementación"
   - Selecciona "Aplicación web"
   - Configura:
     - **Ejecutar como**: Tu cuenta
     - **Quién tiene acceso**: Cualquier persona
   - Haz clic en "Implementar"
   - Copia la URL de la aplicación web

### Paso 2: Configurar el Formulario Web

1. **Actualizar la URL de Google Apps Script**
   - Abre `script.js`
   - Reemplaza `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` con la URL que obtuviste en el paso anterior

2. **Subir archivos a GitHub**
   - Crea un nuevo repositorio en GitHub
   - Sube los archivos: `index.html`, `style.css`, `script.js`
   - Asegúrate de que `index.html` esté en la raíz del repositorio

3. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - En "Source", selecciona "Deploy from a branch"
   - Selecciona la rama principal (main/master)
   - Guarda la configuración

## 📱 Uso del Sistema

### Enviar Formulario
1. Llena todos los campos requeridos
2. Haz clic en "Guardar Formulario"
3. Los datos se enviarán automáticamente a Google Sheets

### Consultar Estudiante
1. Haz clic en "Consultar Estudiante"
2. Ingresa el número de cédula
3. Haz clic en "Buscar"
4. Se mostrará toda la información del estudiante

### Limpiar Formulario
- Haz clic en "Limpiar Formulario" para resetear todos los campos

## 🔧 Estructura de Datos en Google Sheets

La hoja se organiza en las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| A | Timestamp |
| B | Nombre del Estudiante |
| C | Cédula |
| D | Grado/Nivel |
| E | Año |
| F-H | Español (Logros, Nivel, Docente) |
| I-K | Matemáticas (Logros, Nivel, Docente) |
| L-N | Ciencias (Logros, Nivel, Docente) |
| O-Q | Estudios Sociales (Logros, Nivel, Docente) |
| R-T | Otras (Logros, Nivel, Docente) |
| U | Intereses y Habilidades |
| V | Expectativas Vocacionales |
| W | Habilidades Productivas |

## 🚨 Solución de Problemas

### Error de CORS
- Asegúrate de que Google Apps Script esté configurado correctamente
- Verifica que la URL de la aplicación web sea correcta

### Datos no se guardan
- Revisa la consola del navegador para errores
- Verifica que tienes permisos de escritura en la hoja de Google Sheets
- Asegúrate de que el ID de la hoja sea correcto

### Formulario no se envía
- Verifica que todos los campos requeridos estén completos
- Revisa la conexión a internet
- Confirma que la URL de Google Apps Script sea válida

## 📊 Funciones Adicionales

### Estadísticas
El script incluye una función `getStatistics()` que puedes ejecutar manualmente para obtener:
- Total de estudiantes registrados
- Distribución por grado/nivel
- Última actualización

### Personalización
- Modifica `style.css` para cambiar colores y estilos
- Ajusta `script.js` para agregar validaciones adicionales
- Personaliza `GoogleAppsScript.gs` para modificar la lógica de almacenamiento

## 🔒 Seguridad

- El formulario es público y puede ser usado por cualquier persona
- Los datos se almacenan en tu Google Sheet personal
- Considera implementar autenticación si necesitas restringir el acceso

## 📞 Soporte

Para problemas técnicos o preguntas sobre la implementación:
1. Revisa la consola del navegador para errores
2. Verifica la configuración de Google Apps Script
3. Confirma que todos los archivos estén correctamente subidos

## 📝 Licencia

Este proyecto está diseñado para uso educativo en el CTP SABALITO 2025.

---

**Desarrollado para el sistema educativo costarricense** 🇨🇷
