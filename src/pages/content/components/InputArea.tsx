import React from 'react';
import { useStyletron } from 'styletron-react';
import { useView } from '../ViewContext';

interface InputAreaProps {
    text: string;
}

export function InputArea({ text }: InputAreaProps) {
    const [css] = useStyletron();
    const { selectedWord, setSelectedWord } = useView();

    const words = text.split(/(\s+)/);
    const isMultiWord = text.trim().includes(' ');
    const maxHeight = isMultiWord ? '6.4em' : '3.2em';

    return (
        <div
            className={css({
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
            })}
        >
            <div
                className={css({
                    width: '100%',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    maxHeight: maxHeight,
                    overflowY: 'auto',
                })}
            >
                {words.map((word, index) => {
                    if (word.trim() === '') {
                        return <span key={index}>{word}</span>;
                    }
                    return (
                        <span
                            key={index}
                            className={css({
                                cursor: 'pointer',
                                backgroundColor: word === selectedWord ? 'rgba(255, 220, 100, 0.5)' : 'transparent',
                                ':hover': {
                                    backgroundColor: 'rgba(255, 220, 100,.3)',
                                },
                            })}
                            onClick={() => {
                                if (word === selectedWord) {
                                    setSelectedWord(text); // Revert to original full sentence
                                } else {
                                    setSelectedWord(word);
                                }
                            }}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
