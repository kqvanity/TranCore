
import React, { createContext, useContext, useState } from 'react';

interface UIState {
    showPronunciations: boolean;
    setShowPronunciations: (show: boolean) => void;
}

const UIStateContext = createContext<UIState | null>(null);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
    const [showPronunciations, setShowPronunciations] = useState(false);

    return (
        <UIStateContext.Provider value={{ showPronunciations, setShowPronunciations }}>
            {children}
        </UIStateContext.Provider>
    );
}

export function useUIState() {
    const context = useContext(UIStateContext);
    if (!context) {
        throw new Error('useUIState must be used within a UIStateProvider');
    }
    return context;
}
