interface UserConfiguration {
    fromLanguage: string,
    toLanguage: string
}

export const readConfiguration = async (): Promise<UserConfiguration> => {
    const data = await chrome.storage.local.get()
    const userConfig: UserConfiguration = {
        fromLanguage: data["language"],
        toLanguage: "en"
    }
    return (userConfig)
}