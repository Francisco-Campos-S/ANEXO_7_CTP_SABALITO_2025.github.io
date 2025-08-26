# INSTRUCCIONES PARA CONFIGURAR GOOGLE APPS SCRIPT

## 🚀 Configuración del Backend (Google Apps Script)

### Paso 1: Crear el Proyecto de Google Apps Script

1. **Ir a Google Apps Script:**
   - Abre [script.google.com](https://script.google.com)
   - Inicia sesión con tu cuenta de Google

2. **Crear Nuevo Proyecto:**
   - Haz clic en "Nuevo proyecto"
   - Nombra el proyecto como `ANEXO7_Backend`
   - Haz clic en "Crear"

3. **Copiar el Código:**
   - Elimina todo el código existente
   - Copia y pega el contenido completo del archivo `google-apps-script.js`
   - Haz clic en "Guardar" (Ctrl+S)

### Paso 2: Configurar Permisos

1. **Habilitar Servicios:**
   - En el panel izquierdo, haz clic en "Servicios" (+)
   - Busca y agrega "Google Sheets API"
   - Haz clic en "Agregar"

2. **Configurar Permisos:**
   - Haz clic en "Ejecutar" (▶️) en la barra de herramientas
   - Selecciona tu cuenta de Google
   - Haz clic en "Avanzado" → "Ir a [Nombre del proyecto] (no seguro)"
   - Haz clic en "Permitir"

### Paso 3: Desplegar como Web App

1. **Configurar Despliegue:**
   - Haz clic en "Desplegar" → "Nueva implementación"
   - Selecciona "Tipo: Aplicación web"
   - Configura:
     - **Descripción:** `ANEXO7_Backend_v1`
     - **Ejecutar como:** `Yo`
     - **Quién tiene acceso:** `Cualquier persona` (para pruebas) o `Cualquier persona con cuenta de Google` (para producción)

2. **Desplegar:**
   - Haz clic en "Desplegar"
   - Haz clic en "Autorizar acceso"
   - Selecciona tu cuenta y permite los permisos
   - Copia la **URL del Web App** (se verá como: `https://script.google.com/macros/s/.../exec`)

### Paso 4: Configurar el Frontend

1. **Actualizar config.js:**
   - Abre el archivo `config.js`
   - Encuentra la línea: `WEB_APP_URL: ''`
   - Reemplaza las comillas vacías con la URL del Web App que copiaste

   ```javascript
   const GOOGLE_APPS_SCRIPT_CONFIG = {
       SPREADSHEET_ID: '1Bn-_gSDE4graJk4-Vo_FxUJtSzD8FbCfFQ2mfWwvohM',
       SHEET_NAME: 'ANEXO7_Estudiantes',
       WEB_APP_URL: 'https://script.google.com/macros/s/TU_ID_AQUI/exec', // ← Pega tu URL aquí
       APP_NAME: 'ANEXO 7 - Sistema de Gestión Estudiantil',
       APP_VERSION: '1.0.0'
   };
   ```

2. **Verificar Permisos de la Hoja:**
   - Asegúrate de que tu cuenta de Google tenga acceso de **Editor** a la hoja de cálculo
   - La hoja debe estar compartida con tu cuenta o ser pública

## 🔧 Funcionalidades Disponibles

### Operaciones CRUD:
- ✅ **Crear** nuevos estudiantes
- ✅ **Leer** todos los estudiantes
- ✅ **Actualizar** estudiantes existentes
- ✅ **Eliminar** estudiantes
- ✅ **Buscar** estudiantes por ID

### Características:
- 🔄 **Sincronización automática** con Google Sheets
- 📊 **Estructura de datos organizada** con encabezados automáticos
- 🆔 **IDs únicos** para cada estudiante
- 📅 **Timestamps** de creación y modificación
- 🖨️ **Impresión individual** por estudiante
- 📁 **Exportación** de todos los estudiantes

## 🧪 Probar la Configuración

1. **Abrir la aplicación:**
   - Abre `index.html` en tu navegador

2. **Probar conexión:**
   - Haz clic en "Probar Conexión"
   - Deberías ver "Conexión exitosa"

3. **Crear estudiante de prueba:**
   - Llena el formulario con datos de prueba
   - Haz clic en "Guardar"
   - Verifica que aparezca en la lista de estudiantes

## 🚨 Solución de Problemas

### Error: "URL del Web App no configurada"
- **Solución:** Verifica que hayas copiado la URL completa en `config.js`

### Error: "Error de conexión"
- **Solución:** 
  - Verifica que la URL sea correcta
  - Asegúrate de que el Web App esté desplegado
  - Verifica los permisos de la hoja de cálculo

### Error: "No se puede acceder a la hoja"
- **Solución:**
  - Verifica que tengas permisos de Editor en la hoja
  - Asegúrate de que la hoja esté compartida con tu cuenta

### Error: "CORS policy"
- **Solución:** 
  - El Web App debe estar configurado como público
  - Verifica la configuración de "Quién tiene acceso"

## 📱 Uso de la Aplicación

### Flujo de Trabajo:
1. **Configurar:** Establecer la URL del Web App
2. **Conectar:** Probar la conexión
3. **Crear:** Llenar formulario y guardar estudiante
4. **Gestionar:** Cargar, editar o eliminar estudiantes
5. **Imprimir:** Generar reportes individuales

### Campos Requeridos:
- Institución
- Nombre del Estudiante
- Edad
- Nivel que Cursa
- Cédula
- Fecha de Nacimiento
- Nombre del Encargado
- Firma del Docente
- Firma del Encargado

## 🔒 Seguridad

- ✅ **Sin credenciales expuestas** en el frontend
- ✅ **Autenticación** a través de Google Apps Script
- ✅ **Permisos granulares** por usuario
- ✅ **Logs de auditoría** en Google Apps Script

## 📞 Soporte

Si encuentras problemas:
1. Verifica la consola del navegador (F12)
2. Revisa los logs en Google Apps Script
3. Verifica que todos los pasos de configuración estén completos

---

**¡Tu sistema ANEXO 7 está listo para usar con Google Sheets! 🎉**
