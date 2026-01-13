import { fetchData as originalFetchData } from "../fetch";
import { Pronunciation, Translation } from "../../../domain/entities/model";

// --- Internal Helper Functions (for testability) ---
// These are not exported, but retrieveRecordings can be made to accept them
// for dependency injection in tests.

type FetchDataFunction = typeof originalFetchData;
type LoadJsonResponseFunction = (url: string, fetchDataFn: FetchDataFunction) => Promise<any>;
type LoadPronunciationsFunction = (url: string, loadJsonResponseFn: LoadJsonResponseFunction, fetchDataFn: FetchDataFunction) => Promise<Pronunciation[]>;

const _loadJsonResponse: LoadJsonResponseFunction = async (url, fetchDataFn) => {
  const jsonResponse = await fetchDataFn({ remoteSiteUrl: url, msg: "json" });
  return JSON.parse(String(jsonResponse));
};

const _loadPronunciations: LoadPronunciationsFunction = async (url, loadJsonResponseFn, fetchDataFn) => {
  let recordings: Pronunciation[] = [];
  const response = await loadJsonResponseFn(url, fetchDataFn);
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

// --- Public API ---

export async function retrieveRecordings(
    word: string,
    langCode = 'en',
    // Injected dependencies for testability
    loadPronunciationsFn: LoadPronunciationsFunction = _loadPronunciations,
    loadJsonResponseFn: LoadJsonResponseFunction = _loadJsonResponse,
    fetchDataFn: FetchDataFunction = originalFetchData,
){
    const endPoint = `http://localhost:9999/pronunciations/${word}?code=${langCode}`
    const recordings: Pronunciation[] = await loadPronunciationsFn(endPoint, loadJsonResponseFn, fetchDataFn)
    return (recordings.sort((a, b) => a.title.length - b.title.length))
}

