import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { getCategories, addCategory, deleteCategory, updateCategory } from '../../services/categoryService';
import { Category } from '../../interfaces/Category';
import './../../app/globals.css';
import ButtonContent from '../../components/Content/ButtonContent';
import FormField from '../../components/FormField';
import Table from '../../components/Table';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ModalConfirmation from '../../components/ModalConfirmation';
import useModal from '../../hooks/useModal';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
const CategoryPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [showAlert, setShowAlert] = useState(false);
  const { isVisible, showModal, hideModal } = useModal();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
        setLoading(false);
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
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !category.name) {
      setError('El nombre de la categoría no puede estar vacío');
      setTouchedFields(prev => ({ ...prev, name: true }));
      setShowAlert(true);
      return;
    }

    setFormLoading(true);
    try {
      let updatedCategories;
      if (isEditing && category) {
        const updatedCategory = await updateCategory(category.category_id, category);
        updatedCategories = categories.map(cat => (cat.category_id === updatedCategory.category_id ? updatedCategory : cat));
        setIsEditing(false);
        setSuccess('Categoría actualizada exitosamente');
      } else {
        const response = await addCategory(category.name);
        const newCategory = response.newCategory;
        updatedCategories = [...categories, newCategory];
        setSuccess('Categoría agregada exitosamente');
      }
      setCategories(updatedCategories);
      setCategory(null);
      setTouchedFields({});
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Error saving category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setCategory(category);
    setIsEditing(true);
    setTouchedFields({});
  };

  const handleDelete = async () => {
    if (categoryToDelete !== null) {
      setFormLoading(true);
      try {
        await deleteCategory(categoryToDelete);
        setCategories(categories.filter(category => category.category_id !== categoryToDelete));
        if (category?.category_id === categoryToDelete) {
          setCategory(null);
          setIsEditing(false);
        }
        setSuccess('Categoría eliminada exitosamente');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Error deleting category');
      } finally {
        setFormLoading(false);
        hideModal();
      }
    }
  };

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Acciones', key: 'actions' },
  ];

  const rows = categories.map(category => ({
    name: <span>{category.name}</span>,
    actions: (
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => handleEdit(category)}
          className="text-blue-500 py-1 px-2 rounded flex items-center"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setCategoryToDelete(category.category_id);
            showModal();
          }}
          className="text-purple-700 py-1 px-2 rounded flex items-center"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    ),
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}>
          <div className="max-w-6xl p-6 rounded-lg mx-auto">
            {success && (
              <AlertComponent
                type={success.includes('actualizada') ? 'info' : success.includes('agregada') ? 'success' : 'danger'}
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}
            {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-lg w-full max-w-lg bg-white shadow-lg">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-4 mb-4">
                    <FormField
                      id="name"
                      label="Nombre de la Categoría"
                      type="text"
                      name="name"
                      value={category?.name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!category?.name && touchedFields['name']}
                      touched={touchedFields['name']}
                      required
                    />
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <ButtonContent
                        buttonLabel={isEditing ? 'Guardar' : '+ Agregar'}
                        backgroundColor={isEditing ? 'bg-custom-purple' : 'bg-custom-blue'}
                        textColor="text-white"
                        fontSize="text-xs"
                        buttonSize="py-1 px-2"
                        onClick={handleSubmit}
                      />
                      {isEditing && (
                        <ButtonContent
                          buttonLabel="Cancelar"
                          backgroundColor="bg-gray-500"
                          textColor="text-white"
                          fontSize="text-xs"
                          buttonSize="py-1 px-2"
                          onClick={() => {
                            setCategory({ category_id: 0, name: '' });
                            setIsEditing(false);
                            setTouchedFields({});
                          }}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <Table columns={columns} rows={rows} />
            </div>
          </div>
        </main>
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </div>
    </ProtectedRoute>
  );
};

export default CategoryPage;
