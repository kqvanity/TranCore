import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { getContainer } from './container';
import SideIcon from './components/SideIcon';
import { showPopupCard } from './floating';
import { Word } from '../../core/domain/entities/model';

let sideIconRoot: Root | null = null;
let $sideIconElement: HTMLDivElement | null = null;

export const getSideIcon = () => $sideIconElement;

async function getOrCreateSideIconElement(): Promise<HTMLDivElement> {
    if (!$sideIconElement) {
        $sideIconElement = document.createElement('div');
        $sideIconElement.id = 'trancore-side-icon';
        $sideIconElement.style.position = 'fixed';
        $sideIconElement.style.top = '50%';
        $sideIconElement.style.right = '10px';
        $sideIconElement.style.transform = 'translateY(-50%)';
        const $container = await getContainer();
        $container.shadowRoot?.querySelector('div')?.appendChild($sideIconElement);
    }
    return $sideIconElement;
}

export async function showSideIcon() {
    const $sideIcon = await getOrCreateSideIconElement();

    if (!sideIconRoot) {
        sideIconRoot = createRoot($sideIcon);
    }

    const handleClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                // Get mouse position
                const x = window.innerWidth - 250; // Show popup on the left of the icon
                const y = window.innerHeight / 2;
                await showPopupCard(
                    { getBoundingClientRect: () => new DOMRect(x, y, 0, 0) },
                    new Word(text),
                    true
                );
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    sideIconRoot.render(
        <React.StrictMode>
            <SideIcon onClick={handleClick} />
        </React.StrictMode>
    );
}
