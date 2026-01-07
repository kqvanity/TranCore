
import { computePosition, shift, flip, offset, type ReferenceElement, size } from '@floating-ui/dom';
import { useCallback, useEffect, RefObject } from 'react';
import {
    documentPadding,
    popupCardMinHeightAfterTranslation,
    popupCardOffset,
} from '../consts';

export function useFloatingPosition(
    reference: ReferenceElement,
    draggableRef: RefObject<HTMLDivElement>,
    draggedRef: RefObject<boolean>
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
                size({
                    apply({ availableHeight, elements }) {
                        Object.assign(elements.floating.style, {
                            maxHeight: `${Math.max(popupCardMinHeightAfterTranslation, availableHeight)}px`,
                            overflow: 'hidden',
                        });
                    },
                }),
            ],
            strategy: 'fixed',
        });

        if (draggableRef.current) {
            Object.assign(draggableRef.current.style, {
                left: `${Math.max(documentPadding, x)}px`,
                top: `${Math.max(documentPadding, y)}px`,
            });
        }
    }, [reference, draggableRef]);

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

    return { updatePosition };
}
