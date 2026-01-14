
import { createContext, useContext } from 'react';
import { GoogleTranslateResponse } from '../../core/adapter/gateways/translation/Translation';
import { Pronunciation } from '../../core/domain/entities/model';

export interface UserConfiguration {
    fromLanguage: string,
    toLanguage: string,
    key: string
}

export interface Api {
    fetchTranslation: (word: string) => Promise<GoogleTranslateResponse>;
    readConfiguration: () => Promise<UserConfiguration>;
    retrieveRecordings: (word: string, langCode: string) => Promise<Pronunciation[]>;
    sendMessage: (message: any) => Promise<any>;
}

export const ApiContext = createContext<Api | null>(null);

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
