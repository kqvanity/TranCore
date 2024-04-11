import MessageSender = chrome.runtime.MessageSender;
import { Message } from "../content/fetch";

chrome.runtime.onMessage.addListener((request: Message, sender: MessageSender, sendResponse: (response: any) => void) => {
    (async() => {
        let responseData = ""
        const response = await fetch(request.remoteSiteUrl, { method: 'GET' })
        if (request.msg == 'document' || request.msg == 'json') {
            responseData = await response.text()
        } else if (request.msg == 'word') {
            try {
                responseData = await (await fetch(request.remoteSiteUrl, { method: 'GET' })).text()
            } catch(error) {
                responseData = `Catch ${error}`
            }
        } else if (request.msg == 'audio') {
            // Preserving the ArrayBuffer object, before being automatically serialized by chrome
            responseData = JSON.stringify(Array.from(new Uint8Array(await response.arrayBuffer())));
        }
        sendResponse(responseData);
    })()
    return (true)
})
