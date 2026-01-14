
import React, { createContext, useContext, useState } from 'react';

export type View = 'dictionary' | 'translator';

interface ViewState {
    view: View;
    setView: (view: View) => void;
    translation: string;
    setTranslation: (translation: string) => void;
}

const ViewContext = createContext<ViewState | null>(null);

import { Word } from '../../core/domain/entities/model';

// ... (imports)

interface ViewProviderProps {
    children: React.ReactNode;
    word: Word;
}

export function ViewProvider({ children, word }: ViewProviderProps) {
    const isSingleWord = !word.title.includes(' ');
    const [view, setView] = useState<View>(isSingleWord ? 'dictionary' : 'translator');
    const [translation, setTranslation] = useState<string>('');

    return (
        <ViewContext.Provider value={{ view, setView, translation, setTranslation }}>
            {children}
        </ViewContext.Provider>
    );
}
// ... (useView hook)

export function useView() {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error('useView must be used within a ViewProvider');
    }
    return context;
}
