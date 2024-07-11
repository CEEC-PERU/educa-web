import React from 'react';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Enterprise {
  name: string;
}

interface User {
  userProfile?: UserProfile;
  enterprise: Enterprise;
}

interface Requirement {
  requirement_id: number;
  proposed_date: string;
  course_name: string;
  material: string;
  message: string;
  course_duration: string;
  user: User;
}

interface RequirementCardProps {
  requirement: Requirement;
  onDelete: (id: number) => void;
}

const RequirementCard: React.FC<RequirementCardProps> = ({ requirement, onDelete }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center">
        {requirement.user && requirement.user.userProfile ? (
          <>
            <img
              src={requirement.user.userProfile.profile_picture}
              alt={`${requirement.user.userProfile.first_name} ${requirement.user.userProfile.last_name}`}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-bold">{`${requirement.user.userProfile.first_name} ${requirement.user.userProfile.last_name}`}</h3>
              <p>Usuario de {requirement.user.enterprise?.name || 'desconocida'}</p>
            </div>
          </>
        ) : (
          <h3 className="text-lg font-bold">Usuario desconocido</h3>
        )}
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700 mb-2"><strong>Nombre del Curso:</strong> {requirement.course_name}</p>
          <p className="text-gray-700 mb-2"><strong>Duración del Curso:</strong> {requirement.course_duration}</p>
          <p className="text-gray-700 mb-2"><strong>Fecha propuesta:</strong> {formatDate(requirement.proposed_date)}</p>
          <p className="text-gray-700 mb-2"><strong>Material:</strong> {requirement.material}</p>
          {requirement.material && (
            <a
              href={requirement.material}
              download
              className="text-blue-500 hover:underline"
            >
              Descargar Material
            </a>
          )}
        </div>
        <div>
          <p className="text-gray-700 mb-4"><strong>Mensaje:</strong> {requirement.message}</p>
        </div>
      </div>
      <div className="p-4">
        <button
          onClick={() => onDelete(requirement.requirement_id)}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default RequirementCard;
