import { fetchData } from "../fetch";
import { Pronunciation, Translation } from "../model";

const loadJsonResponse = async (url: string) => {
  const jsonResponse = await fetchData({ remoteSiteUrl: url, msg: "json" });
  return await JSON.parse(String(jsonResponse));
};

const loadPronunciations = async (url: string): Promise<Pronunciation[]> => {
  let recordings: Pronunciation[] = [];
  const response = await loadJsonResponse(url);
  for (let element of response) {
    const pronunciation = new Pronunciation(
      element["title"],
      element["url"],
      element["tags"],
      element["translation"],
    );
    pronunciation.title = pronunciation.title.toLowerCase();
    recordings.push(pronunciation);
  }
  return recordings;
}

export async function retrieveRecordings(
    word: string,
    langCode = 'en'
){
    const endPoint = `http://kam:9999/pronunciations/${word}?code=${langCode}`
    const recordings: Pronunciation[] = await loadPronunciations(endPoint)
    return (recordings.sort((a, b) => a.title.length - b.title.length))
}
