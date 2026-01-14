import React from 'react';
import { useStyletron } from 'styletron-react';
import { useUIState } from '../UIStateContext';
import { useView } from '../ViewContext';
import SpeakerIcon from '../../../assets/img/volume-2.svg';
import CopyStackIcon from '../../../assets/img/copy-stack.svg';
import MagicStickIcon from '../../../assets/img/magic-stick.svg';

export function Footer() {
    const [css] = useStyletron();
    const { showPronunciations, setShowPronunciations } = useUIState();
    const { view, setView } = useView();

    const handleTogglePronunciations = () => {
        setShowPronunciations(!showPronunciations);
    };

    const toggleView = () => {
        setView(view === 'dictionary' ? 'translator' : 'dictionary');
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
        },
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
                justifyContent: 'flex-end',
                padding: '10px 15px',
                borderTop: '1px solid #e0e0e0',
                marginTop: 'auto', // Push footer to the bottom
            })}
        >
            <button className={iconButton} onClick={handleTogglePronunciations}>
                <img src={SpeakerIcon} alt="Speaker" className={iconImg} />
            </button>
            <button className={iconButton}>
                <img src={CopyStackIcon} alt="Copy" className={iconImg} />
            </button>
            <button className={iconButton} onClick={toggleView}>
                <img src={MagicStickIcon} alt="Toggle view" className={iconImg} />
            </button>
        </div>
    );
}
