import { useEffect, useState } from "react";
import { formatGoogleTranslateResponse, getGoogleTranslateUrl } from "../../../core/adapter/gateways/translation/Translation";
import { useApi } from "../ApiContext";
import { Word } from "../../../core/domain/entities/model";

export function Translator({ word }: { word: Word }) {
    const [translation, setTranslation] = useState<string>("");
    const { fetchTranslation } = useApi();

    useEffect(() => {
        (async () => {
            const url = getGoogleTranslateUrl(word.title);
            const gTranslation = await fetchTranslation(url);
            const formatted = formatGoogleTranslateResponse(gTranslation);
            setTranslation(formatted);
        })();
    }, [word, fetchTranslation]);

    return (
        <div>
            <h2>Translation</h2>
            <p>{translation}</p>
        </div>
    );
}
