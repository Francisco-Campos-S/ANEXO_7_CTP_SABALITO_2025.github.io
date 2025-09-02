# ANEXO 7 - CTP Sabalito 2025

## Formulario de Información Docente

Este proyecto contiene un formulario web moderno y responsivo para la recopilación de información del personal docente del Colegio Técnico Profesional Sabalito para el año académico 2025.

### 🎯 Características

- **Formulario Completo**: Recopila información personal, profesional y académica de los docentes
- **Diseño Moderno**: Interfaz atractiva con gradientes y efectos visuales
- **Responsivo**: Funciona perfectamente en dispositivos móviles, tablets y escritorio
- **Validación en Tiempo Real**: Validación de campos con retroalimentación inmediata
- **Almacenamiento Local**: Los datos se guardan en el navegador del usuario
- **Funcionalidad de Impresión**: Permite imprimir los resultados del formulario
- **Accesible**: Diseño accesible con iconos y colores apropiados

### 📋 Campos del Formulario

#### Información Personal
- Cédula de Identidad (obligatorio)
- Nombre Completo (obligatorio)
- Teléfono
- Correo Electrónico (obligatorio)
- Dirección
- Fecha de Nacimiento

#### Información Profesional
- Especialidad/Área (obligatorio)
- Nivel Académico (obligatorio)
- Años de Experiencia
- Estado Laboral (obligatorio)

#### Información de Enseñanza
- Cursos que Imparte
- Horas Semanales
- Modalidad de Trabajo

#### Información Adicional
- Certificaciones o Cursos Adicionales
- Observaciones

### 🚀 Cómo Usar

1. **Acceder al Formulario**: Abra el archivo `index.html` en cualquier navegador web
2. **Completar Información**: Llene todos los campos obligatorios (marcados con *)
3. **Validación**: El sistema validará automáticamente los datos ingresados
4. **Guardar**: Haga clic en "Guardar Información" para procesar los datos
5. **Revisar**: Los datos se mostrarán en una sección de resultados
6. **Imprimir**: Use el botón "Imprimir" si necesita una copia física

### 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica del formulario
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Funcionalidad interactiva y validación
- **Font Awesome**: Iconos para mejorar la experiencia visual
- **LocalStorage**: Almacenamiento de datos en el navegador

### 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móviles (iOS/Android)

### 🎨 Características de Diseño

- **Paleta de Colores**: Gradiente azul-púrpura profesional
- **Tipografía**: Segoe UI para mejor legibilidad
- **Animaciones**: Transiciones suaves y efectos hover
- **Layout**: Grid responsivo para organización óptima
- **Accesibilidad**: Contraste adecuado y navegación por teclado

### 📊 Funcionalidades Técnicas

- **Validación de Formularios**: 
  - Campos obligatorios
  - Formato de email
  - Formato de cédula (9 dígitos)
  - Formato de teléfono
- **Almacenamiento**: Los datos se guardan en localStorage del navegador
- **Impresión**: Función de impresión optimizada para documentos
- **Responsive Design**: Adaptación automática a diferentes tamaños de pantalla

### 🔧 Instalación y Configuración

#### Configuración Inicial (REQUERIDA)

**IMPORTANTE**: Antes de usar el formulario, debe configurar Google Sheets como base de datos compartida.

1. **Seguir instrucciones**: Consulte `INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md` para la configuración completa
2. **Configurar Google Sheets**: Crear una hoja de cálculo y configurar Google Apps Script
3. **Actualizar config.js**: Reemplazar la URL del script en el archivo `config.js`
4. **Probar configuración**: Verificar que el formulario funcione correctamente

#### Uso Local

1. **Clonar o Descargar**: Obtenga los archivos del proyecto
2. **Configurar**: Complete la configuración de Google Sheets
3. **Servir Localmente**: 
   ```bash
   # Opción 1: Servidor Python
   python -m http.server 8000
   
   # Opción 2: Servidor Node.js
   npx serve .
   
   # Opción 3: Abrir directamente
   # Simplemente abra index.html en su navegador
   ```
4. **Acceder**: Navegue a `http://localhost:8000` o abra el archivo directamente

### 🌐 GitHub Pages

Este proyecto está configurado para funcionar con GitHub Pages:

1. **Repositorio**: Asegúrese de que el repositorio esté configurado como público
2. **Configuración**: Vaya a Settings > Pages en su repositorio de GitHub
3. **Fuente**: Seleccione "Deploy from a branch" y elija "main"
4. **Carpeta**: Seleccione "/ (root)" como carpeta de origen
5. **Acceso**: Su sitio estará disponible en `https://[usuario].github.io/[repositorio]`

### 📝 Notas Importantes

- **Base de Datos Compartida**: Los datos se almacenan en Google Sheets para que todos los docentes puedan ver la información de todos
- **Configuración Requerida**: Debe configurar Google Apps Script antes de usar el formulario
- **Acceso Público**: Todos los docentes pueden ver y agregar información
- **Sin Autenticación**: No requiere login para usar el formulario
- **Instrucciones**: Consulte `INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md` para la configuración

### 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Cree una rama para su feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit sus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abra un Pull Request

### 📄 Licencia

Este proyecto está desarrollado para el Colegio Técnico Profesional Sabalito y está destinado para uso educativo e institucional.

### 📞 Soporte

Para soporte técnico o consultas sobre el formulario, contacte al administrador del sistema del CTP Sabalito.

---

**Desarrollado para CTP Sabalito 2025**  
*Formulario ANEXO 7 - Recopilación de Información Docente*
