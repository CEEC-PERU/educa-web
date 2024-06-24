import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { getCategories, addCategory, deleteCategory, updateCategory } from '../../services/categoryService';
import { Category } from '../../interfaces/Category';
import './../../app/globals.css';
import ButtonComponent from '../../components/ButtonDelete';
import FormField from '../../components/FormField';
import Table from '../../components/Table';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CategoriasPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        console.log('Fetched categories:', categories); // Log para depuración
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory(prevCategory => prevCategory ? { ...prevCategory, [name]: value } : { category_id: 0, name: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && category) {
        await updateCategory(category.category_id, category);
        setCategories(categories.map(cat => (cat.category_id === category.category_id ? category : cat)));
        setIsEditing(false);
      } else {
        const newCategory = await addCategory(category?.name || '');
        setCategories([...categories, newCategory]);
      }
      setCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Error saving category');
    }
  };

  const handleEdit = (category: Category) => {
    setCategory(category);
    setIsEditing(true);
  };

  const handleDelete = async (category_id: number) => {
    try {
      await deleteCategory(category_id);
      setCategories(categories.filter(category => category.category_id !== category_id));
      if (category?.category_id === category_id) {
        setCategory(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Error deleting category');
    }
  };

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Acciones', key: 'actions' },
  ];

  const rows = categories.map(category => ({
    name: <span>{category.name}</span>,
    actions: (
      <div className="flex space-x-4">
        <button
          onClick={() => handleEdit(category)}
          className="text-blue-500 py-1 px-2 rounded flex items-center"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDelete(category.category_id)}
          className="text-purple-700 py-1 px-2 rounded flex items-center"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b ">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          <div className="max-w-6xl p-6 rounded-lg">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-lg w-full max-w-lg bg-white shadow-lg">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-grow">
                      <FormField
                        id="name"
                        label="Nombre de la Categoría"
                        type="text"
                        value={category?.name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <ButtonComponent
                      buttonLabel={isEditing ? 'Guardar' : '+ Agregar'}
                      backgroundColor={isEditing ? 'bg-custom-purple' : 'bg-custom-blue'}
                      textColor="text-white"
                      fontSize="text-xs"
                      buttonSize="py-1 px-2"
                      onClick={handleSubmit}
                    />
                    {isEditing && (
                      <ButtonComponent
                        buttonLabel="Cancelar"
                        backgroundColor="bg-gray-500"
                        textColor="text-white"
                        fontSize="text-xs"
                        buttonSize="py-1 px-2"
                        onClick={() => {
                          setCategory(null);
                          setIsEditing(false);
                        }}
                      />
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="md:grid-cols-2 gap-6 w-full">
              
              <div className="container mx-auto">
                {error && <p className="text-red-500">{error}</p>}
                <Table columns={columns} rows={rows} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriasPage;
