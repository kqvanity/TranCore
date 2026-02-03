import Fuse from 'fuse.js';
import { readConfiguration } from "../../core/adapter/gateways/configurations";
import { Pronunciation, Word } from '../../core/domain/entities/model';
import { containerID, popupCardID, popupCardOffset } from './consts'
import { showPopupCard, hidePopupCard } from "./floating";
import { retrieveRecordings } from "../../core/adapter/gateways/pronunciation/forvo";
import { getContainer } from "./container";
import { getSideIcon, showSideIcon } from './side-icon';

let savedSelectionRange: Range | null = null;
let shouldRestoreOnMouseUp = false;

function restoreSelection() {
    setTimeout(() => {
        if (savedSelectionRange) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelectionRange);
            }
        }
    }, 10);
}


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

    const isPopupCardVisible = $container.shadowRoot?.querySelector('#' + popupCardID);
    if (!isPopupCardVisible) {
        return;
    }

    const $sideIcon = getSideIcon();
    const path = event.composedPath();
    if (path.includes($container) || ($sideIcon && path.includes($sideIcon))) {
        return;
    }

    hidePopupCard();
    shouldRestoreOnMouseUp = true;
}
document.addEventListener('mousedown', mouseDownHandler)

const scrollHandler = () => {
    hidePopupCard();
    shouldRestoreOnMouseUp = true;
};
document.addEventListener('scroll', scrollHandler, true);

export const getClientX = (event: MouseEvent) => {
    return event.clientX
}

export const getClientY = (event: MouseEvent) => {
    return event.clientY
}

const mouseUpHandler = async (event: MouseEvent) => {
    console.log('[TranCore] Mouse up event fired.');

    if (shouldRestoreOnMouseUp) {
        shouldRestoreOnMouseUp = false;
        restoreSelection();
        return;
    }

    const autoTranslate = true;

    window.setTimeout(async () => {
        const sel = window.getSelection();
        // Save the selection range if there is a selection
        if (sel && sel.rangeCount > 0 && sel.toString().trim().length > 0) {
            savedSelectionRange = sel.getRangeAt(0).cloneRange();
        } else {
            savedSelectionRange = null;
        }

        let text = sel?.toString().trim() ?? '';
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

document.addEventListener('mouseup', mouseUpHandler)

showSideIcon();

