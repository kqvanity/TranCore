
export const getStorage = (keys: string | string[] | { [key: string]: any } | null) => {
    return chrome.storage.local.get(keys);
}

export const setStorage = (items: { [key: string]: any }): Promise<void> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export const sendMessage = (message: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(response);
        });
    });
}
