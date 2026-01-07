
import React, { Suspense } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ReferenceElement } from '@floating-ui/dom';
import { getContainer } from '.';
import InnerContainer from './InnerContainer';
import { popupCardID } from './consts';
import { Word } from './model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { PronunciationList } from './Pronunciations';
import { Translator } from './Translator';
import { ApiContext } from './ApiContext';
import { fetchTranslation } from './fetch';
import { readConfiguration } from './configurations';
import { retrieveRecordings } from './pronunciation/forvo';
import { Tabs } from './Tabs';

// Persistent root and element for the popup
let popupRoot: Root | null = null;
let $popupCardElement: HTMLDivElement | null = null;

async function getOrCreatePopupCardElement(): Promise<HTMLDivElement> {
    if (!$popupCardElement) {
        $popupCardElement = document.createElement('div');
        $popupCardElement.id = popupCardID;
        const $container = await getContainer();
        $container.shadowRoot?.querySelector('div')?.appendChild($popupCardElement);
    }
    return $popupCardElement;
}

const WordHeader = ({ text }: { text: string }) => (
    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0', padding: '15px 15px 0 15px' }}>
        {text}
    </h1>
);

export async function showPopupCard(
    reference: ReferenceElement,
    word: Word,
    autoFocus: boolean | undefined = false
) {
    const $popupCard = await getOrCreatePopupCardElement();

    const PREFIX = '__yetone-openai-translator'
    const engine = new Styletron({
        container: $popupCard.parentElement ?? undefined,
        prefix: `${PREFIX}-styletron-`,
    })

    if (!popupRoot) {
        popupRoot = createRoot($popupCard);
    }

    popupRoot.render(
        <React.StrictMode>
            <GlobalSuspense>
                <ApiContext.Provider value={{
                    fetchTranslation,
                    readConfiguration,
                    retrieveRecordings,
                }}>
                    <InnerContainer reference={reference}>
                        <StyletronProvider value={engine}>
                            <WordHeader text={word.title} />
                            <Tabs tabs={[
                                {
                                    label: 'Translation',
                                    content: <Translator word={word} />
                                },
                                {
                                    label: 'Pronunciation',
                                    content: <PronunciationList word={{ 'term': word.title }} />
                                }
                            ]} />
                        </StyletronProvider>
                    </InnerContainer>
                </ApiContext.Provider>
            </GlobalSuspense>
        </React.StrictMode>
    )
}

export function hidePopupCard() {
    if (popupRoot && $popupCardElement) {
        popupRoot.unmount();
        $popupCardElement.remove(); // Remove the element from DOM
        popupRoot = null;
        $popupCardElement = null;
    }
}


function GlobalSuspense({ children }: { children: React.ReactNode }) {
    // TODO: a global loading fallback
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
