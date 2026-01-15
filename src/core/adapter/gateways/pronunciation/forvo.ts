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

  // Map over the pronunciations and fetch the audio data for each one.
  const pronunciations = await Promise.all(parsedResponse.data.map(async (p) => {
    const translation = p.translation ? new Translation(p.translation.title, p.translation.language_code) : undefined;

    // Fetch audio data as a stringified array, convert it to a Uint8Array,
    // create a Blob, and then create a local object URL.
    const audioDataString = await fetchDataFn({ remoteSiteUrl: p.url, msg: "audio" });
    const audioData = new Uint8Array(JSON.parse(audioDataString));
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' }); // Assuming mp3 format
    const blobUrl = URL.createObjectURL(audioBlob);

    const pronunciation = new Pronunciation(
        p.title,
        blobUrl, // Use the local blob URL
        p.tags,
        translation
    );
    pronunciation.title = pronunciation.title.toLowerCase();
    return pronunciation;
  }));

  return pronunciations;
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


