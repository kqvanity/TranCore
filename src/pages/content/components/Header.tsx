import React from 'react';
import { useStyletron } from 'styletron-react';
import SettingsIcon from '../../../assets/img/settings.svg';
import CloseIcon from '../../../assets/img/x.svg';
import { useView } from '../ViewContext';

export function Header() {
    const [css] = useStyletron();
    const { setView } = useView();

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
                <button className={iconButton} onClick={() => setView('settings')}>
                    <img src={SettingsIcon} alt="Settings" className={iconImg} />
                </button>
                <button className={iconButton}>
                    <img src={CloseIcon} alt="Close" className={iconImg} />
                </button>
            </div>
        </div>
    );
}
