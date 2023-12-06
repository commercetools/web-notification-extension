import { cleanSlug } from './slug';

const escapedJSON = (object: unknown) =>
  JSON.stringify(object, null, 2).replace(/\//g, '\\/').replace(/\n/g, '');

const getTranslationKey = (
  sourceLang: string,
  targetLang: string,
  text: string
) => {
  const key = `${sourceLang}_to_${targetLang}__${cleanSlug(text)}`;
  return key;
};

export { escapedJSON, getTranslationKey };
