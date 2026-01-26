import { PropsWithChildren, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useStyletron } from 'styletron-react';
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
import { RemoveScroll } from 'react-remove-scroll';
import { useFloatingPosition } from '../hooks/useFloatingPosition';
import { ReferenceElement } from '@floating-ui/dom';

type Props = {
    reference: ReferenceElement;
} & PropsWithChildren;

export default function InnerContainer({ children, reference }: Props) {
    const [css] = useStyletron();
    const draggableRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const { draggedRef, handleOnDrag } = useDraggable(setPosition);
    useFloatingPosition(reference, draggableRef, draggedRef, setPosition);

    const fadeIn = {
        from: { opacity: 0 },
        to: { opacity: 1 },
    };

    return (
        <Draggable
            nodeRef={draggableRef}
            handle={dragRegionSelector}
            bounds="html"
            position={position ?? undefined}
            onDrag={handleOnDrag}
        >
            <div
                ref={draggableRef}
                id={popupCardInnerContainerId}
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                className={css({
                    animationName: fadeIn,
                    animationDuration: '0.2s',
                    animationTimingFunction: 'ease-in-out',
                    position: 'fixed',
                    zIndex,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,.15)',
                    lineHeight: '1.6',
                    fontSize: '13px',
                    color: '#333',
                    font: '14px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                    minWidth: `${popupCardMinWidth}px`,
                    maxWidth: `${popupCardMaxWidth}px`,
                    overflow: 'hidden',
                    background: 'floralwhite',
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                <div
                    data-tauri-drag-region
                    className={css({
                        height: '10px',
                        width: '100%',
                        cursor: 'move',
                        backgroundColor: '#f0f0f0',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        borderBottom: '1px solid #e0e0e0',
                    })}
                />
                <div
                    className={css({
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: `${popupCardMaxHeight}px`,
                        overflowY: 'auto',
                    })}
                >
                    <RemoveScroll enabled={isMouseOver}>
                        {children}
                    </RemoveScroll>
                </div>
            </div>
        </Draggable>
    );
}
