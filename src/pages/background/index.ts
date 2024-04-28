import MessageSender = chrome.runtime.MessageSender;
import { Message } from "../content/fetch";

chrome.runtime.onMessage.addListener((request: Message, sender: MessageSender, sendResponse: (response: any) => void) => {
    (async() => {
    let responseData = ""
    const response = await fetch(request.remoteSiteUrl, {
        method: "GET",
        credentials: "omit"
    })
    switch (request.msg) {
        case "document":
        case "json":
            responseData = await response.text()
            break;
        case "word":
            try {
                responseData = await (await fetch(request.remoteSiteUrl, { method: "GET" })).text()
            } catch(error) {
                responseData = `Catch ${error}`
            }
            break;
        case "audio":
            // Preserving the ArrayBuffer object, before being automatically serialized by chrome
            responseData = JSON.stringify(Array.from(new Uint8Array(await response.arrayBuffer())));
            break;
        default:
            break;
    }
    sendResponse(responseData);
    })()
    return (true)
})
