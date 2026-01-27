import { fetchData as originalFetchData } from "../fetch";
import { Pronunciation, Translation } from "../../../domain/entities/model";
import { PronunciationResponseSchema } from "../../../domain/entities/schemas";

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
  const response = await loadJsonResponseFn(url, fetchDataFn);
  const parsedResponse = PronunciationResponseSchema.safeParse(response);

  if (!parsedResponse.success) {
    console.error("Failed to parse API response:", parsedResponse.error);
    return []; // Or handle the error more gracefully
  }

  return parsedResponse.data.map(p => {
    const translation = p.translation ? new Translation(p.translation.title, p.translation.language_code) : undefined;
    const pronunciation = new Pronunciation(
      p.title,
      p.url,
      p.tags, // Zod already cleaned this up
      translation
    );
    pronunciation.title = pronunciation.title.toLowerCase();
    return pronunciation;
  });
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
    const endPoint = `http://localhost:9999/pronunciations/${encodeURIComponent(word)}?code=${langCode}`
    const recordings: Pronunciation[] = await loadPronunciationsFn(endPoint, loadJsonResponseFn, fetchDataFn)
    return (recordings.sort((a, b) => a.title.length - b.title.length))
}


