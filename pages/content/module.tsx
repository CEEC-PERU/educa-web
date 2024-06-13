import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { getModules, addModule, deleteModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import Link from 'next/link';
import './../../app/globals.css';

const ModulePage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_finish: false,
    is_active: true,
    name: ''
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModulesCoursesAndEvaluations = async () => {
      try {
        const [modulesRes, coursesRes, evaluationsRes] = await Promise.all([
          getModules(),
          getCourses(),
          getEvaluations()
        ]);
        setModules(modulesRes);
        setCourses(coursesRes);
        setEvaluations(evaluationsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchModulesCoursesAndEvaluations();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setModule(prevModule => ({
      ...prevModule,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newModule = await addModule(module);
      setModules([...modules, newModule]);
      setModule({ course_id: 0, evaluation_id: 0, is_finish: false, is_active: true, name: '' });
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Error adding module');
    }
  };

  const handleDelete = async (module_id: number) => {
    try {
      await deleteModule(module_id);
      setModules(modules.filter(module => module.module_id !== module_id));
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('Error deleting module');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-16">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Ingresar Módulo</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={module.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="course_id" className="block text-gray-700 mb-2">Curso</label>
                <select
                  id="course_id"
                  value={module.course_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value={0}>Seleccione un curso</option>
                  {courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="evaluation_id" className="block text-gray-700 mb-2">Evaluación</label>
                <select
                  id="evaluation_id"
                  value={module.evaluation_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value={0}>Seleccione una evaluación</option>
                  {evaluations.map(evaluation => (
                    <option key={evaluation.evaluation_id} value={evaluation.evaluation_id}>
                      {evaluation.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="is_active" className="block text-gray-700 mb-2">Activo</label>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={module.is_active}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="is_finish" className="block text-gray-700 mb-2">Finalizado</label>
                <input
                  type="checkbox"
                  id="is_finish"
                  checked={module.is_finish}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
            </form>
            <div className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Lista de Módulos</h2>
              {error && <p className="text-red-500">{error}</p>}
              <ul className="mt-4 space-y-2">
                {modules.map(module => (
                  <li key={module.module_id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span>{module.name}</span>
                    <div>
                      <Link href={`/content/editModule?id=${module.module_id}`}>
                        <button className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded">Editar</button>
                      </Link>
                      <button onClick={() => handleDelete(module.module_id)} className="bg-red-500 text-white py-1 px-2 rounded">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default ModulePage;
