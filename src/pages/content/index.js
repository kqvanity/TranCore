import './tippy'
import {parseGoogleTranslateResponse} from "./translation/Translation";
import {playAudio} from "./pronunciation/audio";
import {retrieveRecordings} from "./pronunciation/forvo";
import {sortRecordings} from "./pronunciation/utils";
import {search} from "fast-fuzzy";
import {autoUpdate, computePosition} from "@floating-ui/dom";

let highlightedWord = ""

function createPopoverContainer() {
    let popover = document.createElement('div');
    popover.classList.add("tooltip")
    document.body.appendChild(popover);
}

async function appendingRecordings(word) {
    let recordingsDiv = document.createElement('div')
    recordingsDiv.className = 'recordings-div'

    // Mainly to hide the scrollbar on chrome & opera & safari
    let popoverStyleElement = document.getElementById('popover-style')
    if (!popoverStyleElement) {
        popoverStyleElement = document.createElement('style')
        popoverStyleElement.id = 'popover-style'
        document.body.appendChild(popoverStyleElement)
    }
    // FIXME: The current popover box doesn't work in certain websites/situations.
    // FIXME: The z-index of the popover should only exceed the srcElement, to avoid floating other elements i.e., when the user scroll, it can get hidden below other elements
    popoverStyleElement.innerHTML = `
		div.recordings-div {
			display: flex;
			text-align: left;
			flex-direction: column;
			align-items: flex-start;
			word-wrap: break-word;
			position: absolute;
			width: 100%;
			height: 100%;
			overflow: scroll;
		}
		div.recordings-div::-webkit-scrollbar { display: none }
		div.recording-list-item {
			display: flex;
		}
		button.recording-button {
			background-color: gray;
			color: white;
			font-family: sans-serif;
			font-size:small;
			font-weight:lighter;
			border-radius: 5px;
			order-color: lightblue;
			margin-bottom: 2px;
			padding:2px;
		}
		p.recording-name {
			color: black;
			font-size: small;
			font-family: sans-serif;
			display: float-left;
		}
	`

    let recordings = search(word, await retrieveRecordings(word, 'de', 'en'), {
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

/* BUG
 * - [x] Selecting multiple words i.e. phrases, does get a word of the phrase as the chosen one, then it exhibit an astray popover.
 *      - [ ] This bug only occurs when the user double clicks within a paragraph i.e. a word is selected, then the whole paragraph is selected. The initially selected words get an astray popover, while the whole text is now highlighted.
 *      	- It was actually because of something else. It was because of the 'await remote page' delaying the 'highlighted word's respective coordinates styling'. The solution was to move the 'await statement' after the 'popover styling' especially setting its coordinates.
 * - The popover box apparently derives its coloring / theming / studying from the respective word/element's parent
 * - Resizing the window i.e. resizing the whole window, opening dev tools, gets the popover astray
 * - hyphenated words don't get detected e.e., ever-growing
 * - Clicking inside the popover, but outside the click button, would close the popover
 * - CSS Inheritance does take effect sometimes, when you don't explicitly set the CSS property to the popover yourself.
 */

createPopoverContainer()
function onHighlight(event) {
    const virtualEl = {
        getBoundingClientRect: () => {
            const hlBoundingClientRect = document.getSelection().getRangeAt(0).getBoundingClientRect()
            // console.log(event.clientX, event.clientY, "What")
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
    tooltip.style = `
        background: #222;
        width: 250px;
        height: 150px;
        color: white;
        font-weight: bold;
        padding: 5px;
        border-radius: 4px;
        font-size: 90%;
        position: absolute;
        z-index: 9999999999999999999999999999999999999999999999;
    `;
    computePosition(virtualEl, tooltip).then(({x, y}) => {
        const selectedWord = document.getSelection().toString().toLowerCase().trim()
        console.log(selectedWord.length)
        console.log(x, y)
        Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`,
            visibility: (selectedWord.length === 0) ? 'hidden' : 'visible',
        });
        if (highlightedWord !== selectedWord) {
            global.setTimeout(async () => {
                tooltip.appendChild(await appendTranslation(selectedWord))
                tooltip.appendChild(await appendingRecordings(selectedWord))
            }, 0)
        }
        if (selectedWord.length === 0 || highlightedWord !== selectedWord) {
            tooltip.innerHTML = ""
            highlightedWord = selectedWord
        }
    });
}

document.addEventListener('mouseup', onHighlight);