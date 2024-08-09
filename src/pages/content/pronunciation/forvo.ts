import { fetchData } from "../fetch";
import { Pronunciation } from "../model";

const loadJsonResponse = async (url: string) => {
    const jsonResponse = await fetchData({ remoteSiteUrl: url, msg: 'json' })
    return (await JSON.parse(String(jsonResponse)))
}

async function loadSingleWords(url: string) {
    let recordings: Pronunciation[] = []
    const response = await loadJsonResponse(url)
    for (let pronunciation of response) {
        recordings.push(new Pronunciation(
            pronunciation['Title'],
            pronunciation['URL'],
        )) 
    }
    return (recordings)
}

export async function retrieveRecordings(word: string, langCode = 'en'){
    const endPoint = `http://kam:9999/pronunciations/${word}?code=${langCode}`
    const recordings: Pronunciation[] = await loadSingleWords(endPoint)
    return (recordings.sort((a, b) => a.title.length - b.title.length))
}
