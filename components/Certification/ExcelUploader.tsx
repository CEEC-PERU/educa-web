import React, { useRef } from "react";
import { Upload, FileSpreadsheet, Download, X } from "lucide-react";
import { Question, Option } from "../../interfaces/Certification";
import * as XLSX from "xlsx";

interface ExcelUploaderProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  onClose: () => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onQuestionsLoaded,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("Por favor, sube un archivo Excel (.xlsx o .xls)");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Suponiendo que la primera hoja contiene los datos
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Procesar los datos y convertirlos a preguntas
        const result = processExcelData(jsonData);

        if (result.questions.length > 0) {
          onQuestionsLoaded(result.questions);

          // Mostrar resumen detallado
          let message = `Se procesaron ${result.stats.valid} preguntas válidas.`;
          if (result.stats.skipped > 0) {
            message += `\nSe omitieron ${result.stats.skipped} preguntas por errores.`;

            // Mostrar primeros 3 errores
            if (result.stats.errors.length > 0) {
              const errorPreview = result.stats.errors.slice(0, 3).join("\n• ");
              message += `\n\nErrores encontrados:\n• ${errorPreview}`;
              if (result.stats.errors.length > 3) {
                message += `\n• ... y ${result.stats.errors.length - 3} más`;
              }
            }
          }

          alert(message);
        } else {
          alert(
            "No se encontraron preguntas válidas en el archivo. Verifica el formato."
          );
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        alert(
          "Error al procesar el archivo. Verifica que sea un Excel válido."
        );
      } finally {
        // Limpiar input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      alert("Error al leer el archivo.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Función mejorada con validaciones
  const processExcelData = (
    excelData: any[]
  ): {
    questions: Question[];
    stats: {
      total: number;
      valid: number;
      skipped: number;
      errors: string[];
    };
  } => {
    const questions: Question[] = [];
    const errors: string[] = [];
    let totalRows = 0;
    let validQuestions = 0;
    let skippedQuestions = 0;

    // Saltar la primera fila (encabezados) y procesar cada fila
    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      totalRows++;

      // Validar que la fila tenga datos
      if (
        !row ||
        row.length === 0 ||
        row.every((cell: any) => !cell || cell.toString().trim() === "")
      ) {
        continue; // Fila vacía
      }

      const questionText = row[0]?.toString().trim();

      // Validar que tenga texto de pregunta
      if (!questionText) {
        errors.push(`Fila ${i + 1}: Sin texto de pregunta`);
        skippedQuestions++;
        continue;
      }

      // Validar longitud de pregunta
      if (questionText.length < 5) {
        errors.push(`Fila ${i + 1}: Pregunta muy corta ("${questionText}")`);
        skippedQuestions++;
        continue;
      }

      // Crear opciones válidas
      const options: Option[] = [];
      for (let j = 1; j <= 4; j++) {
        const optionText = row[j]?.toString().trim();
        if (optionText && optionText.length > 0) {
          options.push({
            option_text: optionText,
            is_correct: false,
            option_order: options.length + 1,
          });
        }
      }

      // Validar mínimo de opciones
      if (options.length < 2) {
        errors.push(
          `Fila ${i + 1}: "${questionText}" - Solo ${
            options.length
          } opción(es) (mínimo 2 requeridas)`
        );
        skippedQuestions++;
        continue;
      }

      // Validar opciones duplicadas
      const uniqueOptions = new Set(
        options.map((opt) => opt.option_text.toLowerCase())
      );
      if (uniqueOptions.size !== options.length) {
        errors.push(
          `Fila ${i + 1}: "${questionText}" - Tiene opciones duplicadas`
        );
        skippedQuestions++;
        continue;
      }

      // Validar respuesta correcta
      const correctOptionNum = parseInt(row[5]);
      if (
        isNaN(correctOptionNum) ||
        correctOptionNum < 1 ||
        correctOptionNum > options.length
      ) {
        errors.push(
          `Fila ${i + 1}: "${questionText}" - Respuesta correcta inválida: "${
            row[5]
          }" (debe ser entre 1 y ${options.length})`
        );
        skippedQuestions++;
        continue;
      }

      // Marcar la opción correcta
      const correctOptionIndex = correctOptionNum - 1;
      options[correctOptionIndex].is_correct = true;

      // Crear la pregunta válida (SIN question_id)
      questions.push({
        question_text: questionText,
        type_id: 1, // Opción simple
        points_value: 1, // Valor por defecto
        options: options,
      });
      validQuestions++;
    }

    return {
      questions,
      stats: {
        total: totalRows,
        valid: validQuestions,
        skipped: skippedQuestions,
        errors,
      },
    };
  };

  const downloadTemplate = () => {
    // Crear datos de ejemplo para el template
    const templateData = [
      [
        "PREGUNTA (OBLIGATORIO)",
        "OPCIÓN 1 (OBLIGATORIO)",
        "OPCIÓN 2 (OBLIGATORIO)",
        "OPCIÓN 3 (OPCIONAL)",
        "OPCIÓN 4 (OPCIONAL)",
        "RESPUESTA CORRECTA (NÚMERO 1-4)",
      ],
      [
        "¿Cuál es la capital de Francia?",
        "París",
        "Londres",
        "Berlín",
        "Madrid",
        1,
      ],
      ["¿2 + 2 es igual a?", "3", "4", "5", "", 2],
      ["¿Qué lenguaje se usa en React?", "Python", "JavaScript", "", "", 2],
      ["", "", "", "", "", ""],
      ["INSTRUCCIONES:", "", "", "", "", ""],
      ["• Mínimo 2 opciones por pregunta", "", "", "", "", ""],
      [
        "• La respuesta correcta debe ser un número entre 1-4",
        "",
        "",
        "",
        "",
        "",
      ],
      ["• Las primeras 2 opciones son OBLIGATORIAS", "", "", "", "", ""],
      ["• Use esta plantilla como base", "", "", "", "", ""],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Preguntas");

    // Descargar el archivo
    XLSX.writeFile(workbook, "plantilla-preguntas-certificacion.xlsx");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Cargar Preguntas desde Excel
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Información del formato */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Formato Requerido:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Columna A:</strong> Texto de la pregunta (obligatorio)
              </li>
              <li>
                • <strong>Columna B-C:</strong> Opciones 1 y 2 (obligatorias)
              </li>
              <li>
                • <strong>Columna D-E:</strong> Opciones 3 y 4 (opcionales)
              </li>
              <li>
                • <strong>Columna F:</strong> Número de la opción correcta (1-4)
              </li>
              <li>
                • <strong>Fila 1:</strong> Debe contener los encabezados
              </li>
            </ul>
          </div>

          {/* Botón para descargar template */}
          <div className="text-center border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50">
            <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-3">
              Descarga la plantilla para asegurar el formato correcto
            </p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar Plantilla Excel
            </button>
          </div>

          {/* Área de carga */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arrastra tu archivo Excel aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formatos soportados: .xlsx, .xls
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Seleccionar Archivo Excel
            </button>
          </div>

          {/* Ejemplo de formato */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Ejemplo de formato:
            </h4>
            <div className="text-xs font-mono bg-white p-2 rounded border">
              <div className="grid grid-cols-6 gap-2 font-bold border-b pb-1">
                <div>A</div>
                <div>B</div>
                <div>C</div>
                <div>D</div>
                <div>E</div>
                <div>F</div>
              </div>
              <div className="grid grid-cols-6 gap-2 border-b py-1">
                <div>Pregunta</div>
                <div>Opción 1</div>
                <div>Opción 2</div>
                <div>Opción 3</div>
                <div>Opción 4</div>
                <div>Correcta</div>
              </div>
              <div className="grid grid-cols-6 gap-2 py-1">
                <div>¿Capital de Perú?</div>
                <div>Lima</div>
                <div>Bogotá</div>
                <div></div>
                <div></div>
                <div>1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploader;
