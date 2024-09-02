import { useEffect, useState } from "react";
import { parseGoogleTranslateResponse } from "./translation/Translation";
import { useMemo } from 'react';
import {Word} from "./model";

type BaseThemeType = "light" | "dark"
const useCurrentThemeType = (): BaseThemeType => {
    return 'dark'
}

export function Translator(word: Word) {
    
    const [translation, setTranslation] = useState<string>("") 

    useEffect(() => {
        (async () => {
            const gTranslation = await parseGoogleTranslateResponse(word.title)
            setTranslation(gTranslation)
        })();
    })

    return (
        <div>
            <h2>"Translation"</h2>
            <p>{translation}</p>
        </div>
    )
}
