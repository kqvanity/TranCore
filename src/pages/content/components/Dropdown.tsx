import React, { useState, useRef, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    dropdown: {
        position: 'relative',
        display: 'inline-block',
    },
    button: {
        background: 'transparent',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
        minWidth: '100px',
        textAlign: 'center',
        fontWeight: '500',
        transition: 'background 0.2s ease-in-out',
        '&:hover': {
            background: '#f0f0f0',
        },
    },
    menu: {
        position: 'absolute',
        top: 'calc(100% + 5px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.1)',
        minWidth: '120px',
        zIndex: 1,
        padding: '5px',
    },
    item: {
        padding: '8px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
            background: '#f0f0f0',
        },
    },
    selectedItem: {
        fontWeight: 'bold',
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
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={classes.dropdown} ref={dropdownRef}>
            <button className={classes.button} onClick={() => setIsOpen(!isOpen)}>
                {selected}
            </button>
            {isOpen && (
                <div className={classes.menu}>
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`${classes.item} ${selected === option ? classes.selectedItem : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                            {selected === option && '✔'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}