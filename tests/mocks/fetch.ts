
export const fetchTranslation = async (url: string) => {
    return Promise.resolve({
        dict: [
            {
                pos: 'noun',
                terms: ['hello', 'greeting'],
            },
        ],
        sentences: [{trans: 'Hello'}],
    });
};
