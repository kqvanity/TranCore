import tippy from "tippy.js";
import { parseGoogleTranslateResponse } from "./translation/Translation";

const enhancedContentFunction = {
    fn: (instance) => ({
        onShow() {
            if (typeof instance.props.dynContent === 'function') {
                instance.setContent(instance.props.dynContent(instance.reference))
            }
        }
    })
}

const getSelectedWord = () =>  document.getSelection().toString()
const translateWord = () => {
    let element = document.createElement('div')
    let childElement = document.createElement('div')
    childElement.className = "my-tip"
    childElement.innerText = ""
    element.appendChild(childElement)
    parseGoogleTranslateResponse(getSelectedWord())
        .then((value) => {
            document.getElementsByClassName("my-tip")[0].textContent = value
        })
        .catch((reason) => {
            console.log(`Exception ${reason}`)
        })
    return (element)
}

tippy('input', {
    dynContent:  () => translateWord(),
    trigger: 'mouseup',
    plugins: [enhancedContentFunction]
})