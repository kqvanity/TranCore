/**
 * Inject a styling element that other HTML elements can reference while being dynamically created
 */
export const appendStyleElement = (): void => {
    const popoverStyleElement: HTMLStyleElement = document.createElement('style')
    popoverStyleElement.id = 'popover-style'
    document.body.appendChild(popoverStyleElement)
    // FIXME: The current popover box doesn't work in certain websites/situations.
    // FIXME: The z-index of the popover should only exceed the srcElement, to avoid floating other elements i.e., when the user scroll, it can get hidden below other elements
    popoverStyleElement.innerHTML = `
        div.tooltip {
            background: white;
            width: 250px;
            height: 150px;
            color: black;
            font-weight: bold;
            padding: 5px;
            border-radius: 4px;
            font-size: 90%;
            position: absolute;
            z-index: 9999999999999999999999999999999999999999999999;
            overflow: scroll;
            opacity: 1;
            font-family: arial, sans-serif; border-radius: 12px; border: 1px solid rgb(162, 169, 177); box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 17px;
        }
        #arrowElement {
              position: absolute;
              width: 20px;
              height: 20px;
              z-index: -1;
              pointer-events: none;
              transform: rotate(45deg),
        }
		div.recordings-div {
			display: flex;
			text-align: left;
			flex-direction: column;
			align-items: flex-start;
			word-wrap: break-word;
		}
		div.tooltip::-webkit-scrollbar { display: none }
		div.recording-list-item {
			display: flex;
		}
		button.recording-button {
			background-color: gray;
			color: black;
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
