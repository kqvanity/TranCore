import React, { useEffect, useState, useCallback } from 'react';
import { useStyletron } from 'styletron-react';
import { UserConfiguration, readConfiguration, saveConfiguration } from '../../../core/adapter/gateways/configurations';
import { Dropdown } from './Dropdown';
import logo from '../../../assets/img/logo.png';

const languages = ['English', 'German', 'Spanish', 'French', 'Chinese'];
const languageMap: { [key: string]: string } = {
    'English': 'en',
    'German': 'de',
    'Spanish': 'es',
    'French': 'fr',
    'Chinese': 'zh',
};

const getKeyByValue = (obj: { [key: string]: string }, value: string) => {
    return Object.keys(obj).find(key => obj[key] === value);
};

// A small component for the "Saved!" indicator
const SavedIndicator = ({ show }: { show: boolean }) => {
    const [css] = useStyletron();
    return (
        <span className={css({
            color: '#28a745',
            fontSize: '14px',
            marginLeft: '15px',
            opacity: show ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            transform: show ? 'translateX(0)' : 'translateX(-10px)',
        })}>
            ✓ Saved
        </span>
    );
}

export function Settings() {
    const [css] = useStyletron();
    const [config, setConfig] = useState<UserConfiguration | null>(null);
    const [lastChanged, setLastChanged] = useState<'from' | 'to' | null>(null);
    const [saving, setSaving] = useState<'from' | 'to' | null>(null);

    useEffect(() => {
        readConfiguration().then(setConfig);
    }, []);

    const handleLanguageChange = useCallback(async (field: 'fromLanguage' | 'toLanguage', lang: string) => {
        const langCode = languageMap[lang];
        const fieldKey = field === 'fromLanguage' ? 'from' : 'to';
        if (config && langCode && langCode !== config[field]) {
            setSaving(fieldKey);
            const newConfig = { ...config, [field]: langCode };
            setConfig(newConfig);
            await saveConfiguration({ [field]: langCode });
            setSaving(null);
            setLastChanged(fieldKey);
            setTimeout(() => setLastChanged(null), 1500); // Hide after 1.5s
        }
    }, [config]);

    if (!config) {
        return (
            <div className={css({
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
                fontFamily: "'Roboto', sans-serif", color: '#333'
            })}>
                <h2>Loading Settings...</h2>
            </div>
        );
    }

    const settingRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '25px',
        borderBottom: '1px solid #eee',
    };

    const labelStyle = {
        fontSize: '16px',
        color: '#333',
        fontWeight: '500'
    };
    
    return (
        <div className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#f0f2f5',
        })}>
            <div className={css({
                background: 'white',
                padding: '40px 50px',
                borderRadius: '12px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '520px',
            })}>
                <header className={css({ textAlign: 'center', marginBottom: '40px' })}>
                    <img src={logo} alt="Trancore Logo" className={css({ width: '64px', marginBottom: '15px' })} />
                    <h1 className={css({
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: 0,
                    })}>Settings</h1>
                </header>

                <div className={css(settingRowStyle)}>
                    <label className={css(labelStyle)}>Translate From</label>
                    <div className={css({ display: 'flex', alignItems: 'center' })}>
                        <Dropdown
                            options={languages}
                            selected={getKeyByValue(languageMap, config.fromLanguage) || 'English'}
                            onSelect={(lang) => handleLanguageChange('fromLanguage', lang)}
                            isLoading={saving === 'from'}
                        />
                        <SavedIndicator show={lastChanged === 'from'} />
                    </div>
                </div>

                <div className={css({ ...settingRowStyle, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 })}>
                    <label className={css(labelStyle)}>Translate To</label>
                    <div className={css({ display: 'flex', alignItems: 'center' })}>
                        <Dropdown
                            options={languages}
                            selected={getKeyByValue(languageMap, config.toLanguage) || 'German'}
                            onSelect={(lang) => handleLanguageChange('toLanguage', lang)}
                            isLoading={saving === 'to'}
                        />
                        <SavedIndicator show={lastChanged === 'to'} />
                    </div>
                </div>
            </div>
        </div>
    );
}
