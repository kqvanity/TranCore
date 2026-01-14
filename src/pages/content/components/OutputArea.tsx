import React, { useEffect } from 'react';
import { useStyletron } from 'styletron-react';
import { useApi } from '../ApiContext';
import { formatGoogleTranslateResponse } from '../../../core/adapter/gateways/translation/Translation';
import { useView } from '../ViewContext';

export function OutputArea() {
    const [css] = useStyletron();
    const { fetchTranslation } = useApi();
    const { translation, setTranslation, selectedWord } = useView();

    useEffect(() => {
        (async () => {
            const gTranslation = await fetchTranslation(selectedWord);
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted);
        })();
    }, [selectedWord, fetchTranslation, setTranslation]);

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
