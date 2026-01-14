
import { computePosition, shift, flip, offset, type ReferenceElement } from '@floating-ui/dom';
import { useCallback, useEffect, RefObject } from 'react';
import {
    documentPadding,
    popupCardOffset,
} from '../consts';

export function useFloatingPosition(
    reference: ReferenceElement,
    draggableRef: RefObject<HTMLDivElement>,
    draggedRef: RefObject<boolean>,
    setPosition: (pos: { x: number, y: number }) => void
) {
    const updatePosition = useCallback(async () => {
        if (!draggableRef.current) {
            return;
        }
        const { x, y } = await computePosition(reference, draggableRef.current, {
            placement: 'bottom',
            middleware: [
                shift({ padding: documentPadding }),
                offset(popupCardOffset),
                flip(),
            ],
            strategy: 'fixed',
        });

        if (draggableRef.current && !draggedRef.current) {
            setPosition({ x: Math.max(documentPadding, x), y: Math.max(documentPadding, y) });
        }
    }, [reference, draggableRef, setPosition, draggedRef]);

    useEffect(() => {
        if (!draggableRef.current) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            if (!draggedRef.current) {
                updatePosition();
            }
        });
        resizeObserver.observe(draggableRef.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, [draggedRef, updatePosition, draggableRef]);

    useEffect(() => {
        updatePosition();
    }, [updatePosition]);

    return { updatePosition };
}
