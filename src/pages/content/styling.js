/**
 * Inject a styling element that other HTML elements can reference while being dynamically created
 */
export var appendStyleElement = function () {
    var popoverStyleElement = document.createElement('style');
    popoverStyleElement.id = 'popover-style';
    document.body.appendChild(popoverStyleElement);
    // FIXME: The current popover box doesn't work in certain websites/situations.
    // FIXME: The z-index of the popover should only exceed the srcElement, to avoid floating other elements i.e., when the user scroll, it can get hidden below other elements
    popoverStyleElement.innerHTML = "\n        div.tooltip {\n            background: #222;\n            width: 250px;\n            height: 150px;\n            color: white;\n            font-weight: bold;\n            padding: 5px;\n            border-radius: 4px;\n            font-size: 90%;\n            position: absolute;\n            visibility: hidden;\n            z-index: 9999999999999999999999999999999999999999999999;\n            overflow: scroll\n        }\n\t\tdiv.recordings-div {\n\t\t\tdisplay: flex;\n\t\t\ttext-align: left;\n\t\t\tflex-direction: column;\n\t\t\talign-items: flex-start;\n\t\t\tword-wrap: break-word;\n\t\t\tposition: absolute;\n\t\t}\n\t\tdiv.tooltip::-webkit-scrollbar { display: none }\n\t\tdiv.recording-list-item {\n\t\t\tdisplay: flex;\n\t\t}\n\t\tbutton.recording-button {\n\t\t\tbackground-color: gray;\n\t\t\tcolor: white;\n\t\t\tfont-family: sans-serif;\n\t\t\tfont-size:small;\n\t\t\tfont-weight:lighter;\n\t\t\tborder-radius: 5px;\n\t\t\torder-color: lightblue;\n\t\t\tmargin-bottom: 2px;\n\t\t\tpadding:2px;\n\t\t}\n\t\tp.recording-name {\n\t\t\tcolor: white;\n\t\t\tfont-size: small;\n\t\t\tfont-family: sans-serif;\n\t\t\tdisplay: float-left;\n\t\t}\n\t";
};
