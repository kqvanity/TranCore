
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { getGoogleTranslateUrl, GoogleTranslateResponse } from '../../../core/adapter/gateways/translation/Translation';

// ... (imports)

const useStyles = createUseStyles({
    dictionary: {
        padding: '15px',
        flex: 1,
        overflowY: 'auto', // Add scroll for long definitions
    },
    definition: {
        marginBottom: '15px',
    },
    pos: {
        fontStyle: 'italic',
        color: '#666',
    },
    terms: {
        marginLeft: '10px',
    },
});

// ... (interface definitions)

export function Dictionary({ word }: DictionaryProps) {
    const classes = useStyles();
    const [definitions, setDefinitions] = useState<Definition[]>([]);
    const { fetchTranslation } = useApi();

    useEffect(() => {
        (async () => {
            const url = getGoogleTranslateUrl(word.title);
            const gTranslation: GoogleTranslateResponse = await fetchTranslation(url);
            const defs = gTranslation.dict?.map(d => ({ pos: d.pos, terms: d.terms })) || [];
            setDefinitions(defs);
        })();
    }, [word, fetchTranslation]);

    return (
        <div className={classes.dictionary}>
            {definitions.map((def, index) => (
                <div key={index} className={classes.definition}>
                    <span className={classes.pos}>({def.pos})</span>
                    <span className={classes.terms}>{def.terms.join(', ')}</span>
                </div>
            ))}
        </div>
    );
}
