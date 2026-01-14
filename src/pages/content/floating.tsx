import React, { Suspense } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ReferenceElement } from '@floating-ui/dom';
import { getContainer } from './container';
import InnerContainer from './components/InnerContainer';
import { containerID, popupCardID } from './consts';
import { Word } from '../../core/domain/entities/model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ApiContext } from './ApiContext';
import { fetchTranslation } from '../../core/adapter/gateways/fetch';
import { readConfiguration } from '../../core/adapter/gateways/configurations';
import { retrieveRecordings } from '../../core/adapter/gateways/pronunciation/forvo';
import { sendMessage } from '../../core/adapter/gateways/chrome-api';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { PronunciationList } from './components/Pronunciations';
import { ViewProvider, useView } from './ViewContext';
import { Dictionary } from './components/Dictionary';
import { Footer } from './components/Footer';

// Persistent root and element for the popup
let popupRoot: Root | null = null;
let $popupCardElement: HTMLDivElement | null = null;

async function getOrCreatePopupCardElement(): Promise<HTMLDivElement> {
    if (!$popupCardElement) {
        console.log('[TranCore] getOrCreatePopupCardElement: creating and appending popup card element');
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
    console.log('[TranCore] showPopupCard: creating or getting popup card element');
    const $popupCard = await getOrCreatePopupCardElement();

    console.log('[TranCore] showPopupCard: creating Styletron instance');
    const insertionPointContainer = $popupCard.parentElement;

    const PREFIX = '__yetone-openai-translator'
    const engine = new Styletron({
        container: insertionPointContainer ?? undefined,
        prefix: `${PREFIX}-styletron-`,
    })

    if (!popupRoot) {
        console.log('[TranCore] showPopupCard: creating React root');
        popupRoot = createRoot($popupCard);
    }

    const App = () => (
        <React.StrictMode>
            <GlobalSuspense>
                <ApiContext.Provider value={{
                    fetchTranslation,
                    readConfiguration,
                    retrieveRecordings,
                    sendMessage,
                }}>
                        <ViewProvider word={word}>
                            <MainApp word={word} reference={reference} engine={engine} />
                        </ViewProvider>
                </ApiContext.Provider>
            </GlobalSuspense>
        </React.StrictMode>
    );

    const MainApp = ({ word, reference, engine }: { word: Word, reference: ReferenceElement, engine: any }) => {
        const { view } = useView();

        return (
            <StyletronProvider value={engine}>
                <InnerContainer reference={reference}>
                    <Header />
                    {view === 'dictionary' ? (
                        <>
                            <Dictionary word={word} />
                            <PronunciationList word={{ 'term': word.title }} />
                        </>
                    ) : (
                        <>
                            <InputArea text={word.title} />
                            <OutputArea word={word} />
                            <PronunciationList word={{ 'term': word.title }} />
                        </>
                    )}
                    <Footer />
                </InnerContainer>
            </StyletronProvider>
        )
    }

    console.log('[TranCore] showPopupCard: rendering app');
    popupRoot.render(<App />);
    console.log('[TranCore] showPopupCard: rendering app successful');
}

export function hidePopupCard() {
    console.log('[TranCore] Hiding popup card.');
    if (popupRoot) {
        popupRoot.unmount();
        popupRoot = null;
    }
    if ($popupCardElement) {
        $popupCardElement.remove();
        $popupCardElement = null;
    }
    const $container = document.getElementById(containerID);
    if ($container) {
        $container.remove();
    }
}


function GlobalSuspense({ children }: { children: React.ReactNode }) {
    // TODO: a global loading fallback
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
