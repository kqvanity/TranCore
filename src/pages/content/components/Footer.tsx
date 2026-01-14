import React from 'react';
import { useStyletron } from 'styletron-react';
import { useView } from '../ViewContext';
import CopyStackIcon from '../../../assets/img/copy-stack.svg';
import MagicStickIcon from '../../../assets/img/magic-stick.svg';

export function Footer() {
    const [css] = useStyletron();
    const { view, setView } = useView();

    const toggleView = () => {
        setView(view === 'dictionary' ? 'translator' : 'dictionary');
    };

    const iconButton = css({
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        ':hover': {
            opacity: 0.7,
        },
    });

    const iconImg = css({
        width: '16px',
        height: '16px',
        filter: 'grayscale(100%) brightness(0.5)',
    });

    return (
        <div
            className={css({
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '5px 15px',
                borderTop: '1px solid #e0e0e0',
            })}
        >
            <button className={iconButton}>
                <img src={CopyStackIcon} alt="Copy" className={iconImg} />
            </button>
            <button className={iconButton} onClick={toggleView}>
                <img src={MagicStickIcon} alt="Toggle view" className={iconImg} />
            </button>
        </div>
    );
}
