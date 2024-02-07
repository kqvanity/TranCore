export const fetchData = async (remoteUrl: string, dataType: any) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ msg: dataType, remoteSiteUrl: remoteUrl }, async (response: any) => {
            resolve(response);
            reject(response)
        })
    })
}