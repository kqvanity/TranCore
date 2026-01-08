
import React, { createContext, useContext, useState } from 'react';

export type View = 'dictionary' | 'translator';

interface ViewState {
    view: View;
    setView: (view: View) => void;
}

const ViewContext = createContext<ViewState | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
    const [view, setView] = useState<View>('dictionary');

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {children}
        </ViewContext.Provider>
    );
}

export function useView() {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error('useView must be used within a ViewProvider');
    }
    return context;
}
