import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import axios from '../../services/axios';
import Link from 'next/link';
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

const Profesores: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [profesor, setProfesor] = useState<Omit<Professor, 'professor_id' | 'created_at' | 'updated_at'>>({
    full_name: '',
    image: '',
    especialitation: '',
    description: '',
    level_id: 0,
  });
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfesor(prevProfesor => ({ ...prevProfesor, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('/professors', profesor)
      .then(response => {
        setProfessors([...professors, response.data]);
        setProfesor({
          full_name: '',
          image: '',
          especialitation: '',
          description: '',
          level_id: 0,
        });
        setSuccess('Profesor agregado exitosamente');
      })
      .catch(error => {
        console.error('Error adding professor:', error);
        setError('Error adding professor');
      });
  };

  const handleDelete = (id: number) => {
    axios.delete(`/professors/${id}`)
      .then(() => {
        setProfessors(professors.filter(prof => prof.professor_id !== id));
      })
      .catch(error => {
        console.error('Error deleting professor:', error);
        setError('Error deleting professor');
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ingresar Profesor</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="full_name" className="block text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profesor.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 mb-2">Imagen</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={profesor.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="especialitation" className="block text-gray-700 mb-2">Especialización</label>
                <input
                  type="text"
                  id="especialitation"
                  name="especialitation"
                  value={profesor.especialitation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={profesor.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="level_id" className="block text-gray-700 mb-2">Nivel</label>
                <select
                  id="level_id"
                  name="level_id"
                  value={profesor.level_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Seleccionar Nivel</option>
                  {levels.map(level => (
                    <option key={level.level_id} value={level.level_id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
              {success && <p className="text-green-500 mt-2">{success}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Lista de Profesores</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-4 space-y-2">
              {professors.map(professor => (
                <li key={professor.professor_id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>{professor.full_name}</span>
                  <div>
                    <Link href={`/content/editProfessor?id=${professor.professor_id}`}>
                      <button className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded">Editar</button>
                    </Link>
                    <button onClick={() => handleDelete(professor.professor_id)} className="bg-red-500 text-white py-1 px-2 rounded">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default Profesores;
