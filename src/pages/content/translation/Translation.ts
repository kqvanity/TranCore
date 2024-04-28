import { fetchTranslation } from "../fetch";

export async function parseGoogleTranslateResponse(word: string) {
    const googleApi: string = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dj=1&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&q=${encodeURIComponent(word)}`
    let response: GoogleTranslateResponse = await fetchTranslation(googleApi)
    let returnVal = ''
    try {
        response.dict.forEach (element => {
            returnVal += `(${element.pos})\n`
            returnVal += `${element.terms.toString()}\n`
        })
    } catch {
        returnVal += `(Sentence)\n`
        // TODO: Employ a more appropriate approach later on!
        try {
            returnVal += `${response.sentences[0].trans}`
        } catch (e) { }
    }
    return (returnVal)
}

interface Sentence {
    trans: string;
    orig?: string;
    backend?: number;
    src_translit?: string;
}

interface Entry {
    word: string;
    reverse_translation: string[];
    score: number;
}

interface DictEntry {
    pos: string;
    terms: string[];
    entry: Entry[];
    base_form: string;
    pos_enum?: number;
}

interface LdResult {
    srclangs: string[];
    srclangs_confidences: number[];
    extended_srclangs: string[];
}

export interface GoogleTranslateResponse {
    confidence: number;
    dict: DictEntry[];
    ld_result: LdResult;
    sentences: Sentence[];
    src: string;
    spell: Record<string, unknown>; // Use Record for unknown structure
}
