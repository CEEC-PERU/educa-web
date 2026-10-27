import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { CourseStudent } from "../../interfaces/Courses/CourseStudent";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
    const certificateWidth = 3600;
    const certificateHeight = 2025;
    let certificateRoot: HTMLDivElement | null = null;
    setGeneratingId(courseId);

    try {
      certificateRoot = document.createElement("div");
      Object.assign(certificateRoot.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: `${certificateWidth}px`,
        height: `${certificateHeight}px`,
        overflow: "hidden",
        backgroundColor: "#ffffff",
      });

      const templateImage = document.createElement("img");
      templateImage.src = "/templates/qtech_certificado.png";
      templateImage.alt = "";
      Object.assign(templateImage.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "fill",
      });
      certificateRoot.appendChild(templateImage);
      document.body.appendChild(certificateRoot);
      await templateImage.decode();

      const imageWidth = templateImage.naturalWidth || certificateWidth;
      const imageHeight = templateImage.naturalHeight || certificateHeight;
      certificateRoot.style.width = `${imageWidth}px`;
      certificateRoot.style.height = `${imageHeight}px`;

      const oldCourseTextCover = document.createElement("div");
      Object.assign(oldCourseTextCover.style, {
        position: "absolute",
        left: "50%",
        top: "58%",
        transform: "translateX(-50%)",
        width: "85%",
        height: "12%",
        backgroundColor: "#ffffff",
        zIndex: "10",
      });
      certificateRoot.appendChild(oldCourseTextCover);

      const createCenteredText = (
        text: string,
        top: string,
        fontSize: number,
        width: string,
      ) => {
        const textElement = document.createElement("div");
        textElement.textContent = text;
        Object.assign(textElement.style, {
          position: "absolute",
          top,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          textAlign: "center",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: `${fontSize}px`,
          lineHeight: "1.15",
          color: "#3b0764",
          overflowWrap: "anywhere",
          zIndex: "20",
        });
        certificateRoot?.appendChild(textElement);
      };

      createCenteredText(fullName, "50%", 55, "90%");
      const courseStatement = document.createElement("p");
      courseStatement.textContent = "Por haber completado satisfactoriamente el curso de ";
      Object.assign(courseStatement.style, {
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "85%",
        margin: "0",
        textAlign: "center",
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "25px",
        lineHeight: "1.15",
        color: "#4a0e78",
        textTransform: "uppercase",
        zIndex: "20",
      });
      const dynamicCourseName = document.createElement("span");
      dynamicCourseName.textContent = cs.Course.name;
      Object.assign(dynamicCourseName.style, {
        display: "block",
        fontSize: "32px",
        fontWeight: "bold",
      });
      courseStatement.appendChild(dynamicCourseName);
      certificateRoot.appendChild(courseStatement);

      const obtainedDate = new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      createCenteredText(`Obtenido el: ${obtainedDate}`, "68%", 25, "90%");

      await document.fonts.ready;
      const canvas = await html2canvas(certificateRoot, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: imageWidth,
        height: imageHeight,
        windowWidth: imageWidth,
        windowHeight: imageHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [imageWidth, imageHeight],
        compress: true,
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imageWidth, imageHeight);
      pdf.save(`Diploma_${cs.Course.name}.pdf`);
    } catch (error) {
      console.error("Error generando el diploma:", error);
      alert("Error generando el diploma. Por favor, intentalo de nuevo.");
    } finally {
      certificateRoot?.remove();
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
