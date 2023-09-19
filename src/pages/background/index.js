chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
        let responseData = ""
        try {
            response = await fetch(request.remoteSiteUrl, {
                method: 'GET',
            });
        } catch (error) {
            console.log('An error occurred', error)
        }
        if (request.msg == 'document' || request.msg == 'json') {
            responseData = await response.text()
        } else if (request.msg == 'word') {
            try {
                let jsonResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(request.remoteSiteUrl)}`)
                responseData = (await jsonResponse.json())[0][0][0]
            } catch(e) {
                responseData = `Catch ${e.message}`
            }
        } else if (request.msg == 'audio') {
            // Preserving the ArrayBuffer object, before being automatically serialized by chrome
            responseData = JSON.stringify(Array.from(new Uint8Array(await response.arrayBuffer())));
        }
        sendResponse(responseData);
    })()
    return (true);
})
