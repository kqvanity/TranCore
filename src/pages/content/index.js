import './tippy'
import {parseGoogleTranslateResponse} from "./translation/Translation";
import tippy from "tippy.js";
import {playAudio} from "./pronunciation/audio";
import {retrieveRecordings} from "./pronunciation/forvo";
import {sortRecordings} from "./pronunciation/utils";
import {search} from "fast-fuzzy";

const {fuzzy} = require("fast-fuzzy")

function createPopoverContainer() {
    let popover = document.createElement('div');
    popover.className = 'parent-popover'
    document.body.appendChild(popover);
}

async function appendingRecordings(word) {
    let recordings;
    let popover = document.getElementsByClassName('parent-popover')[0]
    let recordingsDiv = document.createElement('div')
    recordingsDiv.className = 'recordings-div'
    popover.appendChild(recordingsDiv)

    // New ripped styling!
    const selectedWordCoordinates = window.getSelection().getRangeAt(0).getBoundingClientRect()
    const documentCoordinates = document.body.parentNode.getBoundingClientRect();
    const selectedWordX = selectedWordCoordinates.x
    const selectedWordY = selectedWordCoordinates.bottom - documentCoordinates.top
    const selectedWordHeight = selectedWordCoordinates.height
    const selectedWordWidth = selectedWordCoordinates.width
    const popoverWidth = 300
    const popoverHeight = 150
    const leftRightMargin = 10
    const bottomTopMargin = 5
    const arrowNotchHeight = 10

    if (selectedWordX + selectedWordWidth / 2 - Math.ceil(popoverWidth / 2) < 0) { // Appending 'word width' to the conditional check, was because of amplified word styling taking up much space, and skewing the arithmetic wizardy
        // I could've just substituted the following arithmetic wizardy with "leftRightMargin + 'px'", but I preferred a more 'logically appropriatet' approach
        popover.style.left = selectedWordX - Math.ceil(popoverWidth / 2) + (0 - (selectedWordX - (popoverWidth / 2))) + leftRightMargin + "px";
    } else if ((selectedWordX + selectedWordWidth + popoverWidth / 2) > window.innerWidth) {
        popover.style.left = selectedWordX + selectedWordWidth - Math.ceil(popoverWidth) + "px";
    } else {
        popover.style.left = selectedWordX - ((popoverWidth / 2) - (selectedWordWidth / 2)) + "px";
    }

    if (selectedWordY + popover.offsetHeight >= window.innerHeight) {
        //popover.style.bottom = "20px";
        //popover.style.bottom = event.clientY + selectedWordHeight + bottomTopMargin + "px";
        console.log('Do some shit about it!')
        popover.style.top = selectedWordY + bottomTopMargin + arrowNotchHeight + "px";
    } else {
        popover.style.top = selectedWordY + bottomTopMargin + arrowNotchHeight + "px";
    }

    const arrowNotchXPosition = (selectedWordX - Number.parseInt(popover.style.left)) + (selectedWordWidth / 2)

    // Mainly to hide the scrollbar on chrome & opera & safari
    let popoverStyleElement = document.getElementById('popover-style')
    if (!popoverStyleElement) {
        popoverStyleElement = document.createElement('style')
        popoverStyleElement.id = 'popover-style'
        document.body.appendChild(popoverStyleElement)
    }
    /*
    * TODO
    *   - The ability to dynamically allocate the z-index of the popover, so that when I place it just above the selected element, then the user scroll, it can get hidden below other element of higher index
    */
    popoverStyleElement.innerHTML = `
		div.parent-popover {
			color: black;
			position: absolute;
			background: lightblue;
			border-radius: 5px;
			opacity: 0.9;
			padding: 5px;
			width: ${popoverWidth}px;
			height: ${popoverHeight}px;
			transition: background linear 150ms;
			z-index: 9999999999;
		}
		div.parent-popover::before {
			content: '';
			display: block;
			position: absolute;
			width: 0;
			height: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-bottom: ${arrowNotchHeight}px solid lightblue;
			top: -${arrowNotchHeight}px;
			left: ${arrowNotchXPosition}px;
		}
		div.recordings-div {
			display: flex;
			text-align: left;
			flex-direction: column;
			align-items: flex-start;
			word-wrap: break-word;
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

    recordings = search(word, await retrieveRecordings(word, 'de', 'en'), {
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
    return (popover)
}


let audioRecordingsButtons = Array.from(document.getElementsByClassName('recording-button'))
audioRecordingsButtons.forEach((button) => {
    button.addEventListener('click', function handleButtonClick(event) {
        let buttonTextContent = event.target.textContent
        playAudio(recordingsObject[buttonTextContent][0])
    })
})
document.addEventListener('click', function handleButtonclick(event) {
    let eventTarget = event.target
    if (eventTarget.className == 'recording-button') {
        playAudio(eventTarget.getAttribute('href'))
    }
})

let clickTimeoutId;
document.addEventListener('mouseup', () => {
    /*
     *  - The 'mouseup' is the most inclusive event. For instance 'dblclick' won't include dragged to highlight text.
     *  - The timeout is used to both 
     *		- Prevent consecutive adding & removing (causes flickering)
     *      - Different highlighting a word from Long passages
    */
    clearTimeout(clickTimeoutId)
    clickTimeoutId = globalThis.setTimeout(async (event) => {
        let highlightedValue = window.getSelection().toString().toLowerCase().trim();
        const specialCharacters = ['.', '?', '!', '"', '\'', '-', '_', '@', '#', '(', ')', '{', '}']
        specialCharacters.forEach((character) => {
            if (highlightedValue[0] === character) {
                highlightedValue = highlightedValue.substring(1)
            } else if (highlightedValue[highlightedValue.length - 1] === character) {
                highlightedValue = highlightedValue.substring(highlightedValue.length - 1, 0)
            }
        })
        highlightedValue = highlightedValue.includes('·') ? highlightedValue.replaceAll('·', '') : highlightedValue 		// This special character gets includes sometimes, by google's search, thus eliminating it from the word, before sending the requested word to Forvo's web server.
        let popoverElements = document.getElementsByClassName('parent-popover')
        if (!!highlightedValue.length && !popoverElements.length) { // I guess the last condition should be refined with something else (like for example a floating icon being visible or not.. somethig like that)
            // Appending the popover container element
            createPopoverContainer();
            // Append translations
            appendTranslation(highlightedValue)
            document.body.appendChild(await appendingRecordings(highlightedValue))
        }
    }, 200)
})

function appendTranslation(highlightedValue) {
    console.log("More...")
    console.log(highlightedValue)
    ;(async () => {
        let j = document.createElement('div')
        j.classList.add('recording-list-item')
        j.classList.add('translation')
        j.textContent = await parseGoogleTranslateResponse(highlightedValue)
        document.getElementsByClassName('recordings-div')[0].appendChild(j)
    })()
}

/*
 * - Two events to handle the automatic removal of the tooltip (for more usability enhancement)
*/
function handleToolipRemoval(event) {
    let popoverElements = document.getElementsByClassName('parent-popover')
    let eventTargetClassName = event.target.parentNode.className
    // The scroll behavior is rather a deficit in usability:
    // 		- According to MY usage, I usually read sequentally, not hopping over the page upside down. Thus I won't be bothered while hopping to encounter a leftover popover hanging out.
    // 		- having uniform form of removing the popover (i.e. clicking outside the popover) is more standard
    // 		- The popover gets scrolled past, and thus hidden when:
    // 			- The popover's inner recordings isn't a list, and the user scrolls for more recordings.
    // 			- The user scroll all the way to the end of an actual recordings list, then keeps scrolling.
    if (event.type == 'scroll') {
        try {
            let selectedTextY = Math.round(document.getSelection().getRangeAt(0).getBoundingClientRect().y)
            if (window.scrollY < selectedTextY || window.scrollY > Math.round(selectedTextY)) {
                //popoverElement.remove()
            }
        } catch {
        }
    } else if (event.type == 'click') {
        // Remove the yet-to-be floating box, only if the user clicked in any area but within the box itself
        if (!['parent-popover', 'recordings-div', 'recording-button', 'recording-list-item', 'recording-list-item translation'].includes(event.target.parentElement.className) && popoverElements.length) {
            for (let popoverElement of popoverElements) {
                setTimeout(() => {
                    popoverElement.remove();
                }, 0);
            }
        }
    }
}

['click', 'scroll'].forEach(function (eventElement) {
    console.log('remvoing the popover')
    window.addEventListener(eventElement, handleToolipRemoval, false)
})

/* BUG
 * - [x] Selecting multiple words i.e. phrases, does get a word of the phrase as the chosen one, then it exhibit an astray popover.
 *      - [ ] This bug only occurs when the user double clicks within a paragraph i.e. a word is selected, then the whole paragraph is selected. The initially selected words get an astray popover, while the whole text is now highlighted.
 *      	- It was actually because of something else. It was because of the 'await remote page' delaying the 'highlighted word's respective coordinates styling'. The solution was to move the 'await statement' after the 'popover styling' especially setting its coordinates.
 * - The current popover box doesn't work in certain websites/situations.
 * - The popover box apparently derives its coloring / theming / studying from the respective word/element's parent
 * - Resizing the window i.e. resizing the whole window, opening dev tools, gets the popover astray
 * - hyphenated words don't not detected e.e., ever-growing
 * - Clicking inside the popover, but outside the click button, would close the popover
 * - CSS Inheritance does take effect sometimes, when you don't explicitly set the CSS property to the popover yourself.
 */

// const selectionRef = document.querySelector('#rcnt')
// console.log("Hello world")
// const [instance] = tippy('#rcnt', {
//   content: 'tooltip',
//   sticky: true
// })

// const selection = window.getSelection()

// window.addEventListener('mouseup', (event) => {
//   if (!selection.isCollapsed) {
//     const { left, top, width, height } = selection.getRangeAt(0).getBoundingClientRect()
//     selectionRef.style.left = `${left}px`
//     selectionRef.style.top = `${top}px`
//     selectionRef.style.width = `${width}px`
//     selectionRef.style.height = `${height}px`
// 
//     instance.show()
//   }
// })
// window.addEventListener('mousedown', (event) => {
//   instance.hide()
// })


let selectionReff = document.createElement('style')
selectionReff.innerHTML = `
    #selection-ref { 
        position: absolute;

        /* debug only styles */
        background: rgba(200,0,0,0.2);
        pointer-events: none;
    }
`
document.body.appendChild(selectionReff)

// const selectionRef = document.querySelector('#selection-ref')
// const [instance] = tippy('#selection-ref', {
//   content: 'tooltip',
//   sticky: true
// })

// inspired by https://jsfiddle.net/joktrpkz/7/
const selection = window.getSelection()
window.addEventListener('mouseup', (event) => {

    if (!selection.isCollapsed) {
        console.log(document.querySelector('#selection-ref'))
        const {left, top, width, height} = selection.getRangeAt(0).getBoundingClientRect()

        selectionRef.style.left = `${left}px`
        selectionRef.style.top = `${top}px`
        selectionRef.style.width = `${width}px`
        selectionRef.style.height = `${height}px`

        instance.show()
    }
})

document.addEventListener("mouseup", (event) => {
    const selection = window.getSelection();
    // if (selection && selection.toString()) {
    console.log(`${selection.toString()} is ...`)
    let element = document.createElement('div')
    element.textContent = "More...."
    const instance = tippy(element)
    instance.show()
    instance.popperInstance.reference = document.getElementById("sign-up")
    // tooltip.popperInstance.reference = selection.getRangeAt(0).getBoundingClientRect();
    // tooltip.popperInstance.update();
    // }
})

const template = document.getElementById('template')
