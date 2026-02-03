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
            // The type of `formatted` will now be an array of objects
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted); // This will need to store the array
        })();
    }, [selectedWord, fetchTranslation, setTranslation]);

    // Define the style for the word category (same as "Polished 👍")
    const categoryStyle = css({
        background: '#f0f0f0',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'inline-block',
        marginRight: '8px', // Add some spacing between categories
    });

    const textStyle = css({
        fontSize: '14px',
        lineHeight: '1.6',
    });

    const isMultiWord = selectedWord.trim().includes(' ');
    const maxHeight = isMultiWord ? '6.4em' : '3.2em';

    return (
        <div
            className={css({
                padding: '15px',
                maxHeight: maxHeight,
                overflowY: 'auto',
            })}
        >
            {/* The "Polished 👍" div is a static example, remove it if not needed */}
            {/* 
            <div className={categoryStyle}>
                Polished 👍
            </div> 
            */}

            {Array.isArray(translation) && translation.map((item, index) => (
                <div key={index}>
                    {item.pos && <span className={categoryStyle}>{item.pos}</span>}
                    {item.terms && <span className={textStyle}>{item.terms}</span>}
                    {item.sentence && <p className={textStyle}>{item.sentence}</p>}
                </div>
            ))}
        </div>
    );
}
