import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { Professor, Level } from '../../interfaces/Professor';
import { getProfessors, getLevels } from '../../services/professorService'; // Importar las funciones del servicio
import ButtonComponent from '../../components/ButtonComponent';
import ProfileCard from '../../components/ProfileCard';
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
    const fetchProfessorsAndLevels = async () => {
      try {
        const [professorsData, levelsData] = await Promise.all([
          getProfessors(),
          getLevels()
        ]);
        setProfessors(professorsData);
        setLevels(levelsData);
      } catch (error) {
        console.error('Error fetching professors or levels:', error);
        setError('Error fetching professors or levels');
      }
    };

    fetchProfessorsAndLevels();
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
            <ButtonComponent
              buttonLabel="Añadir Profesor"
              buttonroute="/content/addProfessor"
              backgroundColor="bg-gradient-blue"
              textColor="text-white"
              fontSize="text-xs"
              buttonSize="py-2 px-7"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {professors.map(professor => (
              <ProfileCard
                key={professor.professor_id}
                name={professor.full_name}
                title={professor.especialitation}
                imageUrl={professor.image}
                level={getLevelName(professor.level_id)}
                onViewProfile={() => handleViewProfile(professor.professor_id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profesores;
