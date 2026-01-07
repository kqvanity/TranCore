import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import InnerContainer from './InnerContainer';
import { Translator } from './Translator';
import { PronunciationList } from './Pronunciations';
import { Word, Pronunciation } from './model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ReferenceElement } from '@floating-ui/dom';
import { ApiContext, Api, UserConfiguration } from './ApiContext';
import { GoogleTranslateResponse } from './translation/Translation';

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
                    <StyletronProvider value={engine}>
                        <Story />
                    </StyletronProvider>
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

const word = new Word('hello');

export const Default: Story = {
    args: {
        reference: referenceElement,
        children: (
            <>
                <Translator word={word} />
                {/* <PronunciationList word={{ 'term': 'hello' }} /> */}
            </>
        ),
    },
};
