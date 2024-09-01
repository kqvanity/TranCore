import Fuse from 'fuse.js';
import { readConfiguration } from "./configurations";
import { Pronunciation, Word } from './model';
import { containerID, popupCardID, popupCardOffset, popupThumbID, zIndex } from './consts'
import { attachEventsToContainer } from "./utils";
import { showPopupCard } from "./floating";
import { retrieveRecordings } from "./pronunciation/forvo";

export const loadPronunciations = async (word: string): Promise<Pronunciation[]> => {
    let userConfiguration = await readConfiguration()
    const langCode = userConfiguration["fromLanguage"];
    let recordings = await retrieveRecordings(word, langCode)
    const fuse = new Fuse(recordings ?? [], {
        keys: [
            "title"
        ],
        threshold: 1.0
    })
    console.log(recordings)
    recordings = fuse.search(word).map((result) => result.item)
    return recordings
}

export async function getContainer(): Promise<HTMLElement> {
    // Create the parent container [Rectangular container] if it's ot already existent
    let $container: HTMLElement | null = document.getElementById(containerID)
    if (!$container) {
        $container = document.createElement('div')
        $container.id = containerID

        // todo:
        attachEventsToContainer($container)
        $container.style.zIndex = zIndex

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const $container_: HTMLElement | null = document.getElementById(containerID)
                if ($container_) {
                    resolve($container_)
                    return
                }
                if (!$container) {
                    reject(new Error('Failed to create container'))
                    return
                }
                const shadowRoot = $container.attachShadow({ mode: 'open' })
                const $inner = document.createElement('div')
                shadowRoot.appendChild($inner)
                const $html = document.body.parentElement
                if ($html) {
                    $html.appendChild($container as HTMLElement)
                } else {
                    document.appendChild($container as HTMLElement)
                }
                resolve($container)
            }, 100)
        })
    }
    return new Promise((resolve) => {
        resolve($container as HTMLElement)
    })
}


export async function queryPopupCardElement(): Promise<HTMLElement | null> {
    const $container = await getContainer()
    return $container.shadowRoot?.querySelector(`#${popupCardID}`) as HTMLDivElement | null
}

async function hidePopupCard() {
    const $popupCard: HTMLElement | null = await queryPopupCardElement()

    if (!$popupCard) {
        return
    }
    // if (root) {
    //     root.unmount()
    //     root = null
    // }
    removeContainer()

    // $popupCard.remove()
}

async function removeContainer() {
    const $container = await getContainer()
    $container.remove()
}

const mouseDownHandler = async (event: MouseEvent) => {
    // mousedownTarget = event.target
    // const settings = await utils.getSettings()
    // hidePopupThumb()
    // if (!settings.pinned) {
        hidePopupCard()
    // }
}
document.addEventListener('mousedown', mouseDownHandler)

export const getClientX = (event: MouseEvent) => {
    return event.clientX
}

export const getClientY = (event: MouseEvent) => {
    return event.clientY
}

const mouseUpHandler = async (event: MouseEvent) => {
// const mouseUpHandler = async (event: UserEventType) => {
    // lastMouseEvent = event
    // const settings = await utils.getSettings()
    const autoTranslate = true
    const alwaysShowIcons = true

    let mousedownTarget = event.target

    if (
        mousedownTarget instanceof HTMLElement
    )

    // if (
    //     (mousedownTarget instanceof HTMLInputElement || mousedownTarget instanceof HTMLTextAreaElement)
    //     && settings.selectInputElementsText === false
    // ) {
    //     return
    // }

    window.setTimeout(async () => {
        const sel = window.getSelection()
        let text = (sel?.toString() ?? '').trim()
        if (!text) {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                const elem = event.target
                text = elem.value.substring(elem.selectionStart ?? 0, elem.selectionEnd ?? 0).trim()
            }
        } else {
            // if (settings.autoTranslate === true) {
            if (autoTranslate === true) {
                const x = getClientX(event)
                const y = getClientY(event)
                showPopupCard(
                    { getBoundingClientRect: () => new DOMRect(x, y, popupCardOffset, popupCardOffset) },
                    new Word(text)
                )
            }
            // else if (alwaysShowIcons === true && getCaretNodeType(event) === Node.TEXT_NODE) {
            //     showPopupThumb(text, getPageX(event) + popupCardOffset, getPageY(event) + popupCardOffset)
            // }
        }
    })
}

document.addEventListener('mouseup', mouseUpHandler)
