import './tippy'
import { parseGoogleTranslateResponse } from "./translation/Translation";
import { playAudio } from "./pronunciation/audio";
import { retrieveRecordings } from "./pronunciation/forvo";
import { search } from "fast-fuzzy";
import { autoUpdate, computePosition } from "@floating-ui/dom";
import { appendStyleElement } from "./styling";
import { readConfiguration } from "./configurations";

let highlightedWord = ""
let userConfiguration = await readConfiguration()

function createPopoverContainer() {
    let tooltip = document.createElement('div');
    tooltip.classList.add("tooltip")
    document.body.appendChild(tooltip);
}

async function appendingRecordings(word) {
    let recordingsDiv = document.createElement('div')
    recordingsDiv.className = 'recordings-div'

    console.log(userConfiguration)
    const langaugeCode = userConfiguration["fromLanguage"];
    let recordings = search(word, await retrieveRecordings(word, langaugeCode, 'en'), {
        returnMatchData: true,
        keySelector: (obj) => obj.title,
        threshold: 0.0
    }).map((object) => object.item)
    for (let recording of recordings) {
        let buttonRespectiveText = document.createElement('p')
        let buttonElement = document.createElement('button')
        let recordingListItem = document.createElement('div')
        recordingListItem.className = 'recording-list-item'
        buttonRespectiveText.textContent = recording.title
        buttonElement.setAttribute('href', recording.url)
        buttonRespectiveText.className = 'recording-name'
        buttonElement.className = 'recording-button'
        buttonElement.textContent = 'Play'            // Placholding content for now
        recordingListItem.appendChild(buttonElement)
        recordingListItem.appendChild(buttonRespectiveText)
        recordingsDiv.appendChild(recordingListItem)
    }
    return (recordingsDiv)
}

let audioRecordingsButtons = Array.from(document.getElementsByClassName('recording-button'))
audioRecordingsButtons.forEach((button) => {
    button.addEventListener('click', function handleButtonClick(event) {
        let buttonTextContent = event.target.textContent
        playAudio(recordingsObject[buttonTextContent][0])
    })
})
document.addEventListener('click', (event) => {
    let eventTarget = event.target
    if (eventTarget.className == 'recording-button') {
        playAudio(eventTarget.getAttribute('href'))
    }
})

async function appendTranslation(highlightedValue) {
    const translateElement = document.createElement('div')
    translateElement.classList.add('recording-list-item')
    translateElement.classList.add('translation')
    translateElement.textContent = await parseGoogleTranslateResponse(highlightedValue)
    return (translateElement)
}

createPopoverContainer()
appendStyleElement()
function onHighlight(event) {
    const virtualEl = {
        getBoundingClientRect: () => {
            const hlBoundingClientRect = document.getSelection().getRangeAt(0).getBoundingClientRect()
            if (hlBoundingClientRect.x <= 0 || hlBoundingClientRect.y <= 0) {
                return {
                    width: 0,
                    height: 0,
                    x: event.clientX,
                    y: event.clientY,
                    top: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                    bottom: event.clientY,
                };
            } else {
                return hlBoundingClientRect
            }
        },
        getClientRects: () => document.getSelection().getRangeAt(0).getClientRects()
    };
    const tooltip = document.querySelector(".tooltip");
    computePosition(virtualEl, tooltip).then(({x, y}) => {
        const selectedWord = document.getSelection().toString().toLowerCase().trim()
        if (highlightedWord !== selectedWord) {
            global.setTimeout(async () => {
                tooltip.appendChild(await appendTranslation(selectedWord))
                tooltip.appendChild(await appendingRecordings(selectedWord))
            }, 0)
            Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
                visibility: (selectedWord.length === 0) ? 'hidden' : 'visible',
            });
        }
        if (selectedWord.length === 0 || highlightedWord !== selectedWord) {
            tooltip.innerHTML = ""
            highlightedWord = selectedWord
        }
    });
}

document.addEventListener('mouseup', onHighlight);