import './tippy'
import { parseGoogleTranslateResponse } from "./translation/Translation";
import { playAudio } from "./pronunciation/audio";
import { Pronunciation, retrieveRecordings } from "./pronunciation/forvo.ts";
import Fuse from 'fuse.js';
import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { appendStyleElement } from "./styling";
import { readConfiguration } from "./configurations";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

// const List = ({ items }) => {
//     return (
//         <ul>
//             {items.map((item, index) => (
//                 <li key={index}>{item}</li>
//             ))}
//         </ul>
//     );
// };
// 
// class Pronunciation {
//     name: string;
//     url: string;
//     constructor(name: string, url: string) {
//         this.name = name
//         this.url = url
//     }
// }
// 
// const PopupBox = ({ word, pronunciations, onClose }) => {
//     const handleClickOutside = (event) => {
//         if (event.target.className !== 'popup-box') {
//             onClose();
//         }
//     };
// 
//     useEffect(() => {
//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);
// 
//     return (
//         <div className="popup-box">
//             <header>
//                 <h1>{word} Translation</h1>
//             </header>
//             <ul>
//                 {pronunciations.map((pronunciation, index) => (
//                     <li key={index}>{pronunciation.name}</li>
//                 ))}
//             </ul>
//             <button onClick={onClose}>Close</button>
//         </div>
//     );
// };
// 
// function App() {
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const word = 'Bonjour';
//     const pronunciations = [new Pronunciation('bohn-joor', 'https://domain1.com'), new Pronunciation("Sam", "https://domain2.com")];
// 
//     const handleOpenPopup = () => {
//         setIsPopupOpen(true);
//     };
// 
//     const handleClosePopup = () => {
//         setIsPopupOpen(false);
//     };
// 
//     return (
//         <div>
//             <button onClick={handleOpenPopup}>Show Pronunciations</button>
//             {isPopupOpen && (
//                 <PopupBox
//                     word={word}
//                     pronunciations={pronunciations}
//                     onClose={handleClosePopup}
//                 />
//             )}
//         </div>
//     );
// }

let userConfiguration = await readConfiguration()

function createPopoverContainer() {
    const tooltip = document.createElement('div');
    tooltip.classList.add("tooltip")
    // Arrow element
    const arrowElement = document.createElement('div')
    arrowElement.id = "arrowElement"
    //document.body.appendChild(arrowElement)
    tooltip.appendChild(arrowElement)
    document.body.appendChild(tooltip);
}

async function appendingRecordings(word: string) {
    let recordingsDiv = document.createElement('div')
    recordingsDiv.className = "recordings-div"
    const langaugeCode = userConfiguration["fromLanguage"];
    let recordings = await retrieveRecordings(word, langaugeCode)
    const fuse = new Fuse(recordings ?? [], {
        keys: [
            "title"
        ],
        threshold: 1.0
    })
    recordings = fuse.search(word).map((result) => result.item)
    for (const recording of recordings) {
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
document.addEventListener('click', (event: MouseEvent) => {
    let eventTarget = event.target
    if (eventTarget.className == 'recording-button') {
        playAudio(eventTarget.getAttribute('href'))
    }
})

async function appendTranslation(highlightedValue: string) {
    const translateElement = document.createElement('div')
    translateElement.classList.add('recording-list-item')
    translateElement.classList.add('translation')
    translateElement.textContent = await parseGoogleTranslateResponse(highlightedValue)
    return (translateElement)
}

//document.addEventListener('click', (mouseEvent: MouseEvent) => {
    //const element = mouseEvent.target
    //if (!element?.classList?.contains("tooltip")) {
        //document.querySelectorAll(".tooltip").forEach(nodeElement => {
            //nodeElement.remove();
        //});
    //}
    ////if (document.getElementsByClassName('tooltip')?.[0]?.contains(element))
//})

appendStyleElement()

/**
 *   Remove the tooltip if the user clicked anywhere outside of it
 */
document.onmouseup =  (moustEvent: MouseEvent) => {
    const state = document.getElementsByClassName('tooltip')?.[0]?.contains(moustEvent.target)
    if (!state) document.querySelector('.tooltip')?.remove()
}

document.addEventListener('mouseup', (mouseEvent: MouseEvent) => {
    if (mouseEvent.altKey && mouseEvent.which == 1) {
    const virtualEl = {
        getBoundingClientRect: () => {
            const hlBoundingClientRect = document.getSelection()?.getRangeAt(0).getBoundingClientRect()
            if (hlBoundingClientRect.x <= 0 || hlBoundingClientRect.y <= 0) {
                return {
                    width: 0,
                    height: 0,
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY,
                    top: mouseEvent.clientY,
                    left: mouseEvent.clientX,
                    right: mouseEvent.clientX,
                    bottom: mouseEvent.clientY,
                };
            } else {
                return hlBoundingClientRect
            }
        },
        getClientRects: () => document.getSelection()?.getRangeAt(0).getClientRects()
    };
    createPopoverContainer()
    const tooltip = document.querySelector(".tooltip");
    //TODO: Figure out the computePosition function
    const arrowElement: HTMLElement | null = document.getElementById("arrowElement")
    const arrowLen = arrowElement?.offsetWidth;
    // Get half the arrow box's hypotenuse length
    const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
    computePosition(virtualEl, document.querySelector('.tooltip'), {
        placement: "bottom",
        middleware: [
            offset(floatingOffset),
            flip(),
            shift({ padding: 5 }),
            arrow({ element: arrowElement })
        ]
    }).then(({x, y, middlewareData, placement}) => {
        const selectedWord: string = document.getSelection().toString().toLowerCase().trim()
        // const state = document.getElementsByClassName('tooltip')?.[0]?.contains(k)
        const { width, height } = virtualEl.getBoundingClientRect();
        if (true) {
            setTimeout(async () => {
                tooltip.appendChild(await appendTranslation(selectedWord))
                tooltip.appendChild(await appendingRecordings(selectedWord))
                // ReactDOM.render(<App />, document.querySelector(".tooltip"))
            }, 0)
            Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
                // visibility: (selectedWord.length === 0) ? 'hidden' : 'visible',
            });
            if (selectedWord.length === 0) {
                tooltip.innerHTML = ""
                // Arrow element
                const arrowElement = document.createElement('div')
                arrowElement.id = "arrowElement"
                tooltip.appendChild(arrowElement)
            }
            const side = placement.split("-")[0];
            const staticSide = {
              top: "bottom",
              right: "left",
              bottom: "top",
              left: "right"
            }[side];
            if (middlewareData.arrow) {
                const {x , y} = middlewareData.arrow;
                console.log(x, y)
                console.log(arrowElement)
                console.log(x == null)
                Object.assign(arrowElement.style, {
                  left: x != null ? `${x}px` : "",
                    top: y != null ? `${y}px` : "",
                    right: "",
                    bottom: "",
                    [staticSide]: `${-arrowLen / 2}px`,
                    transform: "rotate(45deg)",
                    background: "red",
                });
            } else { console.log('WTH') }
        }
    });
}});

