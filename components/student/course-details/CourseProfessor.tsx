import React from 'react';
import { CourseProfessor as CourseProfessorType } from '@/interfaces/Courses/CourseDetail';

interface CourseProfessorProps {
  professor: CourseProfessorType;
  presentationVideo?: string;
}

const CourseProfessor: React.FC<CourseProfessorProps> = ({ professor, presentationVideo }) => (
  <div>
    <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Docente</h1>
    <div className="items-center justify-center bg-gradient-to-r border-2 border-brandblanco-200 rounded from-brand-100 via-brand-200 to-brand-300 p-4">
      <div className="max-w-screen-lg mx-auto p-4 text-white">
        <div className="flex items-center">
          <img
            src={professor.image}
            className="rounded-full w-16 h-16 lg:w-20 lg:h-20 mr-4"
            alt={professor.full_name}
          />
          <div>
            <p className="text-lg lg:text-xl text-brandrosa-500 font-bold">
              {professor.full_name}
            </p>
            <p className="text-xs lg:text-sm">{professor.description}</p>
          </div>
        </div>
        {presentationVideo && (
          <div className="mt-4">
            <video
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="rounded-lg w-full"
            >
              <source src={presentationVideo} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default CourseProfessor;
