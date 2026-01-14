import { PropsWithChildren, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useStyletron, styled } from 'styletron-react';
import {
    dragRegionSelector,
    popupCardInnerContainerId,
    popupCardMaxWidth,
    popupCardMinHeight,
    popupCardMinWidth,
    popupCardMaxHeight,
    zIndex,
} from '../consts';
import { useDraggable } from '../hooks/useDraggable';
import { useFloatingPosition } from '../hooks/useFloatingPosition';
import { ReferenceElement } from '@floating-ui/dom';

type Props = {
    reference: ReferenceElement;
} & PropsWithChildren;

const fadeIn = {
    from: { opacity: 0 },
    to: { opacity: 1 },
};

const Container = styled('div', {
    animationName: fadeIn,
    animationDuration: '0.2s',
    animationTimingFunction: 'ease-in-out',
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
    overflow: 'hidden',
    background: 'floralwhite',
    display: 'flex',
    flexDirection: 'column',
});

const DragHandle = styled('div', {
    height: '10px',
    width: '100%',
    cursor: 'move',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottom: '1px solid #e0e0e0',
});

const Content = styled('div', {
    overflow: 'scroll',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
});

export default function InnerContainer({ children, reference }: Props) {
    const draggableRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

    const { draggedRef, handleOnDrag } = useDraggable(setPosition);
    useFloatingPosition(reference, draggableRef, draggedRef, setPosition);

    return (
        <Draggable
            nodeRef={draggableRef}
            handle={dragRegionSelector}
            bounds="html"
            position={position ?? undefined}
            onDrag={handleOnDrag}
        >
            <Container ref={draggableRef} id={popupCardInnerContainerId}>
                <DragHandle data-tauri-drag-region />
                <Content>
                    {children}
                </Content>
            </Container>
        </Draggable>
    );
}
