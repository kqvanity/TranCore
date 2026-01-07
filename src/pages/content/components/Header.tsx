
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Dropdown } from './Dropdown';

const useStyles = createUseStyles({
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',
        background: '#f8f9fa',
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: 0,
        marginRight: 'auto',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
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

export function Header() {
    const classes = useStyles();
    // Mock data for languages
    const languages = ['English', 'Chinese', 'Spanish', 'French'];
    const [fromLanguage, setFromLanguage] = React.useState('English');
    const [toLanguage, setToLanguage] = React.useState('Chinese');

    const handleSwapLanguages = () => {
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);
    };

    return (
        <div className={classes.header} data-tauri-drag-region>
            <span className={classes.title}>OpenAI Translator</span>
            <div className={classes.actions}>
                <Dropdown options={languages} selected={fromLanguage} onSelect={setFromLanguage} />
                <button className={classes.iconButton} onClick={handleSwapLanguages}>↔</button>
                <Dropdown options={languages} selected={toLanguage} onSelect={setToLanguage} />
                <button className={classes.iconButton}>⚙</button>
                <button className={classes.iconButton}>📌</button>
                <button className={classes.iconButton}>X</button>
            </div>
        </div>
    );
}
