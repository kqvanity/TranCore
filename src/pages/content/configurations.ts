import { getStorage } from './chrome-api';

interface UserConfiguration {
    fromLanguage: string,
    toLanguage: string,
    key: string
}

export const readConfiguration = async (): Promise<UserConfiguration> => {
    const data = await getStorage(null);
    const userConfig: UserConfiguration = {
        fromLanguage: data["language"],
        toLanguage: "en",
        key: data["key"]
    }
    return (userConfig)
}
