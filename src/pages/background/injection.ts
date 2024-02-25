console.log('Content script')
document.addEventListener('click', (event) => {
    chrome.runtime.sendMessage({ msg: "mouseClicked", data: event.target }, (response) => {
        console.log(response.responseMsg);
    })
})
