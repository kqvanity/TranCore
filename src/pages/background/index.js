chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    (async () => {
        try {
            response = await fetch(request.remoteSiteUrl, {
                method: 'GET',
            });
        } catch (error) {
            console.log('An error occurred', error)
        }
        if (request.msg == 'document' || request.msg == 'json') {
            responseData = await response.text()
        } else if (request.msg == 'audio') {
            // Preserving the ArrayBuffer object, before being automatically serialized by chrome
            responseData = JSON.stringify(Array.from(new Uint8Array(await response.arrayBuffer())));
        }
        sendResponse(responseData);
    })()
    return (true);
})
