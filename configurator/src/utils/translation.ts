/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const googleTranslate = async (
  textToTranslate: string | string[],
  targetLanguage: string,
  translateApiKey: string
): Promise<{ translatedText: string; detectedSourceLanguage?: string }[]> => {
  const response = await axios.post(`${API_URL}?key=${translateApiKey}`, {
    q: textToTranslate,
    target: targetLanguage,
  });

  return response.data.data.translations;
};

export { googleTranslate };
