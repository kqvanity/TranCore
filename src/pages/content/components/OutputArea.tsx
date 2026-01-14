import React, { useEffect } from 'react';
import { useStyletron } from 'styletron-react';
import { useApi } from '../ApiContext';
import { Word } from '../../../core/domain/entities/model';
import { formatGoogleTranslateResponse } from '../../../core/adapter/gateways/translation/Translation';
import { useView } from '../ViewContext';

interface OutputAreaProps {
    word: Word;
}

export function OutputArea({ word }: OutputAreaProps) {
    const [css] = useStyletron();
    const { fetchTranslation } = useApi();
    const { translation, setTranslation } = useView();

    useEffect(() => {
        (async () => {
            const gTranslation = await fetchTranslation(word.title);
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted);
        })();
    }, [word, fetchTranslation, setTranslation]);

    return (
        <div
            className={css({
                padding: '15px',
                height: '100px',
            })}
        >
            <div
                className={css({
                    background: '#f0f0f0',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    display: 'inline-block',
                })}
            >
                Polished 👍
            </div>
            <p
                className={css({
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                })}
            >
                {translation}
            </p>
        </div>
    );
}
