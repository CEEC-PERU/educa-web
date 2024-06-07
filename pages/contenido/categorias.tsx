import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import axios from '../../services/axios';
import './../../app/globals.css';

interface Category {
  id: number;
  name: string;
}

const CategoriasPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get<Category[]>('/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('/categories/', { name: categoria })
      .then(response => {
        setCategories([...categories, response.data]);
        setCategoria('');
      })
      .catch(error => {
        console.error('Error adding category:', error);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-16">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Ingresar Categoría</h2>
              <div className="mb-4">
                <label htmlFor="categoria" className="block text-gray-700 mb-2">Categoría</label>
                <input
                  type="text"
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
            </form>
            <div className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Lista de Categorías</h2>
              <ul className="mt-4">
                {categories.map((category) => (
                  <li key={category.id} className="py-2 border-b border-gray-200">{category.name}</li>
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

export default CategoriasPage;
