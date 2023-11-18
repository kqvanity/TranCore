export const fetchData = async (remoteUrl, dataType) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ msg: dataType, remoteSiteUrl: remoteUrl }, async (response) => {
            resolve(response);
            reject(response)
        })
    })
}