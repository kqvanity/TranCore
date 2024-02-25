import {fetchData} from "../fetch";

export async function parseGoogleTranslateResponse(word) {
    let response = await fetchData(word, 'word')
    let returnVal = ''
    try {
        returnVal += `[${response.spell.spell_res.toString()}]`
    } catch {}
    try {
        response.dict.forEach (element => {
            returnVal += `(${element.pos})\n`
            returnVal += `${element.terms.toString()}\n`
        })
    } catch {
        returnVal += `(Sentence)\n`
        returnVal += `${response.sentences[0].trans}`
    }
    return (returnVal)
}