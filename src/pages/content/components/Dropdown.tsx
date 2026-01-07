
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    dropdown: {
        position: 'relative',
        display: 'inline-block',
    },
    button: {
        background: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
        minWidth: '100px',
        textAlign: 'left',
    },
    menu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,.1)',
        minWidth: '100px',
        zIndex: 1,
    },
    item: {
        padding: '5px 10px',
        cursor: 'pointer',
        '&:hover': {
            background: '#f0f0f0',
        },
    },
});

interface DropdownProps {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
}

export function Dropdown({ options, selected, onSelect }: DropdownProps) {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={classes.dropdown}>
            <button className={classes.button} onClick={() => setIsOpen(!isOpen)}>
                {selected}
            </button>
            {isOpen && (
                <div className={classes.menu}>
                    {options.map((option) => (
                        <div key={option} className={classes.item} onClick={() => handleSelect(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
