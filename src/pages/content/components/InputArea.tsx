import React from 'react';
import { useStyletron } from 'styletron-react';

interface InputAreaProps {
    text: string;
}

export function InputArea({ text }: InputAreaProps) {
    const [css] = useStyletron();
    return (
        <div
            className={css({
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
            })}
        >
            <textarea
                className={css({
                    width: '100%',
                    border: 'none',
                    resize: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'transparent',
                    ':focus': {
                        outline: 'none',
                    },
                })}
                value={text}
                readOnly
                rows={4}
            />
        </div>
    );
}
