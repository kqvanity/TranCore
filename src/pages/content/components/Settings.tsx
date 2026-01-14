import React, { useEffect, useState } from 'react';
import { useStyletron } from 'styletron-react';
import { UserConfiguration, readConfiguration, saveConfiguration } from '../../../core/adapter/gateways/configurations';
import { Dropdown } from './Dropdown';

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

export function Settings() {
    const [css] = useStyletron();
    const [config, setConfig] = useState<UserConfiguration | null>(null);

    useEffect(() => {
        (async () => {
            const loadedConfig = await readConfiguration();
            setConfig(loadedConfig);
        })();
    }, []);

    const handleFromLanguageChange = async (lang: string) => {
        const langCode = languageMap[lang];
        if (config && langCode) {
            const newConfig = { ...config, fromLanguage: langCode };
            setConfig(newConfig);
            await saveConfiguration({ fromLanguage: langCode });
        }
    };

    const handleToLanguageChange = async (lang: string) => {
        const langCode = languageMap[lang];
        if (config && langCode) {
            const newConfig = { ...config, toLanguage: langCode };
            setConfig(newConfig);
            await saveConfiguration({ toLanguage: langCode });
        }
    };

    if (!config) {
        return <div>Loading settings...</div>;
    }

    return (
        <div className={css({ padding: '15px' })}>
            <h2>Settings</h2>
            <div className={css({ marginBottom: '15px' })}>
                <label className={css({ display: 'block', marginBottom: '5px' })}>From Language</label>
                <Dropdown
                    options={languages}
                    selected={getKeyByValue(languageMap, config.fromLanguage) || 'English'}
                    onSelect={handleFromLanguageChange}
                />
            </div>
            <div className={css({ marginBottom: '15px' })}>
                <label className={css({ display: 'block', marginBottom: '5px' })}>To Language</label>
                <Dropdown
                    options={languages}
                    selected={getKeyByValue(languageMap, config.toLanguage) || 'German'}
                    onSelect={handleToLanguageChange}
                />
            </div>
        </div>
    );
}
