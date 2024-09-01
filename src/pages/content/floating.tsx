import React, { Suspense, useMemo } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { type ReferenceElement } from '@floating-ui/dom'
import { getContainer, queryPopupCardElement } from '.'
import InnerContainer from './InnerContainer'
import { JssProvider } from 'react-jss'
import { popupCardID } from './consts'
import { create } from 'jss'
import preset from 'jss-preset-default'
import { Word } from './model'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { PronunciationList } from './Pronunciations'
import { Translator } from './Translator'

async function createPopupCard() {
    const $popupCard = document.createElement('div')
    $popupCard.id = popupCardID
    const $container = await getContainer()
    $container.shadowRoot?.querySelector('div')?.appendChild($popupCard)
    return $popupCard
}


export async function showPopupCard(reference: ReferenceElement, word: Word, autoFocus: boolean | undefined = false) {

    const $popupCard = await createPopupCard()

    let root = createRoot($popupCard)

    const JSS = JssProvider

    const jss = create().setup({
        ...preset(),
        insertionPoint: $popupCard?.parentElement ?? undefined
    })

    const PREFIX = '__yetone-openai-translator'
    const engine = new Styletron({
        container: $popupCard.parentElement ?? undefined,
        prefix: `${PREFIX}-styletron-`,
    })

    root.render(
        <React.StrictMode>
            <GlobalSuspense>
                <JSS jss={jss} classNamePrefix='__yetone-openai-translator-jss-'>
                    <InnerContainer reference={reference}>
                        <StyletronProvider value={engine}>
                            <Translator
                                title={word.title}
                            />
                            <PronunciationList
                                 term={word.title}
                            />
                        </StyletronProvider>
                    </InnerContainer>
                </JSS>
            </GlobalSuspense>
        </React.StrictMode>
    )
    // setExternalOriginalText(text)
}


function GlobalSuspense({ children }: { children: React.ReactNode }) {
    // TODO: a global loading fallback
    return <Suspense fallback={null}>{children}</Suspense>
}

