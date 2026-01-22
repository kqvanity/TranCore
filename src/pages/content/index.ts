import Fuse from 'fuse.js';
import { readConfiguration } from "../../core/adapter/gateways/configurations";
import { Pronunciation, Word } from '../../core/domain/entities/model';
import { containerID, popupCardOffset } from './consts'
import { showPopupCard, hidePopupCard } from "./floating";
import { retrieveRecordings } from "../../core/adapter/gateways/pronunciation/forvo";
import { getContainer } from "./container";
import { showSideIcon } from './side-icon';

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
    recordings = fuse.search(word).map((result) => result.item)
    return recordings
}

const mouseDownHandler = async (event: MouseEvent) => {
    console.log('[TranCore] Mouse down event fired.');
    const $container = document.getElementById(containerID);
    if (!$container) {
        return;
    }

    const $sideIcon = document.getElementById('trancore-side-icon');
    const path = event.composedPath();
    if (path.includes($container) || ($sideIcon && path.includes($sideIcon))) {
        return;
    }

    hidePopupCard();
}
document.addEventListener('mousedown', mouseDownHandler)

export const getClientX = (event: MouseEvent) => {
    return event.clientX
}

export const getClientY = (event: MouseEvent) => {
    return event.clientY
}

const mouseUpHandler = async (event: MouseEvent) => {
    console.log('[TranCore] Mouse up event fired.');
    const autoTranslate = true;

    window.setTimeout(async () => {
        const sel = window.getSelection();
        let text = (sel?.toString() ?? '').trim();
        if (!text) {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                const elem = event.target;
                text = elem.value.substring(elem.selectionStart ?? 0, elem.selectionEnd ?? 0).trim();
            }
        } else {
            if (autoTranslate === true) {
                console.log('[TranCore] Text selected: ', text);
                const x = getClientX(event);
                const y = getClientY(event);
                console.log('[TranCore] Showing popup card.');
                await showPopupCard(
                    { getBoundingClientRect: () => new DOMRect(x, y, popupCardOffset, popupCardOffset) },
                    new Word(text),
                    true
                );
            }
        }
    });
}

import { showSideIcon } from "./side-icon";

document.addEventListener('mouseup', mouseUpHandler)

showSideIcon();
