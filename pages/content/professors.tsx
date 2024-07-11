import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { Professor, Level } from '../../interfaces/Professor';
import axios from '../../services/axios';
import ButtonComponent from '../../components/ButtonDelete';
import ProfileCard from '../../components/ProfileCard'; // Asegúrate de importar ProfileCard
import { useRouter } from 'next/router';
import Link from 'next/link';
import './../../app/globals.css';

const Profesores: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    axios.get<Professor[]>('/professors/')
      .then(response => {
        setProfessors(response.data);
      })
      .catch(error => {
        console.error('Error fetching professors:', error);
        setError('Error fetching professors');
      });

    axios.get<Level[]>('/professors/levels')
      .then(response => {
        setLevels(response.data);
      })
      .catch(error => {
        console.error('Error fetching levels:', error);
        setError('Error fetching levels');
      });
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleViewProfile = (id: number) => {
    router.push(`/content/detailProfessor?id=${id}`);
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.level_id === levelId);
    return level ? level.name : 'N/A';
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between items-center mb-4"></div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between items-center mb-6 mt-4">
            <Link href="/content/addProfessor">
              <ButtonComponent
                buttonLabel="Añadir Profesor"
                backgroundColor="bg-gradient-blue"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Ajuste a 4 columnas */}
            {professors.map(professor => (
              <ProfileCard
                key={professor.professor_id}
                name={professor.full_name}
                title={professor.especialitation}
                imageUrl={professor.image}
                level={getLevelName(professor.level_id)} // Pasar el nivel del profesor
                onViewProfile={() => handleViewProfile(professor.professor_id)} // Pasar la función onViewProfile
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profesores;
