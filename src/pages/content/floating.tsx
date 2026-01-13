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
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { PronunciationList } from './components/Pronunciations';
import { UIStateProvider, useUIState } from './UIStateContext';
import { ViewProvider, useView } from './ViewContext';
import { Dictionary } from './components/Dictionary';
import { Footer } from './components/Footer';
import { JssProvider, createGenerateId } from 'react-jss';
import { create } from 'jss';
import jssPreset from 'jss-preset-default';

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

    const insertionPointContainer = $popupCard.parentElement;
    const jss = create(jssPreset());
    if (insertionPointContainer) {
        const commentNode = document.createComment('jss-insertion-point');
        insertionPointContainer.appendChild(commentNode);
        jss.setup({ insertionPoint: commentNode });
    }
    const generateId = createGenerateId();


    const PREFIX = '__yetone-openai-translator'
    const engine = new Styletron({
        container: insertionPointContainer ?? undefined,
        prefix: `${PREFIX}-styletron-`,
    })

    if (!popupRoot) {
        popupRoot = createRoot($popupCard);
    }

    const App = () => (
        <JssProvider jss={jss} generateId={generateId}>
            <React.StrictMode>
                <GlobalSuspense>
                    <ApiContext.Provider value={{
                        fetchTranslation,
                        readConfiguration,
                        retrieveRecordings,
                    }}>
                        <UIStateProvider>
                            <ViewProvider word={word}>
                                <MainApp word={word} reference={reference} engine={engine} />
                            </ViewProvider>
                        </UIStateProvider>
                    </ApiContext.Provider>
                </GlobalSuspense>
            </React.StrictMode>
        </JssProvider>
    );

    const MainApp = ({ word, reference, engine }: { word: Word, reference: ReferenceElement, engine: any }) => {
        const { showPronunciations } = useUIState();
        const { view } = useView();

        return (
            <StyletronProvider value={engine}>
                <InnerContainer reference={reference}>
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
                    <Footer />
                </InnerContainer>
            </StyletronProvider>
        )
    }

    try {
        console.log('[TranCore] showPopupCard: rendering app');
        popupRoot.render(<App />);
        console.log('[TranCore] showPopupCard: rendering app successful');
    } catch (e) {
        console.error('[TranCore] Error rendering app:', e);
    }
}

export function hidePopupCard() {
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
