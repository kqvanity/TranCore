
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    inputArea: {
        padding: '15px',
        borderBottom: '1px solid #e0e0e0',
    },
    textarea: {
        width: '100%',
        border: 'none',
        resize: 'none',
        fontSize: '14px',
        fontFamily: 'inherit',
        background: 'transparent',
        '&:focus': {
            outline: 'none',
        },
    },
});

interface InputAreaProps {
    text: string;
}

export function InputArea({ text }: InputAreaProps) {
    const classes = useStyles();
    return (
        <div className={classes.inputArea}>
            <textarea className={classes.textarea} value={text} readOnly rows={4} />
        </div>
    );
}
