
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useUIState } from '../UIStateContext';
import { useView } from '../ViewContext';
import SpeakerIcon from '../../../assets/img/volume-2.svg';
import CopyStackIcon from '../../../assets/img/copy-stack.svg';
import MagicStickIcon from '../../../assets/img/magic-stick.svg';

const useStyles = createUseStyles({
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px 15px',
        borderTop: '1px solid #e0e0e0',
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
            filter: 'grayscale(100%) brightness(0.5)',
        },
    },
});

export function Footer() {
    const classes = useStyles();
    const { showPronunciations, setShowPronunciations } = useUIState();
    const { view, setView } = useView();

    const handleTogglePronunciations = () => {
        setShowPronunciations(!showPronunciations);
    };

    const toggleView = () => {
        setView(view === 'dictionary' ? 'translator' : 'dictionary');
    };

    return (
        <div className={classes.footer}>
            <button className={classes.iconButton} onClick={handleTogglePronunciations}>
                <img src={SpeakerIcon} alt="Speaker" />
            </button>
            <button className={classes.iconButton}>
                <img src={CopyStackIcon} alt="Copy" />
            </button>
            <button className={classes.iconButton} onClick={toggleView}>
                <img src={MagicStickIcon} alt="Toggle view" />
            </button>
        </div>
    );
}
