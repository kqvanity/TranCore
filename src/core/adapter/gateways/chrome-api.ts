
export const getStorage = (key: string | null | undefined) => {
    return chrome.storage.local.get(key);
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
