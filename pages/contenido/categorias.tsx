// pages/contenido/categorias.tsx
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
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
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
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Lista de Categorías</h2>
          <ul className="mt-4">
            {categories.map((category) => (
              <li key={category.id} className="py-2 border-b border-gray-200">{category.name}</li>
            ))}
          </ul>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CategoriasPage;
