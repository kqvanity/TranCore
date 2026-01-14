import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { ApiContext } from '../content/ApiContext';
import { readConfiguration, saveConfiguration } from '../../core/adapter/gateways/configurations';
import { Settings } from '../content/components/Settings';

const engine = new Styletron();

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <StyletronProvider value={engine}>
                <ApiContext.Provider value={{
                    fetchTranslation: async () => '',
                    readConfiguration,
                    retrieveRecordings: async () => [],
                }}>
                    <Settings />
                </ApiContext.Provider>
            </StyletronProvider>
        </React.StrictMode>
    );
}
