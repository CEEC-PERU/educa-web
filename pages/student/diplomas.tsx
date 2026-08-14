import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { CourseStudent } from "../../interfaces/Courses/CourseStudent";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const Diplomas = () => {
  const { profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  let fullName = "";
  if (profileInfo) {
    const profile = profileInfo as Profile;
    fullName = `${profile.first_name} ${profile.last_name}`;
  }

  const diplomaCourses = courseStudent.filter(
    (cs: CourseStudent) => cs.is_approved && cs.Course.diploma_enabled,
  );

  const handleDownloadDiploma = async (cs: CourseStudent) => {
    const courseId = cs.Course.course_id;
    setGeneratingId(courseId);
    try {
      const templateBytes = await fetch("/templates/Certificado.pdf").then(
        (res) => res.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(templateBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const nameSize = 24;
      const nameWidth = font.widthOfTextAtSize(fullName, nameSize);
      page.drawText(fullName, {
        x: (width - nameWidth) / 2,
        y: height / 2,
        size: nameSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      const courseSize = 14;
      const courseWidth = font.widthOfTextAtSize(cs.Course.name, courseSize);
      page.drawText(cs.Course.name, {
        x: (width - courseWidth) / 2,
        y: height / 2 - 40,
        size: courseSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });

      if (cs.deadline) {
        const dateStr = new Date(cs.deadline).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const dateSize = 12;
        const dateWidth = font.widthOfTextAtSize(dateStr, dateSize);
        page.drawText(dateStr, {
          x: (width - dateWidth) / 2,
          y: height / 2 - 70,
          size: dateSize,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Diploma_${cs.Course.name}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando el diploma:", error);
      alert("Error generando el diploma. Por favor, inténtalo de nuevo.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Mis Diplomas</h1>

        {isLoading ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
            Cargando...
          </div>
        ) : diplomaCourses.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow">
            <p className="text-gray-500 text-lg">
              Aún no tienes diplomas disponibles. Aprueba un curso para obtener
              tu diploma.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {diplomaCourses.map((cs: CourseStudent) => (
              <div
                key={cs.Course.course_id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1770871986/WEB_EDUCA/DIPLOMA/Certificado_Reconocimiento_rrn1dp.jpg"
                  className="w-full h-auto object-contain border-b border-gray-100"
                  alt={`Diploma - ${cs.Course.name}`}
                />
                <div className="p-5">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {cs.Course.name}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Otorgado a: <span className="text-gray-600">{fullName}</span>
                  </p>
                  <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                    disabled={generatingId === cs.Course.course_id}
                    onClick={() => handleDownloadDiploma(cs)}
                  >
                    {generatingId === cs.Course.course_id
                      ? "Generando..."
                      : "Descargar Diploma"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Diplomas.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default Diplomas;
