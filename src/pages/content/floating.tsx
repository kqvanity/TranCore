
import React, { Suspense } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ReferenceElement } from '@floating-ui/dom';
import { getContainer } from '.';
import InnerContainer from './components/InnerContainer';
import { popupCardID } from './consts';
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

    const App = () => (
        <React.StrictMode>
            <GlobalSuspense>
                <ApiContext.Provider value={{
                    fetchTranslation,
                    readConfiguration,
                    retrieveRecordings,
                }}>
                    <UIStateProvider>
                        <ViewProvider>
                            <MainApp word={word} reference={reference} engine={engine} />
                        </ViewProvider>
                    </UIStateProvider>
                </ApiContext.Provider>
            </GlobalSuspense>
        </React.StrictMode>
    );

    const MainApp = ({ word, reference, engine }: { word: Word, reference: ReferenceElement, engine: any }) => {
        const { showPronunciations } = useUIState();
        const { view, setView } = useView();

        const toggleView = () => {
            setView(view === 'dictionary' ? 'translator' : 'dictionary');
        };

        return (
            <InnerContainer reference={reference}>
                <StyletronProvider value={engine}>
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

                </StyletronProvider>
            </InnerContainer>
        )
    }

    popupRoot.render(<App />);
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
