
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { getGoogleTranslateUrl, GoogleTranslateResponse } from '../../../core/adapter/gateways/translation/Translation';

import SpeakerIcon from '../../../assets/img/volume-2.svg';
import CopyStackIcon from '../../../assets/img/copy-stack.svg';
import MagicStickIcon from '../../../assets/img/magic-stick.svg';
import { useUIState } from '../UIStateContext';
import { useView } from '../ViewContext';

const useStyles = createUseStyles({
    dictionary: {
        padding: '15px',
        position: 'relative', // To position the actions
        flex: 1,
    },
    // ... (other styles)
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
            filter: 'grayscale(100%) brightness(0.5)',
        },
    },
});

// ... (interface definitions)

export function Dictionary({ word }: DictionaryProps) {
    const classes = useStyles();
    const [definitions, setDefinitions] = useState<Definition[]>([]);
    const { fetchTranslation } = useApi();
    const { showPronunciations, setShowPronunciations } = useUIState();
    const { view, setView } = useView();

    useEffect(() => {
        (async () => {
            const url = getGoogleTranslateUrl(word.title);
            const gTranslation: GoogleTranslateResponse = await fetchTranslation(url);
            const defs = gTranslation.dict?.map(d => ({ pos: d.pos, terms: d.terms })) || [];
            setDefinitions(defs);
        })();
    }, [word, fetchTranslation]);

    const handleTogglePronunciations = () => {
        setShowPronunciations(!showPronunciations);
    };

    const toggleView = () => {
        setView(view === 'dictionary' ? 'translator' : 'dictionary');
    };

    return (
        <div className={classes.dictionary}>
            {definitions.map((def, index) => (
                <div key={index} className={classes.definition}>
                    <span className={classes.pos}>({def.pos})</span>
                    <span className={classes.terms}>{def.terms.join(', ')}</span>
                </div>
            ))}
            <div className={classes.actions}>
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
        </div>
    );
}
