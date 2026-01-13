
import { useRef } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';

export function useDraggable(setPosition: (pos: { x: number, y: number }) => void) {
    const draggedRef = useRef(false);

    function handleOnDrag(event: DraggableEvent, data: DraggableData) {
        draggedRef.current = true;
        setPosition({ x: data.x, y: data.y });
    }

    return {
        draggedRef,
        handleOnDrag,
    };
}
