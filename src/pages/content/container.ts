import { containerID, zIndex } from './consts'
import { attachEventsToContainer } from "./utils";

export async function getContainer(): Promise<HTMLElement> {
    let $container = document.getElementById(containerID);
    if ($container) {
        return $container;
    }

    console.log('[TranCore] getContainer: creating and appending container');
    $container = document.createElement('div');
    $container.id = containerID;
    attachEventsToContainer($container);
    $container.style.position = 'fixed';
    $container.style.top = '0';
    $container.style.left = '0';
    $container.style.zIndex = zIndex;

    const shadowRoot = $container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
        ::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
        * {
            scrollbar-width: none;
        }
    `;
    shadowRoot.appendChild(style);

    const $inner = document.createElement('div');
    shadowRoot.appendChild($inner);

    document.body.appendChild($container);
    return $container;
}
