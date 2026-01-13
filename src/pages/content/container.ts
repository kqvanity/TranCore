import { containerID, zIndex } from './consts'
import { attachEventsToContainer } from "./utils";

export async function getContainer(): Promise<HTMLElement> {
    let $container = document.getElementById(containerID);
    if ($container) {
        return $container;
    }

    $container = document.createElement('div');
    $container.id = containerID;
    attachEventsToContainer($container);
    $container.style.zIndex = zIndex;

    const shadowRoot = $container.attachShadow({ mode: 'open' });
    const $inner = document.createElement('div');
    shadowRoot.appendChild($inner);

    document.body.appendChild($container);
    return $container;
}
