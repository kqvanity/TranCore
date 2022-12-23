// ==UserScript==
// @name         ovo
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Pronounce words on the go
// @author       Polendina
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=898562
// ==/UserScript==

// This link should be further developed to become a dynamic function that grabs the highlighted word (word not sentence), then creates a link for it (if the link is broken maybe, then exception handling should be further developed at later stage ... This is just testing stuff later on)
function loadExternalLibs() {
    let shareThisLib = 'https://cdn.jsdelivr.net/npm/@floating-ui/core@1.0.1'
    GM_fetch(shareThisLib, {
        method: 'GET'
    })
    .then((response) => {
        let newScriptElement = document.createElement('script')
        newScriptElement.innerText = response.responseText;
        newScriptElement.classList += 'Floating-ui'
        document.head.appendChild(newScriptElement)
    })
}
//loadExternalLibs()

async function fetchData(remoteUrl, dataType) {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({ msg: dataType, remoteSiteUrl: remoteUrl }, async (response) => {
                //console.log(response)
                //return (await (response));
                resolve (response);
            })
        } catch (exception) {
        }
    })
}

async function convertHtmlStringToDocumentObject(remoteUrl){
    let plainPageTextValue = await fetchData(remoteUrl, 'document');
    let parser = new DOMParser();
    let remotePageDom = parser.parseFromString(plainPageTextValue, 'text/html');
    return (remotePageDom);
}

// A stripped down & succinct version of the original scraped website play funciton
function Play(a, b, c, d, e, f, g) {
    let defaultProtocol = 'https:';
    let _AUDIO_HTTP_HOST = 'audio12.forvo.com';
    b = defaultProtocol + "//" + _AUDIO_HTTP_HOST + "/mp3/" + atob(b);
    return (b)
}

async function createRecordingsObject(remoteUrl){
    let recordingsObject = {}
    let allPlayButtonWithinTheDom;
    let remotePageDom;
    let alternateUrl;

    remotePageDom = await convertHtmlStringToDocumentObject(remoteUrl);
    allPlayButtonWithinTheDom = remotePageDom.getElementsByClassName('play')

    //  - If the initial requested page didn't entail any recordings, then fall back to the recording of the first language in the horizontal nav item bar.
    //      - It should be further enhanced, by handling occassions when there aren't either any available alternate language in the navbar. Having a loading buffer or something idk.
    if (allPlayButtonWithinTheDom.length == 0) {
        // Initially Checking  to see if the broad language (not the dialectical America/British) is already an active element
        if (remotePageDom.getElementsByClassName('active').length != 0){ 
            alternateUrl = remotePageDom.getElementsByClassName('active')[0].getElementsByTagName('a')[0].getAttribute('href');
        // , then fall back to the whichever first language in the horizonatl navbar
        }else if (remotePageDom.getElementsByClassName('nav_langs')[0].firstElementChild.childElementCount != 0) {
            alternateUrl = remotePageDom.getElementsByClassName('navLangItem')[0].getElementsByTagName('a')[0].getAttribute('href');
        }
        remotePageDom = await convertHtmlStringToDocumentObject('https://forvo.com/' + alternateUrl);
        allPlayButtonWithinTheDom = remotePageDom.getElementsByClassName('play')
    }

    for (let i = 0; i < allPlayButtonWithinTheDom.length; i++) {
        let playParameters = allPlayButtonWithinTheDom.item(i).getAttribute('onclick').split('(')[1].split(');')[0].split(',')
        // Using the 'replace' method instead of straightforwardly using 'replaceAll'. An alternative approach is to delete the modified prototype method, then restoring the original built-in object method e.g., String.prototype.replaceAll, as it gets overridden on some websites.
        playParameters.forEach((element, index) => playParameters[index] = element.split('').map((character) => character.replace(/['"]+/g, '')).join(''))
        // Recording name
        let recordingName = allPlayButtonWithinTheDom.item(i).nextElementSibling.textContent;
        // Recording remote URL
        let recordingUrl = Play(... playParameters);

        recordingsObject[recordingName] = [recordingUrl];
    }
    return (recordingsObject)
}

function createPopoverContainer(){
    let popover = document.createElement('div');
	popover.className = 'parent-popover'
	document.body.appendChild(popover);
}

async function appendingRecordings(remoteUrl, event){
	let recordingsObject;
	let popover = document.getElementsByClassName('parent-popover')[0]
	let recordingsDiv = document.createElement('div')
    recordingsDiv.className = 'recordings-div'
	popover.appendChild(recordingsDiv)

	// New ripped styling!
	const selectedWordCoordinates = window.getSelection().getRangeAt(0).getBoundingClientRect()
	const documentCoordinates = document.body.parentNode.getBoundingClientRect();
	const selectedWordX = selectedWordCoordinates.x
	const selectedWordY = selectedWordCoordinates.bottom - documentCoordinates.top
	const selectedWordWidth = selectedWordCoordinates.width
	const selectedWordHeight = selectedWordCoordinates.height
	const popoverWidth = 300
	const popoverHeight = 150
	const leftRightMargin = 10
	const bottomTopMargin = 5
	const arrowNotchHeight = 10

	if (selectedWordX + selectedWordWidth/2 - Math.ceil(popoverWidth/2) < 0) { // Appending 'word width' to the conditional check, was because of amplified word styling taking up much space, and skewing the arithmetic wizardy
	  // I could've just substituted the following arithmetic wizardy with "leftRightMargin + 'px'", but I preferred a more 'logically appropriatet' approach
	  popover.style.left = selectedWordX - Math.ceil(popoverWidth/2) + (0 - (selectedWordX - (popoverWidth/2))) + leftRightMargin + "px";
	} else if ((selectedWordX + selectedWordWidth + popoverWidth/2) > window.innerWidth) {
	  popover.style.left = selectedWordX + selectedWordWidth - Math.ceil(popoverWidth) + "px";
	} else {
	  popover.style.left = selectedWordX - ((popoverWidth/2) - (selectedWordWidth / 2)) + "px";
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
	if (!popoverStyleElement){
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

	recordingsObject = await createRecordingsObject(remoteUrl);
	for (let i=0; i < Object.keys(recordingsObject).length; i++) {
		let buttonRespectiveText = document.createElement('p')
		let buttonElement = document.createElement('button')
		let recordingListItem = document.createElement('div')
		recordingListItem.className = 'recording-list-item'
		buttonRespectiveText.textContent = Object.keys(recordingsObject)[i]
		buttonElement.setAttribute('href', Object.values(recordingsObject)[i])
		buttonRespectiveText.className = 'recording-name'
		buttonElement.className = 'recording-button'
		buttonElement.textContent = 'Play'            // Placholding content for now
		recordingListItem.appendChild(buttonElement)
		recordingListItem.appendChild(buttonRespectiveText)
		recordingsDiv.appendChild(recordingListItem)
	}
	return (popover)
}

/* Code ranges might not be robust or thorough.
*  -Robust in the sense of mistakenly detecting a word that has letters that falls uner another more prioritized language's code range.
*        -For example through testing, Arabic overrides Persian. Same things for languages that rely on the Latin / cyrillic alpahbet
*        -Testing words ['Hello', 'российское', 'علم', 'دانشگاه', 'הַקֹּדֶשׁ', 'আছে', 'Καλημέρα', 'კვერცხი', 'สวัสดี', '爱', 'はい']
*  -Thorough, in the sense of not including all languagee
*  -If inconsistent behavior started to arised, choose a static fallback language of choice
*/
function detectHighlightedWordLanguage(word) {
    let wordLanguage;
    let forvoLanguageCodes = {
        'English': 'en_usa',
        'Russian': 'ru',
        'Arabic': 'ar',
        'Persian': 'fa',
        'Hebrew': 'he',
        'Bengali': 'bn',
        'Greek': 'el',
        'Georgian': 'ka',
        'Thai': 'th',
        'Chinese': 'zh',
        'Japanese': 'ja'
    }
    let languageUnicodeRanges = {
        "English" : /^[a-zA-Z]+$/,
        "Russian": /[\u0400-\u045F]/,
        "Arabic" : /[\u0600-\u06FF]/,
        "Persian" : /[\u0750-\u077F]/,
        "Hebrew" : /[\u0590-\u05FF]/,
        "Bengali" : /[\u0980-\u09FF]/,
        "Greek" : /[\u0370-\u03FF]/,
        "Georgian" : /[\u10A0-\u10FF]/,
        "Thai" : /[\u0E00-\u0E7F]/,
        'Chinese': /[\u4E00-\u9FCC]/,
        'Japanese': /[\u3011-\u3096]/
    }
    Object.entries(languageUnicodeRanges).forEach(([key, value]) => {
        if (value.test(word) === true) {
            wordLanguage = key;
        }
    })
    if (wordLanguage === undefined) wordLanguage = 'English'
    return (forvoLanguageCodes[wordLanguage])
}

// Audio APi
/*
*   - Functionality
*       - Fetch & Play audio files from the the provided direct audio file URL.
*   - TODO
*       - The ability to pause any currently-running audio (at other tabs), before playing the next audio.
*       - If two audios files are pressed consecutively, then the preferred behavior is to stop the current one, and play the next one.
*         - I guess The way to go about thiis would *
*               -Pause any video in the current tab, whereas pause any other running audio in any other tab (exception for the current one.)
*/
async function playAudio(audioUrl) {
    let audioContext = new AudioContext();
    let audio;
    console.log(audioUrl)
    await fetchData(audioUrl, 'audio')
        .then(data => new Uint8Array(JSON.parse(data)).buffer)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedAudio => {
            audio = decodedAudio;
        });
    (async function playback() {
        const playSound = audioContext.createBufferSource();
        playSound.buffer = audio;
        playSound.connect(audioContext.destination);
        playSound.start(audioContext.currentTime);
        audioContext.resume();
    })()
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
	// - The 'mouseup' is the most inclusive event. For instance 'dblclick' won't include dragged to highlight text.
	// - The timeout is used to both 
	// 		- Prevent consecutive adding & removing (causes flickering)
	// 		- Different highlighting a word from Long passages
	clearTimeout(clickTimeoutId)
	clickTimeoutId = globalThis.setTimeout( async (event) => {
		let highlightedValue = window.getSelection().toString().toLowerCase().trim();
		let specialCharacters = ['.', '?', '!', '"', '\'', '-', '_', '@', '#', '(', ')', '{', '}']
		specialCharacters.forEach((character) => {
            if (highlightedValue[0] === character) {
                highlightedValue = highlightedValue.substring(1)
            } else if (highlightedValue[highlightedValue.length - 1] === character) {
                highlightedValue = highlightedValue.substring(highlightedValue.length - 1, 0)
			}
		})
		highlightedValue = highlightedValue.includes('·') ? highlightedValue.replaceAll('·', '') : highlightedValue 		// This special character gets includes sometimes, by google's search, thus eliminating it from the word, before sending the requested word to Forvo's web server.
		let popoverElements = document.getElementsByClassName('parent-popover')
		if (!!highlightedValue.length && highlightedValue.split(' ').length <= 2 && !popoverElements.length) { // I guess the last condition should be refined with something else (like for example a floating icon being visible or not.. somethig like that)
			// Appending the popover container element
			createPopoverContainer();
			// Identifying the word language
			let language_code = detectHighlightedWordLanguage(highlightedValue)
			let remoteUrl = `https://forvo.com/search/${highlightedValue}/${language_code}`
			// Append the pronunciation recordings to the popover
			document.body.appendChild(await appendingRecordings(remoteUrl, event))
		}
	}, 200)
})

// Two events to handle the automatic removal of the tooltip (for more usability enhancement)
function handleToolipRemoval(event) {
    let popoverElements = document.getElementsByClassName('parent-popover')
	let eventTargetClassName = event.target.className
	let eventTargetParentClassName = event.target.className
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
        } catch {}
    } else if (event.type == 'click') {
        // Remove the yet-to-be floating box, only if the user clicked in any area but within the box itself
        if (eventTargetClassName !== 'parent-popover' && eventTargetParentClassName !== 'recording-button' && popoverElements.length) {
			for (let i=0; i<popoverElements.length; i++){
				setTimeout(() => {
					popoverElements[0].remove();
				}, 0);
			}
        }
    }
}
['click', 'scroll'].forEach(function(eventElement) {
	console.log('remvoing the popover')
    window.addEventListener(eventElement, handleToolipRemoval, false)
})

/*
 * TODO
 * - Implement some kind of caching for previously loaded words.
 * - [x] The Ability to detect the word language
 *      - Enahncing the detection capability using external robust API.
 * - Showing a more robust tooltip UI.
 *      - Fix textarea stray tooltip glitch.
 *      - Changing the play button icon.
 *      - A more expanded and structured layout for the tooltip.
 * - Further refinement on the audio i..e displaying the audio, then closing the previous one if another is played (preventing collapsing/overlapping)
 * - Adding the ability to load additional pronunciations.
 *   	- The link to load additional pronunciations will be conditionally/optionally displayed, depending on whether or not there's even additional pronunciations.
 *   		- The check of whether additional pronunciations are existent is done with the help of check of an rock-bottom element at the initial page.
 * - Adding the ability to load other additional translations.
 *   	- This can be achieved with the help of a small link on top of the pronunciations.
 *   		- When the link is clicked, and everything is fetched, and ready to be displayed, it should substitute the current pronunciations view, with the translations one, but with the option to go back.
 *   			- I guess i should be targeting the recocrdingsDiv for that.
 * - [x] The ability to fall back to generic English (British/American) translation, if either British/American is devoid of pronunciation, but the general English has translations
 * - [x] Avoid selecting non-alphabetical characters
 * - [x] Add support for phrasal verbs, by having a threshold of 2 words, as the maximum allowed limit of selected words
 * - Stop any currently running sounds before continuing to run any next one
 * - Instead of trying so hardly to highlight a word that's embedded in a link (trying hard to highlight the word without click the link), add the ability to hover the mouse cursor for a bit, then an icon should pop up asking whether to show pronunciation for the currently hovered-over word
 *      - The 'mouseover' event should be a good starting point.
 * - Another forbidden character should be added to the 'space' character. I guess a uniform list of them would be more appropriate.
 * - Substitute the first lower direct pronunciation, with a hovering popover (on the top), displaying options for either translation, pronunciation, or other stuff
**/

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

/* Changelog
*  - If the requested word, didn't find any available recordings, then it falls back to the first langauge in the horizontal navbar.
*/
