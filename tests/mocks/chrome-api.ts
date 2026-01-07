
export const getStorage = async (key: string | null | undefined) => {
    console.log('--- MOCK getStorage CALLED ---');
    return Promise.resolve({
        language: 'en',
        key: 'test-api-key',
    });
};

export const sendMessage = async (message: any) => {
    console.log('--- MOCK sendMessage CALLED ---', message);
    if (message.msg === 'word') {
        return Promise.resolve(JSON.stringify({
            dict: [
                {
                    pos: 'noun',
                    terms: ['hello', 'greeting'],
                },
            ],
            sentences: [{ trans: 'Hello' }],
        }));
    }
    if (message.msg === 'json') {
        return Promise.resolve(JSON.stringify([
            {
                title: 'hello',
                url: 'https://audio.forvo.com/mp3/1.mp3',
                tags: ['noun'],
                translation: {
                    title: 'hallo',
                    language_code: 'de',
                }
            }
        ]));
    }
    return Promise.resolve('mock response');
};
