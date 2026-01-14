import { getStorage, setStorage } from './chrome-api';
import { ConfigKeys } from '../../domain/entities/config-keys';

export interface UserConfiguration {
    fromLanguage: string;
    toLanguage: string;
}

const defaultConfiguration: UserConfiguration = {
    fromLanguage: 'en',
    toLanguage: 'de',
};

export const readConfiguration = async (): Promise<UserConfiguration> => {
    const storedConfig = await getStorage([
        ConfigKeys.FROM_LANGUAGE,
        ConfigKeys.TO_LANGUAGE,
    ]);

    const userConfig: UserConfiguration = {
        ...defaultConfiguration,
        fromLanguage: storedConfig[ConfigKeys.FROM_LANGUAGE] ?? defaultConfiguration.fromLanguage,
        toLanguage: storedConfig[ConfigKeys.TO_LANGUAGE] ?? defaultConfiguration.toLanguage,
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

    return await setStorage(newConfig);
}

