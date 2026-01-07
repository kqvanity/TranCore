import React, { Suspense, useMemo } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { type ReferenceElement } from '@floating-ui/dom'
import { getContainer, queryPopupCardElement } from '.'
import InnerContainer from './InnerContainer'
import { popupCardID } from './consts'
import { Word } from './model'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { PronunciationList } from './Pronunciations'
import { Translator } from './Translator'

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

import { ApiContext } from './ApiContext';
import { fetchTranslation } from './fetch';
import { readConfiguration } from './configurations';
import { retrieveRecordings } from './pronunciation/forvo';

// ... (previous code)

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
                            <Translator word={word} />
                            <PronunciationList word={{ term: word.title }} />
                        </StyletronProvider>
                    </InnerContainer>
                </ApiContext.Provider>
            </GlobalSuspense>
        </React.StrictMode>
    )
// ... (rest of the code)
    // Removed direct return of root, as it's now managed persistently.
    // Logic for hiding/unmounting should be separate.
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