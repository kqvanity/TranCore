import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import InnerContainer from './InnerContainer';
import { Word, Pronunciation } from '../../../core/domain/entities/model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ReferenceElement } from '@floating-ui/dom';
import { ApiContext, Api, UserConfiguration } from '../ApiContext';
import { GoogleTranslateResponse } from '../../../core/adapter/gateways/translation/Translation';
import { UIStateProvider, useUIState } from '../UIStateContext';
import { ViewProvider, useView } from '../ViewContext';
import { Header } from './Header';
import { InputArea } from './InputArea';
import { OutputArea } from './OutputArea';
import { PronunciationList } from './Pronunciations';
import { Dictionary } from './Dictionary';
// import { faker } from '@faker-js/faker'; // Remove faker import

const mockApi: Api = {
    fetchTranslation: async (word: string): Promise<GoogleTranslateResponse> => {
        const isSingleWord = !word.includes(' ');
        return {
            dict: isSingleWord ? [{ pos: 'noun', terms: [word, `definition of ${word}`] }] : [],
            sentences: [{ trans: `Translated: ${word}` }],
            confidence: 1,
            ld_result: { srclangs: ['en'], srclangs_confidences: [1], extended_srclangs: ['en'] },
            src: 'en',
            spell: {},
        };
    },
    readConfiguration: async (): Promise<UserConfiguration> => {
        return { fromLanguage: 'en', toLanguage: 'de', key: 'test-api-key' };
    },
    retrieveRecordings: async (word: string, langCode: string): Promise<Pronunciation[]> => {
        return [
            new Pronunciation(word, 'https://audio.forvo.com/mp3/1.mp3', ['noun'], undefined),
        ];
    },
};

const textSamples = {
    'Single Word': 'hello',
    'Long Sentence': 'This is a longer sentence with multiple words to test the paragraph view in the Storybook preview.',
};

const meta: Meta<typeof InnerContainer> = {
    title: 'Content/FloatingUI',
    component: InnerContainer,
    decorators: [
        (Story, { args }) => {
            const engine = new Styletron({
                prefix: `__yetone-openai-translator-styletron-`,
            });
            console.log('args.textType:', args.textType);
            const textType = args.textType || 'Single Word';
            const text = textSamples[textType];
            const word = new Word(text);
            return (
                <ApiContext.Provider value={mockApi}>
                    <UIStateProvider>
                        <ViewProvider word={word}>
                            <StyletronProvider value={engine}>
                                <Story args={{ ...args, word }} />
                            </StyletronProvider>
                        </ViewProvider>
                    </UIStateProvider>
                </ApiContext.Provider>
            );
        },
    ],
    argTypes: {
        textType: {
            control: {
                type: 'select',
            },
            options: Object.keys(textSamples),
            defaultValue: 'Single Word',
        },
    },
};

export default meta;

type Story = StoryObj<typeof InnerContainer & { word: Word }>;

const referenceElement: ReferenceElement = {
    getBoundingClientRect: () => ({
        width: 100,
        height: 20,
        x: 100,
        y: 100,
        top: 100,
        left: 100,
        right: 200,
        bottom: 120,
        toJSON: () => ({ width: 100, height: 20, x: 100, y: 100, top: 100, left: 100, right: 200, bottom: 120 }),
    }),
};

const App = ({ word }: { word: Word }) => {
    const { showPronunciations } = useUIState();
    const { view } = useView();

    return (
        <>
            <Header />
            {view === 'dictionary' ? (
                <>
                    <Dictionary word={word} />
                    {showPronunciations && <PronunciationList word={{ 'term': word.title }} />}
                </>
            ) : (
                <>
                    <InputArea text={word.title} />
                    <OutputArea word={word} />
                    {showPronunciations && <PronunciationList word={{ 'term': word.title }} />}
                </>
            )}
        </>
    );
};

export const Default: Story = {
    args: {
        reference: referenceElement,
    },
    render: (args) => <InnerContainer {...args}><App word={args.word} /></InnerContainer>,
};