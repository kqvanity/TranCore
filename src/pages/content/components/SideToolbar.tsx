import React from 'react';
import { useStyletron } from 'styletron-react';
import GridIcon from '../../../assets/img/copy-stack.svg';
import TranslateIcon from '../../../assets/img/logo.png';

const SideToolbar = ({ onTranslateClick }: { onTranslateClick: () => void }) => {
    const [css, theme] = useStyletron();

    const fadeIn = {
        '0%': { opacity: 0, transform: 'translateX(10px)' },
        '100%': { opacity: 0.8, transform: 'translateX(0)' },
    };

    const toolbarStyles = css({
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        borderRadius: '24px',
        padding: '8px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: '9999',
        border: '1px solid #e0e0e0',
        opacity: 0.8,
        transition: 'opacity 0.3s ease-in-out',
        animationName: fadeIn,
        animationDuration: '0.5s',
        animationFillMode: 'forwards',
        ':hover': {
            opacity: 1,
        },
    });

    const iconButtonStyles = css({
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#fff', // Set background to white
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f0f0f0',
        },
    });

    return (
        <div className={toolbarStyles}>
            <div className={iconButtonStyles}>
                <img src={GridIcon} alt="Grid" style={{ width: '28px', height: '28px' }} />
            </div>
            <div className={iconButtonStyles} onClick={onTranslateClick}>
                <img src={TranslateIcon} alt="Translate" style={{ width: '28px', height: '28px' }} />
            </div>
        </div>
    );
};

export default SideToolbar;

