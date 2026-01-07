import { GoogleTranslateResponse } from "./translation/Translation";
import { sendMessage } from "./chrome-api";

export const fetchData = async (message: Message): Promise<string> => {
    return await sendMessage({ remoteSiteUrl: message.remoteSiteUrl, msg: message.msg });
}

export const fetchTranslation = async (wordUrl: string): Promise<GoogleTranslateResponse> => {
    const response = await sendMessage({ remoteSiteUrl: wordUrl, msg: "word" });
    return JSON.parse(response) as GoogleTranslateResponse;
}

// TODO: That caused a problem, as the interface type isn't forced. One of the possible regressions is the inability to refactor constructs relying on that type
export interface Message {
    remoteSiteUrl: string
    msg: any
}
