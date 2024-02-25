import {fetchData} from "../fetch";

function generateBaseUrls(word, srcLanguage, targetLanguage) {
    // TODO: The second URL's response include duplicate information of the other urls, so maybe refactoring code to eliminate overhead requests might speed things up
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
    for (let dataPhrase of (await loadJsonResponse(url))['data']) {
        for (let languageItem of dataPhrase['items']) {
            recordings.push({
                title: languageItem['original'],
                url:  languageItem['standard_pronunciation']['realmp3']
            })
        }
    }
    return (recordings)
}

async function loadPhrases(url, languageCode) {
    let recordings = []
    for (let dataPhrase of (await loadJsonResponse(url))['dataPhrases']) {
        for (let phrase of dataPhrase['items']) {
            if (phrase['code'] == languageCode) {
                recordings.push({
                    title: phrase['original'],
                    url: phrase['standard_pronunciation']['realmp3']
                })
            }
        }
    }
    return (recordings)
}

async function loadWordAlternatives(url) {
    let recordings = []
    for (let dataPhrase of (await loadJsonResponse(url))['data']) {
        for (let alt of dataPhrase['items']) {
            recordings.push({
                title: alt['original'],
                url: alt['realmp3']
            })
        }
    }
    return (recordings)
}

export async function retrieveRecordings(word, srcLanguage = 'auto', targetLanguage = 'en'){
    let urls = generateBaseUrls(word, srcLanguage, targetLanguage)
    let recordings = []
    await Promise.all([
        loadSingleWords(urls[0]).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {}),
        loadWordAlternatives(urls[2]).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {}),
        loadPhrases(urls[1], srcLanguage).then((value) => {
            recordings = recordings.concat(value)
        }).catch((reason) => {})
    ])
    return (recordings)
}