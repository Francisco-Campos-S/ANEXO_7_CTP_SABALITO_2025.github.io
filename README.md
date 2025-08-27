# Sistema de Gestión Estudiantil - CTP Sabalito

Sistema web para gestionar información académica y vocacional de estudiantes del CTP Sabalito, diseñado para funcionar en GitHub Pages.

## 🚀 Características

- **Formulario completo** para registro de estudiantes
- **Gestión académica** con evaluación por asignaturas
- **Desarrollo vocacional** con seguimiento de intereses y habilidades
- **Búsqueda y consulta** de estudiantes registrados
- **Almacenamiento local** usando localStorage del navegador
- **Interfaz responsiva** que funciona en dispositivos móviles
- **Diseño moderno** con gradientes y animaciones

## 📋 Funcionalidades

### 1. Registro de Estudiantes
- Información básica del estudiante
- Evaluación académica por asignaturas:
  - Español
  - Matemáticas
  - Ciencias
  - Estudios Sociales
  - Otras asignaturas personalizables
- Niveles de funcionamiento académico
- Registro de docentes por asignatura

### 2. Desarrollo Vocacional
- Intereses y habilidades deportivas
- Intereses y habilidades creativas
- Intereses y habilidades ocupacionales
- Intereses y habilidades vocacionales
- Expectativas vocacionales y laborales

### 3. Consulta y Búsqueda
- Búsqueda por nombre o ID del estudiante
- Vista de todos los estudiantes registrados
- Detalles completos de cada estudiante
- Opción de eliminación de registros

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript ES6+** - Funcionalidad completa del sistema
- **Font Awesome** - Iconos para la interfaz
- **Google Fonts** - Tipografía Inter para mejor legibilidad

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles y tablets
- ✅ GitHub Pages
- ✅ Funciona offline (datos almacenados localmente)

## 🚀 Instalación y Uso

### Opción 1: GitHub Pages (Recomendado)
1. Haz fork de este repositorio
2. Activa GitHub Pages en la configuración del repositorio
3. El sistema estará disponible en `https://tuusuario.github.io/nombre-repositorio`

### Opción 2: Uso Local
1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Listo para usar!

## 📖 Instrucciones de Uso

### Registrando un Nuevo Estudiante
1. Haz clic en "Nuevo Estudiante"
2. Completa la información básica (campos obligatorios marcados con *)
3. Llena la evaluación académica para cada asignatura
4. Completa la información vocacional
5. Haz clic en "Guardar Estudiante"

### Consultando Estudiantes
1. Haz clic en "Consultar Estudiantes"
2. Usa la barra de búsqueda para encontrar estudiantes específicos
3. Haz clic en "Mostrar Todos" para ver todos los registros
4. Haz clic en cualquier tarjeta de estudiante para ver detalles completos

### Niveles Académicos
- **Excelente**: Rendimiento sobresaliente
- **Muy Bueno**: Rendimiento muy satisfactorio
- **Bueno**: Rendimiento satisfactorio
- **Regular**: Rendimiento básico
- **Necesita Mejorar**: Rendimiento por debajo del esperado

## 💾 Almacenamiento de Datos

- Los datos se guardan en el **localStorage** del navegador
- Los datos persisten entre sesiones
- **Importante**: Los datos se almacenan localmente en cada dispositivo
- Para respaldo, se recomienda exportar los datos regularmente

## 🔧 Personalización

### Cambiar Colores
Edita el archivo `styles.css` y modifica las variables de color:
```css
/* Cambiar el gradiente principal */
body {
    background: linear-gradient(135deg, #tu-color-1 0%, #tu-color-2 100%);
}
```

### Agregar Nuevas Asignaturas
Edita el archivo `index.html` y agrega nuevas filas en la tabla de asignaturas.

### Modificar Campos Vocacionales
Edita la sección de desarrollo vocacional en `index.html` y `script.js`.

## 📱 Responsive Design

El sistema se adapta automáticamente a diferentes tamaños de pantalla:
- **Desktop**: Vista completa con tabla de asignaturas horizontal
- **Tablet**: Diseño adaptado con elementos reorganizados
- **Móvil**: Vista vertical optimizada para pantallas pequeñas

## 🚨 Consideraciones Importantes

1. **Datos Locales**: La información se guarda solo en el dispositivo del usuario
2. **Sin Servidor**: No requiere base de datos o servidor web
3. **Límite de Almacenamiento**: localStorage tiene límites (generalmente 5-10MB)
4. **Respaldo**: Exporta regularmente los datos para respaldo

## 🔮 Funcionalidades Futuras

- [ ] Exportación a PDF
- [ ] Sincronización con Google Drive
- [ ] Múltiples años académicos
- [ ] Reportes y estadísticas
- [ ] Sistema de usuarios y permisos

## 📞 Soporte

Para reportar problemas o sugerir mejoras:
1. Crea un issue en GitHub
2. Describe el problema o sugerencia
3. Incluye detalles del navegador y dispositivo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🙏 Agradecimientos

- CTP Sabalito por la confianza
- Comunidad de desarrolladores web
- Contribuidores del proyecto

---

**Desarrollado con ❤️ para la comunidad educativa del CTP Sabalito**
