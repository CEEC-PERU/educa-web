import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Content/SideBar';
import AlertComponent from '@/components/AlertComponent';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Loader from '@/components/Loader';
import { Flashcard } from '@/interfaces/Flashcard';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import FormField from '@/components/FormField';

const AddFlashcard: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [flashcard, setFlashcard] = useState<Omit<Flashcard, 'flashcard_id'>>({
    question: '',
    correct_answer: [],
    incorrect_answer: [],
    module_id: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFlashcard((prevFlashcard) => ({
      ...prevFlashcard,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setTouchedFields((prev) => ({ ...prev, [id]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
    } catch (error: any) {
    } finally {
      setFormLoading(false);
    }
  };

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
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''} flex`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-2xl rounded-lg flex-grow mr-4"
            >
              {showAlert && (
                <AlertComponent
                  type="danger"
                  message={error || 'Flashcard agregada exitosamente.'}
                  onClose={() => setShowAlert(false)}
                />
              )}

              <button
                type="submit"
                onClick={() => router.back()}
                className="flex items-center text-purple-600 mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>

              <FormField
                id="question"
                label="Pregunta"
                type="text"
                value={flashcard.question}
                onChange={handleChange}
                onBlur={handleBlur}
                error={false}
                touched={false}
                required
              />
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddFlashcard;
