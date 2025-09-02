# 📋 Instrucciones de Configuración - Google Apps Script

## 🎯 Configuración para GitHub Pages con Google Sheets

Para que el formulario funcione correctamente en GitHub Pages y todos los docentes puedan ver la información de todos los demás, necesitas configurar Google Sheets como base de datos compartida.

### 📝 Paso 1: Crear Google Sheet

1. **Ir a Google Sheets**: Ve a [sheets.google.com](https://sheets.google.com)
2. **Crear nueva hoja**: Haz clic en "Crear una hoja de cálculo en blanco"
3. **Renombrar**: Cambia el nombre a "ANEXO 7 - CTP Sabalito 2025"
4. **Crear pestaña**: Renombra la primera pestaña a "Docentes"
5. **Copiar ID**: Copia el ID de la hoja de la URL (la parte larga entre `/d/` y `/edit`)

### 🔧 Paso 2: Configurar Google Apps Script

1. **Abrir Apps Script**: Ve a [script.google.com](https://script.google.com)
2. **Crear nuevo proyecto**: Haz clic en "Nuevo proyecto"
3. **Renombrar**: Cambia el nombre a "ANEXO 7 - CTP Sabalito"
4. **Copiar código**: Reemplaza todo el código por el contenido del archivo `GoogleAppsScript.gs`
5. **Configurar ID**: En la línea 6, reemplaza `TU_SHEET_ID_AQUI` con el ID de tu hoja
6. **Guardar**: Presiona Ctrl+S para guardar

### 🚀 Paso 3: Desplegar el Script

1. **Desplegar**: Haz clic en "Desplegar" > "Nueva implementación"
2. **Tipo**: Selecciona "Aplicación web"
3. **Configuración**:
   - **Descripción**: "ANEXO 7 - CTP Sabalito 2025"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: "Cualquiera"
4. **Desplegar**: Haz clic en "Desplegar"
5. **Autorizar**: Autoriza los permisos cuando se solicite
6. **Copiar URL**: Copia la URL de la aplicación web

### ⚙️ Paso 4: Configurar el Formulario

1. **Abrir config.js**: Edita el archivo `config.js` en tu proyecto
2. **Reemplazar URL**: En la línea 6, reemplaza `TU_SCRIPT_ID_AQUI` con la URL de tu aplicación web
3. **Guardar**: Guarda el archivo

### 🧪 Paso 5: Probar la Configuración

1. **Inicializar hoja**: En Google Apps Script, ejecuta la función `initializeSheet`
2. **Verificar**: Ve a tu Google Sheet y verifica que se crearon los encabezados
3. **Probar formulario**: Abre el formulario y prueba llenar un registro
4. **Verificar datos**: Ve a Google Sheets y verifica que se guardó la información

### 📊 Estructura de la Hoja de Cálculo

La hoja tendrá las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| Cédula | Cédula de identidad del docente |
| Nombre | Nombre completo |
| Teléfono | Número de teléfono |
| Email | Correo electrónico |
| Dirección | Dirección de residencia |
| Fecha de Nacimiento | Fecha de nacimiento |
| Especialidad | Área de especialización |
| Nivel Académico | Nivel de estudios |
| Experiencia | Años de experiencia |
| Estado | Estado laboral |
| Cursos | Cursos que imparte |
| Horas Semanales | Horas de trabajo semanales |
| Modalidad | Modalidad de trabajo |
| Certificaciones | Certificaciones adicionales |
| Observaciones | Observaciones del docente |
| Fecha de Registro | Fecha y hora de registro |

### 🔒 Permisos y Seguridad

- **Acceso público**: El script permite que cualquiera agregue y vea datos
- **Sin autenticación**: No requiere login para usar el formulario
- **Datos compartidos**: Todos los docentes pueden ver la información de todos

### 🛠️ Solución de Problemas

#### Error: "Script no encontrado"
- Verifica que la URL del script sea correcta
- Asegúrate de que el script esté desplegado como "Aplicación web"

#### Error: "No se pueden acceder a los datos"
- Verifica que el ID de la hoja sea correcto
- Asegúrate de que la hoja tenga permisos de lectura/escritura

#### Error: "Faltan datos requeridos"
- Verifica que todos los campos obligatorios estén llenos
- Revisa que la validación del formulario esté funcionando

### 📱 Uso en GitHub Pages

Una vez configurado:

1. **Subir archivos**: Sube todos los archivos a tu repositorio de GitHub
2. **Activar Pages**: Ve a Settings > Pages y activa GitHub Pages
3. **Compartir link**: Comparte el link con todos los docentes
4. **Usar formulario**: Los docentes pueden llenar el formulario y ver la información de todos

### 🎉 ¡Listo!

Con esta configuración:
- ✅ Todos los docentes pueden ver la información de todos
- ✅ Los datos se guardan en Google Sheets
- ✅ Se puede exportar a Excel
- ✅ Se puede imprimir un reporte completo
- ✅ Funciona en cualquier dispositivo con internet

### 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa que todos los pasos se hayan seguido correctamente
2. Verifica que las URLs y IDs sean correctos
3. Consulta la consola del navegador para errores
4. Contacta al administrador del sistema si es necesario
