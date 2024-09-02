chrome.storage.local.get(["language"], (data) => {
    if (chrome.runtime.lastError) {
        console.error(`Error reading feature value`)
    }
    // @ts-ignore
    document.getElementById("language").textContent = data["language"]
})

document.getElementById("language")?.addEventListener("change", () => {
    // @ts-ignore
    const language = document.getElementById("language").value;
    chrome.storage.local.set({ language: language }, () => {
        console.log(`Setting language flag to ${language}`)
    })
})


chrome.storage.local.get(["key"], (data) => {
    if (chrome.runtime.lastError) {
        console.error(`Error reading feature value`)
    }
    // @ts-ignore
    document.getElementById("key").value = data["key"]
})

document.getElementById("key")?.addEventListener("change", () => {
    // @ts-ignore
    const key = document.getElementById("key").value;
    chrome.storage.local.set({ key: key }, () => {
        console.log(`Setting key flag to ${key}`)
    })
})
