import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import SidebarDrawer from "../../components/student/DrawerNavigation";
import Navbar from "../../components/Navbar";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import CourseCard from "../../components/student/CourseCard";
import { useRouter } from "next/router";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import "./../../app/globals.css";

Modal.setAppElement("#__next");

const Diplomas: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  console.log(courseStudent);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  let name = "";
  let fullName = "";
  let uri_picture = "";

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    fullName = `${profile.first_name} ${profile.last_name}`;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // obtener cursos aprobados
  const approvedCourses = courseStudent.filter(
    (cs: any) => cs.is_approved === true,
  );

  const handleDownloadDiploma = async (courseName: string) => {
    setIsGenerating(true);
    try {
      // cargar template
      const templateUrl = "/templates/Certificado.pdf";
      const templateBytes = await fetch(templateUrl).then((res) =>
        res.arrayBuffer(),
      );

      // cargar el documento
      const pdfDoc = await PDFDocument.load(templateBytes);

      // obtener la primera página
      const pages = pdfDoc.getPages();
      const fPage = pages[0];
      const { width, height } = fPage.getSize();

      // embeber fuente
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // agregar texto
      const fontSize = 24;
      const textWidth = font.widthOfTextAtSize(fullName, fontSize);
      const xPosition = (width - textWidth) / 2; // centrar horizontalmente

      fPage.drawText(fullName, {
        x: xPosition,
        y: height / 2, // ajustar verticalmente según el diseño
        size: fontSize,
        font: font,
        color: rgb(0.1, 0.1, 0.1),
      });

      // serializar
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Diploma_${courseName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando el diploma:", error);
      alert("Error generando el diploma. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="min-h-screen bg-brandazul-600">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-60">
            <h1 className="text-2xl font-bold mb-6 text-white text-center lg:text-left">
              Mis Diplomas
            </h1>
            {isLoading ? (
              <p className="text-white text-center">Cargando...</p>
            ) : approvedCourses.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-gray-600 text-lg">
                  Aún no tienes diplomas disponibles. Aprueba un curso para
                  obtener tu diploma.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {approvedCourses.map((cs: any) => (
                  <div
                    key={cs.course_id}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1770871986/WEB_EDUCA/DIPLOMA/Certificado_Reconocimiento_rrn1dp.jpg"
                      className="w-full h-auto object-contain rounded-md mb-4 border-4 border-brand-100"
                      alt={`Diploma - ${cs.Course?.name}`}
                    />
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {cs.Course?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Otorgado a: <strong>{fullName}</strong>
                    </p>
                    <button
                      className="w-full bg-brand-300 text-white px-4 py-2 rounded-lg hover:bg-brand-200 disabled:opacity-50"
                      disabled={isGenerating}
                      onClick={() =>
                        handleDownloadDiploma(cs.Course?.name || "Curso")
                      }
                    >
                      {isGenerating ? "Generando..." : "Descargar Diploma"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Diplomas;
