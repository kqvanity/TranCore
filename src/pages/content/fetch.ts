// import { sendMessage } from "webext-bridge/background";
import {GoogleTranslateResponse} from "./translation/Translation";

export const fetchData = async (message: Message): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({remoteSiteUrl: message.remoteSiteUrl, msg: message.msg}, async (response: any) => {
            resolve(response)
            reject(response)
        })
    })
    // const response = await sendMessage(
    //     message.remoteSiteUrl,
    //     {},
    //     "background"
    // );
    // console.log(response)
    // console.log(typeof response)
    // // resturn a string promise
    // return new Promise((resolve, reject) => {
    //     resolve("")
    //     reject(response)
    // })
    // // return response;
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
