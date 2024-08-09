/**
 * Inject a styling element that other HTML elements can reference while being dynamically created
 */
export const appendStyleElement = (): void => {
    const popoverStyleElement: HTMLStyleElement = document.createElement('style')
    popoverStyleElement.id = 'popover-style'
    document.body.appendChild(popoverStyleElement)
    // FIXME: The current popover box doesn't work in certain websites/situations.
    // FIXME: The z-index of the popover should only exceed the srcElement, to avoid floating other elements i.e., when the user scroll, it can get hidden below other elements
    // div.tooltip {
    //     background: white;
    //     width: 250px;
    //     height: 150px;
    //     color: black;
    //     font-weight: bold;
    //     padding: 5px;
    //     border-radius: 4px;
    //     font-size: 90%;
    //     position: absolute;
    //     z-index: 9999999999999999999999999999999999999999999999;
    //     overflow: scroll;
    //     opacity: 1;
    //     font-family: arial, sans-serif; border-radius: 12px; border: 1px solid rgb(162, 169, 177); box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 17px;
    // }
    popoverStyleElement.innerHTML = `
        div#tooltip {
            left: 0;
            top: 0;
            position: absolute;
            display: inline-block;
            z-index: var(--max-z-index);
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 5px;
            padding-bottom: 5px;
            font-size: var(--annotation-font-size);
            line-height: 1.3;
            background: rgb(241, 241, 241);
            color: rgb(0, 0, 0);
            border-radius: 6px;
            transition: 0.1s ease-in;
            opacity: 1;
            visibility: visible;
            overflow: scroll;
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-style: normal;
            font-weight: 500;
            max-height: 150px;
            max-width: 450px;
            user-select: none;
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
