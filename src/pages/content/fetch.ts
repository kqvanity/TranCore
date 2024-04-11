import {GoogleTranslateResponse} from "./translation/Translation";

export const fetchData = async (message: Message) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({remoteSiteUrl: message.remoteSiteUrl, msg: message.msg}, async (response: any) => {
            resolve(response)
            reject(response)
        })
    })
}

export const fetchTranslation = async (wordUrl: string): Promise<GoogleTranslateResponse> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({remoteSiteUrl: wordUrl, msg: "word"}, async (response: string) => {
            resolve(JSON.parse(response) as GoogleTranslateResponse)
            reject(response)
        })
    })
}

// TODO: That caused a problem, as the interface type isn't forced. One of the possible regressions is the inability to refactor constructs relying on that type
export interface Message {
    remoteSiteUrl: string
    msg: any
}
