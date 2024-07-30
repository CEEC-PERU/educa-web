import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // Establece el elemento de aplicación para accesibilidad

interface GradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  modules: any[];
  finalExam: any;
}

const GradesModal: React.FC<GradesModalProps> = ({ isOpen, onClose, course, modules, finalExam }) => {
  const calculateAverage = () => {
    const moduleScores = modules.map(module => parseFloat(module.ModuleResults?.[0]?.puntaje || '0'));
    const finalScore = parseFloat(finalExam.CourseResults?.[0]?.puntaje || '0');
    const totalScores = [...moduleScores, finalScore];
    const average = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;
    return average.toFixed(2);
  };
  if (!course || !modules || !finalExam) {
    return null; // O algún mensaje de error / carga
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Calificaciones del Curso"
      className="bg-white p-6 rounded shadow-lg max-w-6xl mx-auto mt-24" // max-w-6xl ajusta el ancho del modal
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-blue-400 text-white text-center p-4 rounded-t">
        <h2 className="text-3xl font-bold mb-4">{course.name}</h2>
      </div>
      <div className="bg-gray-200 text-center p-4">
      </div>
      <div className="flex flex-col space-y-6 p-6">
        <div>
          <h3 className="text-xl font-bold border-b-2 border-gray-300 mb-4">Práctica de Módulos</h3>
          <ul className="space-y-2">
            {modules.map((module, index) => (
              <li key={module.module_id} className="flex justify-between text-lg">
                <span>{module.name}</span>
                <span>{module.ModuleResults?.[0]?.puntaje || 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className=" pt-6">
          <h3 className="text-xl font-bold border-b-2 border-gray-300 mb-4">Evaluación Final del Curso</h3>
          <p className="text-lg">{finalExam.name}: {finalExam.CourseResults?.[0]?.puntaje || 0}</p>
        </div>
        <div className="text-center text-blue-500 mt-6">
          <h3 className="text-3xl font-bold">Promedio Final: {calculateAverage()}</h3>
        </div>
      </div>
    </Modal>
  );
};

export default GradesModal;