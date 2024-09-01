import { BaseProvider, DarkTheme, LightTheme } from 'baseui'
import { useEffect, useState } from "react";
import { parseGoogleTranslateResponse } from "./translation/Translation";
import { useMemo } from 'react';
import {Word} from "./model";

type BaseThemeType = "light" | "dark"
const useCurrentThemeType = (): BaseThemeType => {
    return 'dark'
}

const useTheme = () => {
    const themeType = useCurrentThemeType()
    const theme = useMemo(() => (themeType === 'light'? LightTheme : DarkTheme), [themeType])
    return { theme, themeType }
}

export function Translator(word: Word) {
    
    const { theme } = useTheme()

    const [translation, setTranslation] = useState<string>("") 

    useEffect(() => {
        (async () => {
            const gTranslation = await parseGoogleTranslateResponse(word.title)
            setTranslation(gTranslation)
        })();
    })

    return (
        <BaseProvider theme={theme}>
            <div>
                <h2>"Translation"</h2>
                <p>{translation}</p>
            </div>
        </BaseProvider>
    )
}