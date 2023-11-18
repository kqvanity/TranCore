import {fetchData} from "../fetch";

function generateBaseUrls(word, srcLanguage, targetLanguage) {
    srcLanguage = (srcLanguage === undefined) ? 'auto' : srcLanguage
    targetLanguage = (targetLanguage === undefined) ? 'en' : targetLanguage
    return [
        `https://apicorporate.forvo.com/api2/v1.2/d6a0d68b18fbcf26bcbb66ec20739492/words-search/search/${word}/mode/words/language/${srcLanguage}/interface-language/${targetLanguage}`,
        `https://apicorporate.forvo.com/api2/v1.2/d6a0d68b18fbcf26bcbb66ec20739492/words-search/search/${word}/mode/all/interface-language/${targetLanguage}`,
        `https://apicorporate.forvo.com/api2/v1.2/d6a0d68b18fbcf26bcbb66ec20739492/word-pronunciations/word/${word}/language/${srcLanguage}/group-in-languages/true/interface-language/${targetLanguage}`
    ]
}

const loadJsonResponse = async (url) => {
    const jsonResponse = await fetchData(url, 'json')
    return (await JSON.parse(jsonResponse))
}

async function loadSingleWords(url) {
    let recordings = []
    const languageItems = (await loadJsonResponse(url))['data'][0]['items']
    for (let languageItem of languageItems) {
        recordings.push({
            title: languageItem['original'],
            url:  languageItem['standard_pronunciation']['pathmp3']
        })
    }
    return (recordings)
}

async function loadPhrases(url) {
    let recordings = []
    const phrases = (await loadJsonResponse(url))['dataPhrases'][0]['items']
    for (let phrase of phrases) {
        recordings.push({
            title: phrase['original'],
            url: phrase['standard_pronunciation']['pathmp3']
        })
    }
    return (recordings)
}

async function loadWordAlternatives(url) {
    let recordings = []
    const alternatives = (await loadJsonResponse(url))['data'][0]['items']
    for (let alt of alternatives) {
        recordings.push({
            title: alt['original'],
            url: alt['pathmp3']
        })
    }
    return (recordings)
}

export async function retrieveRecordings(word) {
    let urls = generateBaseUrls(word, 'de', 'en')
    let recordings = []
    await Promise.all([
        loadSingleWords(urls[0]).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {}),
        loadWordAlternatives(urls[2]).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {}),
        loadPhrases(urls[1]).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {})
    ])
    return (recordings)
}