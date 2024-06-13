import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { getModule, updateModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import './../../app/globals.css';

const EditModule: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_finish: false,
    is_active: true,
    name: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      Promise.all([getModule(id as string), getCourses(), getEvaluations()])
        .then(([moduleRes, coursesRes, evaluationsRes]) => {
          setModule(moduleRes);
          setCourses(coursesRes);
          setEvaluations(evaluationsRes);
        })
        .catch(error => {
          console.error('Error fetching module details:', error);
          setError('Error fetching module details');
        });
    }
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateModule(id as string, module);
      router.push('/content/module');
    } catch (error) {
      console.error('Error updating module:', error);
      setError('Error updating module');
    }
  };

  if (!module) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">Editar Módulo</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={module.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="course_id" className="block text-gray-700 text-sm font-bold mb-2">Curso</label>
              <select
                id="course_id"
                name="course_id"
                value={module.course_id}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <label htmlFor="evaluation_id" className="block text-gray-700 text-sm font-bold mb-2">Evaluación</label>
              <select
                id="evaluation_id"
                name="evaluation_id"
                value={module.evaluation_id}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <label htmlFor="is_active" className="block text-gray-700 text-sm font-bold mb-2">Activo</label>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={module.is_active}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="is_finish" className="block text-gray-700 text-sm font-bold mb-2">Finalizado</label>
              <input
                type="checkbox"
                id="is_finish"
                name="is_finish"
                checked={module.is_finish}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
          </form>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default EditModule;
