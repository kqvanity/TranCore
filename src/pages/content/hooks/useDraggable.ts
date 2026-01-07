
import { useRef, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';

export function useDraggable() {
    const draggedRef = useRef(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    function handleOnDrag(event: DraggableEvent, data: DraggableData) {
        draggedRef.current = true;
        setPosition({ x: data.x, y: data.y });
    }

    return {
        draggedRef,
        position,
        handleOnDrag,
    };
}
