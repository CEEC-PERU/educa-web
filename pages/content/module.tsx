import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { getModules, addModule, deleteModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import Link from 'next/link';
import './../../app/globals.css';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, CheckCircleIcon, TrashIcon, BookOpenIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import FloatingButton from '../../components/FloatingButton'; // Asegúrate de importar FloatingButton

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

  const getCourseName = (course_id: number) => {
    const course = courses.find(c => c.course_id === course_id);
    return course ? course.name : 'N/A';
  };

  const getEvaluationName = (evaluation_id: number) => {
    const evaluation = evaluations.find(e => e.evaluation_id === evaluation_id);
    return evaluation ? evaluation.name : 'N/A';
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="max-w-4xl mt-16">
            <div className="p-6 w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Módulos</h2>
                <FloatingButton link="/content/addModule" label="Añadir Módulo" />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-2 mb-10">
                {modules.map(module => (
                  <Disclosure key={module.module_id} defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left text-purple-1000 bg-gradient-purple focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                          <div className="flex items-center">
                            {open ? (
                              <ChevronUpIcon className="w-5 h-5 text-purple-500 mr-2" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-purple-500 mr-2" />
                            )}
                            <span className="flex-grow">{module.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link href={`/content/editModule?id=${module.module_id}`}>
                              <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                            </Link>
                            <button onClick={() => handleDelete(module.module_id)}>
                              <TrashIcon className="w-6 h-5  text-red-500 cursor-pointer" />
                            </button>
                            {module.is_active ? (
                              <CheckCircleIcon className="w-7 h-7 text-green-500" />
                            ) : (
                              <CheckCircleIcon className="w-7 h-7 text-gray-500" />
                            )}
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-m text-gray-700">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center py-4 px-6">
                              <BookOpenIcon className="w-5 h-5 text-gray-500 mr-2" />
                              <strong>Curso:</strong>
                              <span className="ml-2">{getCourseName(module.course_id)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center py-4 px-6">
                              <ClipboardIcon className="w-5 h-5 text-gray-500 mr-2" />
                              <strong>Evaluación:</strong>
                              <span className="ml-2">{getEvaluationName(module.evaluation_id)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center py-4 px-6">
                              <CheckIcon className="w-5 h-5 text-gray-500 mr-2" />
                              <strong>Finalizado:</strong>
                              <span className="ml-2">{module.is_finish ? 'Sí' : 'No'}</span>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulePage;
