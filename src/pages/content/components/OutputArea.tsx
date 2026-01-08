import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { formatGoogleTranslateResponse, getGoogleTranslateUrl } from '../../../core/adapter/gateways/translation/Translation';
import { useUIState } from '../UIStateContext';
import SpeakerIcon from '../../../assets/img/volume-2.svg';
import CopyStackIcon from '../../../assets/img/copy-stack.svg';

const useStyles = createUseStyles({
    outputArea: {
        padding: '15px',
        position: 'relative',
    },
    badge: {
        background: '#f0f0f0',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'inline-block',
    },
    text: {
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
    },
    actions: {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        display: 'flex',
        gap: '10px',
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

interface OutputAreaProps {
    word: Word;
}

export function OutputArea({ word }: OutputAreaProps) {
    const classes = useStyles();
    const [translation, setTranslation] = useState<string>('');
    const { fetchTranslation } = useApi();
    const { showPronunciations, setShowPronunciations } = useUIState();

    useEffect(() => {
        (async () => {
            const url = getGoogleTranslateUrl(word.title);
            const gTranslation = await fetchTranslation(url);
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted);
        })();
    }, [word, fetchTranslation]);

    const handleTogglePronunciations = () => {
        setShowPronunciations(!showPronunciations);
    };

    return (
        <div className={classes.outputArea}>
            <div className={classes.badge}>Polished 👍</div>
            <p className={classes.text}>{translation}</p>
            <div className={classes.actions}>
                <button className={classes.iconButton} onClick={handleTogglePronunciations}>
                    <img src={SpeakerIcon} alt="Speaker" />
                </button>
                <button className={classes.iconButton}>
                    <img src={CopyStackIcon} alt="Copy" />
                </button>
            </div>
        </div>
    );
}