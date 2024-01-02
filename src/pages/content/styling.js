/**
 * Inject a styling element that other HTML elements can reference while being dynamically created
 */
export const appendStyleElement = () => {
    const popoverStyleElement = document.createElement('style')
    popoverStyleElement.id = 'popover-style'
    document.body.appendChild(popoverStyleElement)
    // FIXME: The current popover box doesn't work in certain websites/situations.
    // FIXME: The z-index of the popover should only exceed the srcElement, to avoid floating other elements i.e., when the user scroll, it can get hidden below other elements
    popoverStyleElement.innerHTML = `
        div.tooltip {
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
            overflow: scroll
        }
		div.recordings-div {
			display: flex;
			text-align: left;
			flex-direction: column;
			align-items: flex-start;
			word-wrap: break-word;
			position: absolute;
		}
		div.tooltip::-webkit-scrollbar { display: none }
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
}