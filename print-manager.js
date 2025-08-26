// Clase para manejar la impresión de formularios de estudiantes
class PrintManager {
    constructor() {
        this.printWindow = null;
    }

    // Imprimir formulario de un estudiante
    printStudentForm(studentData) {
        try {
            const printContent = this.generatePrintContent(studentData);
            this.openPrintWindow(printContent);
        } catch (error) {
            console.error('Error al generar contenido de impresión:', error);
            alert('Error al generar el contenido para imprimir');
        }
    }

    // Generar contenido HTML para impresión
    generatePrintContent(studentData) {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ANEXO 7 - ${studentData.estudiante || 'Estudiante'}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 20px;
            color: #333;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 18px;
            margin: 0;
            font-weight: bold;
        }
        
        .header h2 {
            font-size: 16px;
            margin: 5px 0;
            font-weight: bold;
        }
        
        .header h3 {
            font-size: 14px;
            margin: 5px 0;
            font-weight: normal;
        }
        
        .student-info {
            margin-bottom: 25px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .info-group {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
        }
        
        .info-value {
            border-bottom: 1px solid #ccc;
            padding: 5px 0;
            min-height: 20px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section h4 {
            font-size: 14px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        
        .section-description {
            font-size: 11px;
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .section-content {
            border: 1px solid #ddd;
            padding: 10px;
            min-height: 60px;
            background-color: #f9f9f9;
        }
        
        .skills-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        .skills-table .skill-row {
            display: flex;
            border-bottom: 1px solid #eee;
            padding: 8px 0;
        }
        
        .skills-table .skill-row:last-child {
            border-bottom: none;
        }
        
        .skills-table label {
            flex: 1;
            font-weight: normal;
            margin-right: 15px;
        }
        
        .skills-table input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 12px;
        }
        
        .academic-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        .academic-table .table-header {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .academic-table .table-row {
            border-bottom: 1px solid #ddd;
        }
        
        .academic-table .cell {
            padding: 8px;
            border-right: 1px solid #ddd;
            vertical-align: top;
        }
        
        .academic-table .cell:last-child {
            border-right: none;
        }
        
        .academic-table .cell:first-child {
            font-weight: bold;
            background-color: #f9f9f9;
            width: 15%;
        }
        
        .academic-table textarea {
            width: 100%;
            border: none;
            background: transparent;
            resize: none;
            font-size: 12px;
            min-height: 40px;
        }
        
        .academic-table input {
            width: 100%;
            border: none;
            background: transparent;
            font-size: 12px;
        }
        
        .signatures {
            margin-top: 30px;
            border-top: 2px solid #333;
            padding-top: 20px;
        }
        
        .signature-group {
            margin-bottom: 15px;
        }
        
        .signature-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
        }
        
        .signature-value {
            border-bottom: 1px solid #ccc;
            padding: 5px 0;
            min-height: 20px;
        }
        
        .file-note {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            color: #666;
        }
        
        .print-actions {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .print-actions button {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 8px 15px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .btn-primary {
            background-color: #007bff;
            color: white;
        }
        
        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }
        
        .btn-danger {
            background-color: #dc3545;
            color: white;
        }
        
        .btn-primary:hover { background-color: #0056b3; }
        .btn-secondary:hover { background-color: #545b62; }
        .btn-danger:hover { background-color: #c82333; }
    </style>
</head>
<body>
    <div class="print-actions no-print">
        <button class="btn-primary" onclick="window.print()">Imprimir</button>
        <button class="btn-secondary" onclick="window.close()">Cerrar</button>
    </div>

    <div class="header">
        <h1>ANEXO 7:</h1>
        <h2>Trámite de Apoyo Curricular Significativo</h2>
        <h3>Informe Integral del Proceso Educativo del Estudiante</h3>
    </div>

    <div class="student-info">
        <div class="info-grid">
            <div class="info-group">
                <div class="info-label">Institución:</div>
                <div class="info-value">${studentData.institucion || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Circuito escolar:</div>
                <div class="info-value">${studentData.circuito || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Estudiante:</div>
                <div class="info-value">${studentData.estudiante || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Edad:</div>
                <div class="info-value">${studentData.edad || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Nivel que cursa:</div>
                <div class="info-value">${studentData.nivel || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Cédula:</div>
                <div class="info-value">${studentData.cedula || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Fecha nacimiento:</div>
                <div class="info-value">${studentData.fechaNacimiento || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Dirección:</div>
                <div class="info-value">${studentData.direccion || ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Nombre del encargado:</div>
                <div class="info-value">${studentData.encargado || ''}</div>
            </div>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="left-column">
            <div class="section">
                <h4>Condición General de Salud</h4>
                <div class="section-description">(nutrición, capacidad visual, capacidad auditiva, enfermedades crónicas de tipo respiratorio, neurodegenerativas, secuelas ocasionadas por accidentes, entre otros)</div>
                <div class="section-content">${studentData.condicionSalud || ''}</div>
            </div>

            <div class="section">
                <h4>Condición Física y de Movilidad</h4>
                <div class="section-description">(movilidad, motricidad fina y gruesa, coordinación visomotora)</div>
                <div class="section-content">${studentData.condicionFisica || ''}</div>
            </div>

            <div class="section">
                <h4>Desarrollo Socio Afectivo</h4>
                <div class="section-description">(autoestima, independencia, toma de decisiones, relación con iguales, relación con los adultos, capacidad para seguir normas establecidas)</div>
                <div class="section-content">${studentData.desarrolloSocial || ''}</div>
            </div>

            <div class="section">
                <h4>Aspectos Relevantes de Familia y Comunidad</h4>
                <div class="section-description">(descripción de la participación familiar en el proceso educativo y en la toma de decisiones, manejo de límites responsabilidades, autonomía en el hogar y la comunidad, describiendo los apoyos requeridos para su participación en estos ámbitos)</div>
                <div class="section-content">${studentData.aspectosFamilia || ''}</div>
            </div>

            <div class="section">
                <h4>Comunicación y Lenguaje</h4>
                <div class="section-description">(escucha, habla, lectura, escritura. Lenguas que usa el estudiante para comunicarse, "LESCO, lenguas indígenas entre otras". Sistemas de comunicación utilizados)</div>
                <div class="section-content">${studentData.comunicacion || ''}</div>
            </div>
        </div>

        <div class="right-column">
            <div class="section">
                <h4>Capacidades y Condiciones Básicas para el Aprendizaje</h4>
                <h5>Habilidades del Pensamiento</h5>
                <div class="skills-table">
                    <div class="skill-row">
                        <label>Estilos de aprendizaje (visual, auditivo y kinestésico):</label>
                        <div class="info-value">${studentData.estilosAprendizaje || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Ritmo de aprendizajes (igual, lento, rápido):</label>
                        <div class="info-value">${studentData.ritmoAprendizaje || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Memoria (corta o largo plazo):</label>
                        <div class="info-value">${studentData.memoria || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Atención y concentración (periodos y tipos de actividades de interés):</label>
                        <div class="info-value">${studentData.atencion || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Razonamiento (resolución de problemas académicos y de la vida diaria):</label>
                        <div class="info-value">${studentData.razonamiento || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Tipo de agrupamientos en que se desempeña mejor (parejas, tríos, otros):</label>
                        <div class="info-value">${studentData.agrupamientos || ''}</div>
                    </div>
                    <div class="skill-row">
                        <label>Materiales y apoyos requeridos:</label>
                        <div class="info-value">${studentData.materiales || ''}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h4>Funcionamiento Académico</h4>
                <div class="section-description">(descripción de los logros académicos alcanzados por el estudiante en cada una de las asignaturas, se debe indicar claramente el nivel de funcionamiento en cada asignatura)</div>
                
                <div class="academic-table">
                    <div class="table-header">
                        <div class="cell">Asignatura</div>
                        <div class="cell">Logros</div>
                        <div class="cell">Nivel de Func.</div>
                        <div class="cell">Nombre y firma del docente</div>
                    </div>
                    <div class="table-row">
                        <div class="cell">Español</div>
                        <div class="cell">${studentData.logrosEspanol || ''}</div>
                        <div class="cell">${studentData.nivelEspanol || ''}</div>
                        <div class="cell">${studentData.firmaEspanol || ''}</div>
                    </div>
                    <div class="table-row">
                        <div class="cell">Matemáticas</div>
                        <div class="cell">${studentData.logrosMatematicas || ''}</div>
                        <div class="cell">${studentData.nivelMatematicas || ''}</div>
                        <div class="cell">${studentData.firmaMatematicas || ''}</div>
                    </div>
                    <div class="table-row">
                        <div class="cell">Ciencias</div>
                        <div class="cell">${studentData.logrosCiencias || ''}</div>
                        <div class="cell">${studentData.nivelCiencias || ''}</div>
                        <div class="cell">${studentData.firmaCiencias || ''}</div>
                    </div>
                    <div class="table-row">
                        <div class="cell">Estudios Soc.</div>
                        <div class="cell">${studentData.logrosEstudiosSoc || ''}</div>
                        <div class="cell">${studentData.nivelEstudiosSoc || ''}</div>
                        <div class="cell">${studentData.firmaEstudiosSoc || ''}</div>
                    </div>
                    <div class="table-row">
                        <div class="cell">Otras:</div>
                        <div class="cell">${studentData.logrosOtras || ''}</div>
                        <div class="cell">${studentData.nivelOtras || ''}</div>
                        <div class="cell">${studentData.firmaOtras || ''}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h4>Desarrollo Vocacional</h4>
                <div class="section-description">(Intereses y habilidades deportivas, creativas, ocupacionales y vocacionales. Expectativas vocacionales y laborales, productivas)</div>
                <div class="section-content">${studentData.desarrolloVocacional || ''}</div>
            </div>
        </div>
    </div>

    <div class="signatures">
        <div class="signature-group">
            <div class="signature-label">Nombre y Firma del Docente Solicitante:</div>
            <div class="signature-value">${studentData.firmaDocente || ''}</div>
        </div>
        <div class="signature-group">
            <div class="signature-label">Nombre y firma del encargado legal:</div>
            <div class="signature-value">${studentData.firmaEncargado || ''}</div>
        </div>
        <div class="file-note">
            <small>C.C Expediente Único del Estudiante</small>
        </div>
    </div>
</body>
</html>`;
    }

    // Abrir ventana de impresión
    openPrintWindow(content) {
        this.printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        this.printWindow.document.write(content);
        this.printWindow.document.close();
        
        // Esperar a que se cargue el contenido antes de imprimir
        this.printWindow.onload = () => {
            // Auto-imprimir después de un breve delay
            setTimeout(() => {
                this.printWindow.focus();
            }, 500);
        };
    }

    // Imprimir múltiples estudiantes
    printMultipleStudents(studentsList) {
        if (!studentsList || studentsList.length === 0) {
            alert('No hay estudiantes para imprimir');
            return;
        }

        let allContent = '';
        studentsList.forEach((student, index) => {
            if (index > 0) {
                allContent += '<div class="page-break"></div>';
            }
            allContent += this.generatePrintContent(student);
        });

        this.openPrintWindow(allContent);
    }

    // Exportar a PDF (placeholder - requeriría librería adicional)
    exportToPDF(studentData) {
        alert('La funcionalidad de exportar a PDF requiere librerías adicionales como jsPDF. Por favor use la función de imprimir y guarde como PDF desde el navegador.');
    }

    // Vista previa de impresión
    previewPrint(studentData) {
        const printContent = this.generatePrintContent(studentData);
        this.openPrintWindow(printContent);
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrintManager;
}
