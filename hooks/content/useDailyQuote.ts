import { useEffect, useState } from "react";
import { Quote } from "../../interfaces/Quote/QuoteInterfaces";
import { getDailyQuote } from "../../services/content/quoteService";
import { useAuth } from "../../context/AuthContext";

export const useDailyQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchDailyQuote = async () => {
      try {
        setIsLoading(true);
        const data = await getDailyQuote(token);
        setQuote(data);
      } catch (err) {
        console.error("Error al obtener la frase del día:", err);
        setQuote(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyQuote();
  }, [token]);

  return { quote, isLoading };
};
