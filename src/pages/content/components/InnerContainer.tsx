
import { PropsWithChildren, useRef } from 'react';
import Draggable from 'react-draggable';
import {
    dragRegionSelector,
    popupCardInnerContainerId,
    popupCardMaxWidth,
    popupCardMinHeight,
    popupCardMinWidth,
    popupCardMaxHeight,
    zIndex,
} from '../consts';
import { createUseStyles } from 'react-jss';
import { useDraggable } from '../hooks/useDraggable';
import { useFloatingPosition } from '../hooks/useFloatingPosition';
import { ReferenceElement } from '@floating-ui/dom';

type Props = {
    reference: ReferenceElement;
} & PropsWithChildren;

const useStyles = createUseStyles({
    '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
    container: {
        animation: '$fadeIn 0.2s ease-in-out',
        position: 'fixed',
        zIndex,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
        minWidth: `${popupCardMinWidth}px`,
        maxWidth: `${popupCardMaxWidth}px`,
        lineHeight: '1.6',
        fontSize: '13px',
        color: '#333',
        font: '14px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        maxHeight: `${popupCardMaxHeight}px`,
        minHeight: `${popupCardMinHeight}px`,
        width: 'max-content',
        overflow: 'hidden', // Changed from scroll to hidden to handle the drag handle
        background: 'floralwhite',
        display: 'flex',
        flexDirection: 'column',
    },
    dragHandle: {
        height: '10px',
        width: '100%',
        cursor: 'move',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottom: '1px solid #e0e0e0',
    },
    content: {
        overflow: 'scroll',
        flex: 1,
    }
});

export default function InnerContainer({ children, reference }: Props) {
    const styles = useStyles();
    const draggableRef = useRef<HTMLDivElement | null>(null);

    const { draggedRef, position, handleOnDrag } = useDraggable();
    useFloatingPosition(reference, draggableRef, draggedRef);

    return (
        <Draggable
            nodeRef={draggableRef}
            handle={dragRegionSelector}
            bounds="html"
            position={position}
            onDrag={handleOnDrag}
        >
            <div ref={draggableRef} className={styles.container} id={popupCardInnerContainerId}>
                <div data-tauri-drag-region className={styles.dragHandle} />
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Draggable>
    );
}

