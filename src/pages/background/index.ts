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
                let jsonResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dj=1&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&q=${encodeURIComponent(request.remoteSiteUrl)}`, {
                    method: 'GET',
                })
                responseData = await jsonResponse.json()
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
