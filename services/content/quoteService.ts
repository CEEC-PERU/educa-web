import axios from "axios";
import { Quote } from "../../interfaces/Quote/QuoteInterfaces";
import { API_GET_QUOTES_DAILY } from "../../utils/Endpoints";

export const getDailyQuote = async (
  userToken: string,
): Promise<Quote | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get(API_GET_QUOTES_DAILY, config);
    if (response.status === 204 || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching daily quote:", error);
    throw new Error("Error fetching daily quote");
  }
};
