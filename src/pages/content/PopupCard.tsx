import React, { Suspense } from 'react';
import { type ReferenceElement } from '@floating-ui/dom';
import { Word } from '../../core/domain/entities/model';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ApiContext } from './ApiContext';
import { fetchTranslation } from '../../core/adapter/gateways/fetch';
import { readConfiguration } from '../../core/adapter/gateways/configurations';
import { retrieveRecordings } from '../../core/adapter/gateways/pronunciation/forvo';
import { sendMessage } from '../../core/adapter/gateways/chrome-api';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { PronunciationList } from './components/Pronunciations';
import { ViewProvider, useView } from './ViewContext';
import { Dictionary } from './components/Dictionary';
import InnerContainer from './components/InnerContainer';

type PopupCardProps = {
    word: Word;
    reference: ReferenceElement;
    engine: Styletron;
};

const MainApp = ({ word, reference, engine }: PopupCardProps) => {
    const { view } = useView();

    return (
        <StyletronProvider value={engine}>
            <InnerContainer reference={reference}>
                {view === 'dictionary' ? (
                    <>
                        <Dictionary word={word} />
                        <PronunciationList />
                    </>
                ) : (
                    <>
                        <InputArea text={word.title} />
                        <OutputArea />
                        <PronunciationList />
                    </>
                )}
            </InnerContainer>
        </StyletronProvider>
    )
}

function GlobalSuspense({ children }: { children: React.ReactNode }) {
    // TODO: a global loading fallback
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}

export const PopupCard = ({ word, reference, engine }: PopupCardProps) => (
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
