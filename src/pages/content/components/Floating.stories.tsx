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
import MagicStickIcon from '../../../assets/img/magic-stick.svg';

const mockApi: Api = {
    fetchTranslation: async (word: string): Promise<GoogleTranslateResponse> => {
        return {
            dict: [{ pos: 'noun', terms: ['hello', 'greeting'] }],
            sentences: [{ trans: 'Hello' }],
            confidence: 1,
            ld_result: { srclangs: ['en'], srclangs_confidences: [1], extended_srclangs: ['en'] },
            src: 'en',
            spell: {},
        };
    },
    readConfiguration: async (): Promise<UserConfiguration> => {
        return {
            fromLanguage: 'en',
            toLanguage: 'de',
            key: 'test-api-key',
        };
    },
    retrieveRecordings: async (word: string, langCode: string): Promise<Pronunciation[]> => {
        return [
            new Pronunciation('hello', 'https://audio.forvo.com/mp3/1.mp3', ['noun'], undefined),
        ];
    },
};

const meta: Meta<typeof InnerContainer> = {
    title: 'Content/FloatingUI',
    component: InnerContainer,
    decorators: [
        (Story) => {
            const engine = new Styletron({
                prefix: `__yetone-openai-translator-styletron-`,
            });
            return (
                <ApiContext.Provider value={mockApi}>
                    <UIStateProvider>
                        <ViewProvider>
                            <StyletronProvider value={engine}>
                                <Story />
                            </StyletronProvider>
                        </ViewProvider>
                    </UIStateProvider>
                </ApiContext.Provider>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof InnerContainer>;

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
        toJSON: () => ({
            width: 100,
            height: 20,
            x: 100,
            y: 100,
            top: 100,
            left: 100,
            right: 200,
            bottom: 120,
        })
    }),
};

const word = new Word('If you\'d rather write any necessary JS yourself or want to integrate with a framework other than React or Vue, we also provide every Tailwind Ul component example as vanilla HTML that you can adapt yourself.');

const App = () => {
    const { showPronunciations } = useUIState();
    const { view, setView } = useView();

    const toggleView = () => {
        setView(view === 'dictionary' ? 'translator' : 'dictionary');
    };

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
            <div style={{ position: 'absolute', bottom: '15px', left: '15px' }}>
                <button onClick={toggleView} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={MagicStickIcon} alt="Toggle view" style={{ width: '20px', height: '20px' }} />
                </button>
            </div>
        </>
    )
}

export const Default: Story = {
    args: {
        reference: referenceElement,
        children: <App />,
    },
};