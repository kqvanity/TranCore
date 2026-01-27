
export function getGoogleTranslateUrl(word: string) {
    return `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dj=1&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&q=${encodeURIComponent(word)}`;
}

export function formatGoogleTranslateResponse(response: GoogleTranslateResponse) {
    const formattedOutput: { pos?: string; terms?: string; sentence?: string }[] = [];

    try {
        response.dict.forEach(element => {
            formattedOutput.push({ pos: element.pos, terms: element.terms.join(', ') });
        });
    } catch {
        // Fallback for when dict is not available (e.g., for sentences)
        let sentenceText = '';
        try {
            response.sentences.forEach(sentence => {
                if (sentence.trans) {
                    sentenceText += sentence.trans;
                }
            });
            if (sentenceText) {
                formattedOutput.push({ sentence: sentenceText });
            }
        } catch (e) { /* ignore */ }
    }
    return formattedOutput;
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
