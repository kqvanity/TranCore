
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Dropdown } from './Dropdown';
import SwapIcon from '../../../assets/img/swap.svg';
import SettingsIcon from '../../../assets/img/settings.svg'; // Reverted to original settings icon
import CloseIcon from '../../../assets/img/x.svg';

const useStyles = createUseStyles({
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',
        background: '#f8f9fa',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginLeft: 'auto', // Push actions to the right
    },
    languageSwitch: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        '& img': {
            width: '16px',
            height: '16px',
            filter: 'grayscale(100%) brightness(0.5)', // Flat and non-colorful
        },
    },
});

export function Header() {
    const classes = useStyles();
    // Mock data for languages
    const languages = ['English', 'Chinese', 'Spanish', 'French'];
    const [fromLanguage, setFromLanguage] = React.useState('English');
    const [toLanguage, setToLanguage] = React.useState('Chinese');

    const handleSwapLanguages = () => {
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);
    };

    return (
        <div className={classes.header} data-tauri-drag-region>
            <div className={classes.actions}>
                <div className={classes.languageSwitch}>
                    <Dropdown options={languages} selected={fromLanguage} onSelect={setFromLanguage} />
                    <button className={classes.iconButton} onClick={handleSwapLanguages}>
                        <img src={SwapIcon} alt="Swap languages" />
                    </button>
                    <Dropdown options={languages} selected={toLanguage} onSelect={setToLanguage} />
                </div>
                <button className={classes.iconButton}>
                    <img src={SettingsIcon} alt="Settings" />
                </button>
                <button className={classes.iconButton}>
                    <img src={CloseIcon} alt="Close" />
                </button>
            </div>
        </div>
    );
}
