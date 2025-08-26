# ANEXO 7: Trámite de Apoyo Curricular Significativo

## Descripción

Este repositorio contiene un formulario web moderno y responsivo para el **ANEXO 7: Trámite de Apoyo Curricular Significativo, Informe Integral del Proceso Educativo del Estudiante**.

El formulario está diseñado para ser desplegado en GitHub Pages y permite a los docentes completar de manera digital la información integral de los estudiantes que requieren apoyo curricular significativo.

## Características

### ✨ Funcionalidades Principales
- **Formulario completo** basado en el ANEXO 7 oficial
- **Diseño responsivo** que se adapta a todos los dispositivos
- **Auto-guardado** automático en el navegador
- **Validación en tiempo real** de campos requeridos
- **Exportación de datos** en formato JSON
- **Función de impresión** optimizada
- **Interfaz moderna** con animaciones suaves

### 📱 Diseño Responsivo
- **Desktop**: Layout de dos columnas para mejor aprovechamiento del espacio
- **Tablet**: Adaptación automática a pantallas medianas
- **Mobile**: Diseño optimizado para dispositivos móviles
- **Impresión**: Estilos especiales para impresión profesional

### 🔒 Validaciones
- Campos requeridos marcados automáticamente
- Validación de formato de cédula costarricense (9 dígitos)
- Validación de rango de edad (0-25 años)
- Indicadores visuales de estado de los campos

## Estructura del Formulario

### 1. Información del Estudiante
- Institución y circuito escolar
- Datos personales del estudiante
- Información del encargado legal

### 2. Columna Izquierda
- **Condición General de Salud**: Nutrición, capacidad visual/auditiva, enfermedades crónicas
- **Condición Física y de Movilidad**: Movilidad, motricidad, coordinación visomotora
- **Desarrollo Socio Afectivo**: Autoestima, independencia, relaciones sociales
- **Aspectos Familiares y Comunitarios**: Participación familiar, autonomía
- **Comunicación y Lenguaje**: Habilidades comunicativas, idiomas, sistemas de comunicación

### 3. Columna Derecha
- **Capacidades Básicas para el Aprendizaje**: Estilos de aprendizaje, ritmo, memoria, atención
- **Funcionamiento Académico**: Logros por asignatura con firmas de docentes
- **Desarrollo Vocacional**: Intereses, habilidades y expectativas laborales

### 4. Firmas
- Docente solicitante
- Encargado legal
- Referencia al expediente único del estudiante

## Cómo Usar

### 🚀 Despliegue en GitHub Pages

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/ANEXO_7_CTP_SABALITO_2025.github.io.git
   cd ANEXO_7_CTP_SABALITO_2025.github.io
   ```

2. **Sube los archivos**:
   ```bash
   git add .
   git commit -m "Agregar formulario ANEXO 7"
   git push origin main
   ```

3. **Activa GitHub Pages**:
   - Ve a Settings > Pages
   - Selecciona "Deploy from a branch"
   - Elige la rama "main"
   - Tu formulario estará disponible en: `https://tu-usuario.github.io/ANEXO_7_CTP_SABALITO_2025.github.io/`

### 💻 Uso del Formulario

1. **Completar información**: Llena todos los campos requeridos
2. **Auto-guardado**: Los datos se guardan automáticamente en tu navegador
3. **Guardar**: Descarga los datos en formato JSON
4. **Imprimir**: Imprime el formulario completado
5. **Limpiar**: Borra todos los datos del formulario

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica del formulario
- **CSS3**: Estilos modernos con Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva
- **LocalStorage**: Persistencia de datos en el navegador
- **Responsive Design**: Adaptación a múltiples dispositivos

## Archivos del Proyecto

- `index.html` - Estructura principal del formulario
- `styles.css` - Estilos y diseño responsivo
- `script.js` - Funcionalidad JavaScript
- `README.md` - Documentación del proyecto

## Personalización

### Colores
Los colores principales se pueden modificar en `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

### Logo Institucional
Para agregar el logo de tu institución, modifica el header en `index.html`:
```html
<div class="institution-logo">
    <img src="ruta-a-tu-logo.png" alt="Logo Institucional">
</div>
```

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Si tienes preguntas o necesitas ayuda:

- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación oficial del MEP

## Changelog

### v1.0.0 (2025-01-XX)
- ✅ Formulario completo del ANEXO 7
- ✅ Diseño responsivo
- ✅ Auto-guardado automático
- ✅ Validaciones en tiempo real
- ✅ Función de impresión
- ✅ Exportación de datos

---

**Desarrollado para el CTP Sabalito 2025** 🎓