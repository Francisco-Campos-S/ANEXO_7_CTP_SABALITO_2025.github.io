# 🔧 ACTUALIZAR ESTRUCTURA DE GOOGLE SHEETS

## ⚠️ **PROBLEMA IDENTIFICADO**

La hoja de Google Sheets **aún tiene la estructura antigua** (17 columnas) y no incluye las columnas para **Ciencias, Estudios Sociales y Otras materias**.

### **Estructura Actual (17 columnas):**
```
Cédula | Nombre | Grado | Sección | Logros Español | Nivel Español | Docente Español | Logros Matemáticas | Nivel Matemáticas | Docente Matemáticas | Intereses y Habilidades | Expectativas Vocacionales | Observaciones Generales | Docente Evaluador | Fecha Evaluación | Fecha Registro | Tipo
```

### **Estructura Necesaria (25 columnas):**
```
Cédula | Nombre | Grado | Sección | Logros Español | Nivel Español | Docente Español | Logros Matemáticas | Nivel Matemáticas | Docente Matemáticas | Logros Ciencias | Nivel Ciencias | Docente Ciencias | Logros Estudios Sociales | Nivel Estudios Sociales | Docente Estudios Sociales | Logros Otras | Nivel Otras | Docente Otras | Intereses y Habilidades | Expectativas Vocacionales | Observaciones Generales | Docente Evaluador | Fecha Evaluación | Fecha Registro | Tipo
```

---

## 🎯 **SOLUCIÓN APLICADA**

He agregado una función `initializeSheetStructure()` al Google Apps Script que:
- ✅ **Detecta** si la hoja tiene la estructura antigua
- ✅ **Actualiza** automáticamente los encabezados
- ✅ **Agrega** las columnas faltantes para todas las materias

---

## 🚀 **INSTRUCCIONES PARA ACTUALIZAR**

### **PASO 1: Actualizar el Google Apps Script**
1. Ve a [Google Apps Script](https://script.google.com)
2. Abre tu proyecto del ANEXO 7
3. **Reemplaza TODO el contenido** con el archivo `GoogleAppsScript_FINAL.gs` actualizado
4. **Guarda** el proyecto (Ctrl+S)

### **PASO 2: Ejecutar la Función de Inicialización**
1. En el editor de Google Apps Script
2. **Selecciona la función** `initializeSheetStructure` en el dropdown
3. Haz clic en **"Ejecutar"** (▶️)
4. **Autoriza** los permisos si es necesario
5. Verifica que aparezca el mensaje: **"Estructura de la hoja actualizada exitosamente"**

### **PASO 3: Redesplegar el Script**
1. Haz clic en **"Desplegar"** → **"Nueva implementación"**
2. Tipo: **"Aplicación web"**
3. Ejecutar como: **"Yo"**
4. Quién tiene acceso: **"Cualquiera"**
5. Haz clic en **"Desplegar"**
6. **Copia la nueva URL** del deploy

### **PASO 4: Actualizar la URL en el Frontend**
1. Abre el archivo `estudiante.js`
2. Busca la función `getScriptUrl()`
3. **Reemplaza la URL** con la nueva URL del deploy
4. **Guarda** el archivo

### **PASO 5: Verificar en Google Sheets**
1. **Abre tu Google Sheet**
2. **Verifica que aparezcan 25 columnas**:
   - Cédula, Nombre, Grado, Sección
   - Logros Español, Nivel Español, Docente Español
   - Logros Matemáticas, Nivel Matemáticas, Docente Matemáticas
   - **Logros Ciencias, Nivel Ciencias, Docente Ciencias** ⭐ **NUEVO**
   - **Logros Estudios Sociales, Nivel Estudios Sociales, Docente Estudios Sociales** ⭐ **NUEVO**
   - **Logros Otras, Nivel Otras, Docente Otras** ⭐ **NUEVO**
   - Intereses y Habilidades, Expectativas Vocacionales, Observaciones Generales
   - Docente Evaluador, Fecha Evaluación, Fecha Registro, Tipo

---

## ⚠️ **IMPORTANTE**

### **⚠️ ADVERTENCIA:**
La función `initializeSheetStructure()` **LIMPIARÁ** la hoja existente y establecerá solo los encabezados. **Los datos existentes se perderán**.

### **🔄 ALTERNATIVA SEGURA:**
Si quieres **conservar los datos existentes**, puedes:

1. **Hacer una copia de seguridad** de tu Google Sheet
2. **Agregar manualmente** las columnas faltantes en Google Sheets:
   - Insertar columna después de "Docente Matemáticas"
   - Agregar: "Logros Ciencias", "Nivel Ciencias", "Docente Ciencias"
   - Insertar columna después de "Docente Ciencias"
   - Agregar: "Logros Estudios Sociales", "Nivel Estudios Sociales", "Docente Estudios Sociales"
   - Insertar columna después de "Docente Estudios Sociales"
   - Agregar: "Logros Otras", "Nivel Otras", "Docente Otras"

---

## ✅ **VERIFICACIÓN**

### **Después de la actualización, la hoja debe tener:**

1. **25 columnas** en total
2. **Encabezados correctos** para todas las materias
3. **Capacidad de guardar** datos en Ciencias, Estudios Sociales y Otras

### **Prueba el sistema:**
1. **Crea un nuevo estudiante** con datos en todas las materias
2. **Verifica** que se guarden en las nuevas columnas
3. **Edita un estudiante** existente
4. **Selecciona un estudiante** de la lista

---

## 🎯 **RESULTADO ESPERADO**

**ANTES:** 17 columnas (solo Español y Matemáticas)
**DESPUÉS:** 25 columnas (todas las materias: Español, Matemáticas, Ciencias, Estudios Sociales, Otras)

---

**¡Una vez actualizada la estructura, el sistema guardará TODAS las materias correctamente!** 🎉
