chrome.storage.local.get(["language"], (data) => {
    if (chrome.runtime.lastError) {
        console.error(`Error reading feature value ${featureValue}`)
    }
    document.getElementById("language").value = data["language"]
})

document.getElementById("language")?.addEventListener("change", () => {
    const language = document.getElementById("language").value;
    chrome.storage.local.set({ language: language }, () => {
        console.log(`Setting language flag to ${language}`)
    })
})