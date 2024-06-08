import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../services/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import './../../app/globals.css';

interface Professor {
  professor_id: number;
  full_name: string;
  image: string;
  especialitation: string;
  description: string;
  level_id: number;
}

interface Level {
  level_id: number;
  name: string;
}

const EditProfesor: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`/professors/${id}`)
        .then(response => {
          setProfessor(response.data);
        })
        .catch(error => {
          console.error('Error fetching professor details:', error);
          setError('Error fetching professor details');
        });
    }

    axios.get('/professors/levels')
      .then(response => {
        setLevels(response.data);
      })
      .catch(error => {
        console.error('Error fetching levels:', error);
        setError('Error fetching levels');
      });
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessor(prevProfessor => prevProfessor ? { ...prevProfessor, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (professor) {
      try {
        await axios.put(`/professors/${id}`, professor);
        setSuccess('Profesor actualizado exitosamente');
        router.push('/contenido/profesores');
      } catch (error) {
        console.error('Error updating professor:', error);
        setError('Error updating professor');
      }
    }
  };

  if (!professor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">Editar Profesor</h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">Nombre Completo</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={professor.full_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Imagen</label>
              <input
                type="text"
                id="image"
                name="image"
                value={professor.image}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="especialitation">Especialización</label>
              <input
                type="text"
                id="especialitation"
                name="especialitation"
                value={professor.especialitation}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={professor.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level_id">Nivel</label>
              <select
                id="level_id"
                name="level_id"
                value={professor.level_id}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccionar Nivel</option>
                {levels.map(level => (
                  <option key={level.level_id} value={level.level_id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Actualizar</button>
          </form>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default EditProfesor;
