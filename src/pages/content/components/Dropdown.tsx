import React, { useState, useRef, useEffect } from 'react';
import { useStyletron } from 'styletron-react';

interface DropdownProps {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    isLoading?: boolean;
}

const spinnerStyle = {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#339af0',
    borderRadius: '50%',
    animationDuration: '0.8s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    animationName: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
};

export function Dropdown({ options, selected, onSelect, isLoading = false }: DropdownProps) {
    const [css] = useStyletron();
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
        <div
            className={css({
                position: 'relative',
                display: 'inline-block',
            })}
            ref={dropdownRef}
        >
            <button
                className={css({
                    backgroundColor: '#f1f3f5',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    width: '160px',
                    textAlign: 'left',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    ':hover': {
                        borderColor: isLoading ? '#dee2e6' : '#adb5bd',
                    },
                    ':focus': {
                        outline: 'none',
                        borderColor: '#4dabf7',
                        boxShadow: '0 0 0 3px rgba(77, 171, 247, 0.3)',
                    }
                })}
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                disabled={isLoading}
            >
                {isLoading ? <div className={css({width: '100%', display: 'flex', justifyContent: 'center'})}><div className={css(spinnerStyle)} /></div> : selected}
                {!isLoading && <span className={css({ fontSize: '12px', color: '#868e96' })}>{isOpen ? '▲' : '▼'}</span>}
            </button>
            {isOpen && (
                <div
                    className={css({
                        position: 'absolute',
                        top: 'calc(100% + 5px)',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 6px 20px rgba(0,0,0,.08)',
                        width: '160px',
                        zIndex: 10,
                        padding: '5px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    })}
                >
                    {options.map((option) => (
                        <div
                            key={option}
                            className={css({
                                padding: '10px 14px',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                fontSize: '15px',
                                color: selected === option ? '#228be6' : '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontWeight: selected === option ? '600' : '500',
                                ':hover': {
                                    background: '#f1f3f5',
                                },
                            })}
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