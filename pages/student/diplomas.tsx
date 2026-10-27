import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import { CourseStudent } from "../../interfaces/Courses/CourseStudent";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CERTIFICATE_WIDTH = 3600;
const CERTIFICATE_HEIGHT = 2025;

const Diplomas = () => {
  const { profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [pendingDiploma, setPendingDiploma] = useState<CourseStudent | null>(null);
  const diplomaRef = useRef<HTMLDivElement | null>(null);

  let fullName = "";
  if (profileInfo) {
    const profile = profileInfo as Profile;
    fullName = `${profile.first_name} ${profile.last_name}`;
  }

  const diplomaCourses = courseStudent.filter(
    (cs: CourseStudent) => cs.is_approved && cs.Course.diploma_enabled,
  );
  const obtainedDate = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownloadDiploma = (cs: CourseStudent) => {
    setGeneratingId(cs.Course.course_id);
    setPendingDiploma(cs);
  };

  useEffect(() => {
    if (!pendingDiploma) return;

    const generatePdf = async () => {
      try {
        const certificateRoot = diplomaRef.current;
        const templateImage = certificateRoot?.querySelector("img");
        if (!certificateRoot || !templateImage) {
          throw new Error("No se encontró la plantilla del diploma.");
        }

        await templateImage.decode();
        await document.fonts.ready;

        const imageWidth = templateImage.naturalWidth || CERTIFICATE_WIDTH;
        const imageHeight = templateImage.naturalHeight || CERTIFICATE_HEIGHT;
        certificateRoot.style.width = `${imageWidth}px`;
        certificateRoot.style.height = `${imageHeight}px`;

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
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          imageWidth,
          imageHeight,
        );
        pdf.save(`Diploma_${pendingDiploma.Course.name}.pdf`);
      } catch (error) {
        console.error("Error generando el diploma:", error);
        alert("Error generando el diploma. Por favor, intentalo de nuevo.");
      } finally {
        setGeneratingId(null);
        setPendingDiploma(null);
      }
    };

    void generatePdf();
  }, [pendingDiploma]);

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
                    disabled={generatingId !== null}
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

      {pendingDiploma && (
        <div
          ref={diplomaRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            width: `${CERTIFICATE_WIDTH}px`,
            height: `${CERTIFICATE_HEIGHT}px`,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            pointerEvents: "none",
          }}
        >
          <img
            src="/templates/qtech_certificado.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              margin: 0,
              textAlign: "center",
              fontFamily: "'Times New Roman', serif",
              fontSize: "55px",
              lineHeight: 1.15,
              color: "#4a0e78",
              overflowWrap: "anywhere",
              zIndex: 20,
            }}
          >
            {fullName}
          </p>

          <p
            className="absolute z-20 flex flex-col items-center justify-center bg-white text-center"
            style={{
              position: "absolute",
              top: "58%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "fit-content",
              maxWidth: "50%",
              boxSizing: "border-box",
              padding: "20px 40px",
              margin: 0,
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "40px",
              lineHeight: 1.15,
              color: "#4a0e78",
              textTransform: "uppercase",
              zIndex: 20,
            }}
          >
            <span>Por haber completado satisfactoriamente el curso de</span>
            <span
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "60px",
                lineHeight: 1.1,
                fontWeight: "bold",
                overflowWrap: "anywhere",
              }}
            >
              {pendingDiploma.Course.name}
            </span>
          </p>

          <p
            style={{
              position: "absolute",
              top: "70%",
              left: 0,
              width: "100%",
              margin: 0,
              textAlign: "center",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "40px",
              lineHeight: 1.15,
              color: "#3b0764",
              zIndex: 20,
            }}
          >
            Obtenido el: {obtainedDate}
          </p>
        </div>
      )}
    </div>
  );
};

Diplomas.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default Diplomas;
