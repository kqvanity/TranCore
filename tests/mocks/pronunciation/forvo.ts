
import { Pronunciation, Translation } from '../../src/pages/content/model';

export const retrieveRecordings = async (word: string, langCode: string): Promise<Pronunciation[]> => {
    return Promise.resolve([
        new Pronunciation('hello', 'https://audio.forvo.com/mp3/1.mp3', ['noun'], new Translation('hallo', 'de')),
        new Pronunciation('hello', 'https://audio.forvo.com/mp3/2.mp3', ['verb'], undefined),
    ]);
};
