import React, { createContext, useContext, useState } from 'react';

export type View = 'dictionary' | 'translator';

interface ViewState {
    view: View;
    setView: (view: View) => void;
    translation: string;
    setTranslation: (translation: string) => void;
    selectedWord: string;
    setSelectedWord: (word: string) => void;
}

const ViewContext = createContext<ViewState | null>(null);

import { Word } from '../../core/domain/entities/model';

// ... (imports)

interface ViewProviderProps {
    children: React.ReactNode;
    word: Word;
}

export function ViewProvider({ children, word }: ViewProviderProps) {
    const [view, setView] = useState<View>('translator');
    const [translation, setTranslation] = useState<string>('');
    const [selectedWord, setSelectedWord] = useState<string>(word.title);

    return (
        <ViewContext.Provider value={{ view, setView, translation, setTranslation, selectedWord, setSelectedWord }}>
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
