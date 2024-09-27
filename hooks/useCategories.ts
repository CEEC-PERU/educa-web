import { useEffect, useState } from 'react';
import { Category, CategoryL } from '../interfaces/Category';
import { getCategories , getCategoriesCategory} from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number , enterprise_id : number};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
       
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
       
      }
    };

    fetchCategories();
  }, []);

  
  return {
    categories,
    error,
    isLoading
  };
};


export const useCategoriesl = () => {
    const [categories, setCategories] = useState<CategoryL[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user, token } = useAuth();
    const userInfo = user as { id: number , enterprise_id : number};
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const fetchedCategories = await getCategoriesCategory();
          setCategories(fetchedCategories);
         
        } catch (error) {
          console.error('Error fetching categories:', error);
          setError('Error fetching categories');
         
        }
      };
  
      fetchCategories();
    }, []);
  
    
    return {
      categories,
      error,
      isLoading
    };
  };
  