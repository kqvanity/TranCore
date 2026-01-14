import React from 'react';
import { useStyletron } from 'styletron-react';
import { Dropdown } from './Dropdown';
import SwapIcon from '../../../assets/img/swap.svg';
import SettingsIcon from '../../../assets/img/settings.svg';
import CloseIcon from '../../../assets/img/x.svg';

export function Header() {
    const [css] = useStyletron();
    const languages = ['English', 'Chinese', 'Spanish', 'French'];
    const [fromLanguage, setFromLanguage] = React.useState('English');
    const [toLanguage, setToLanguage] = React.useState('Chinese');

    const handleSwapLanguages = () => {
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);
    };

    const iconButton = css({
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        ':hover': {
            opacity: 0.7,
        }
    });

    const iconImg = css({
        width: '16px',
        height: '16px',
        filter: 'grayscale(100%) brightness(0.5)',
    });

    return (
        <div
            className={css({
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #e0e0e0',
                background: '#f8f9fa',
            })}
            data-tauri-drag-region
        >
            <div
                className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginLeft: 'auto',
                })}
            >
                <div
                    className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                    })}
                >
                    <Dropdown options={languages} selected={fromLanguage} onSelect={setFromLanguage} />
                    <button className={iconButton} onClick={handleSwapLanguages}>
                        <img src={SwapIcon} alt="Swap languages" className={iconImg} />
                    </button>
                    <Dropdown options={languages} selected={toLanguage} onSelect={setToLanguage} />
                </div>
                <button className={iconButton}>
                    <img src={SettingsIcon} alt="Settings" className={iconImg} />
                </button>
                <button className={iconButton}>
                    <img src={CloseIcon} alt="Close" className={iconImg} />
                </button>
            </div>
        </div>
    );
}
