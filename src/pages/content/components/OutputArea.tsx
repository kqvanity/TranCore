
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { formatGoogleTranslateResponse, getGoogleTranslateUrl } from '../../../core/adapter/gateways/translation/Translation';
// ... (imports)

const useStyles = createUseStyles({
    outputArea: {
        padding: '15px',
        flex: 1,
        overflowY: 'auto', // Add scroll for long text
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
});

interface OutputAreaProps {
    word: Word;
}

export function OutputArea({ word }: OutputAreaProps) {
    const classes = useStyles();
    const [translation, setTranslation] = useState<string>('');
    const { fetchTranslation } = useApi();

    useEffect(() => {
        (async () => {
            const gTranslation = await fetchTranslation(word.title);
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted);
        })();
    }, [word, fetchTranslation]);

    return (
        <div className={classes.outputArea}>
            <div className={classes.badge}>Polished 👍</div>
            <p className={classes.text}>{translation}</p>
        </div>
    );
}
