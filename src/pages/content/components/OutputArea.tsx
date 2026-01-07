
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { formatGoogleTranslateResponse, getGoogleTranslateUrl } from '../../../core/adapter/gateways/translation/Translation';

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
    },
});

interface OutputAreaProps {
    word: Word;
}

import { useUIState } from '../UIStateContext';

// ... (imports)

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
                <button className={classes.iconButton} onClick={handleTogglePronunciations}>🔊</button>
                <button className={classes.iconButton}>📋</button>
            </div>
        </div>
    );
}
