import { getStorage, setStorage } from './chrome-api';
import { ConfigKeys } from '../../domain/entities/config-keys';

export interface UserConfiguration {
    fromLanguage: string;
    toLanguage: string;
    key: string;
}

const defaultConfiguration: UserConfiguration = {
    fromLanguage: 'en',
    toLanguage: 'de',
    key: '',
};

export const readConfiguration = async (): Promise<UserConfiguration> => {
    const storedConfig = await getStorage([
        ConfigKeys.FROM_LANGUAGE,
        ConfigKeys.TO_LANGUAGE,
        ConfigKeys.API_KEY,
    ]);

    const userConfig: UserConfiguration = {
        ...defaultConfiguration,
        fromLanguage: storedConfig[ConfigKeys.FROM_LANGUAGE],
        toLanguage: storedConfig[ConfigKeys.TO_LANGUAGE],
        key: storedConfig[ConfigKeys.API_KEY],
    };

    return userConfig;
}

export const saveConfiguration = async (config: Partial<UserConfiguration>): Promise<void> => {
    const newConfig: { [key: string]: any } = {};

    if (config.fromLanguage !== undefined) {
        newConfig[ConfigKeys.FROM_LANGUAGE] = config.fromLanguage;
    }
    if (config.toLanguage !== undefined) {
        newConfig[ConfigKeys.TO_LANGUAGE] = config.toLanguage;
    }
    if (config.key !== undefined) {
        newConfig[ConfigKeys.API_KEY] = config.key;
    }

    return await setStorage(newConfig);
}

