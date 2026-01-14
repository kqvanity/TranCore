import React, { useState, useEffect } from "react";
import Fuse from 'fuse.js';
import { Pronunciation } from "../../../core/domain/entities/model";
import { PronPlayer } from "./PronPlayer";
import { useApi } from "../ApiContext";

interface Word {
    term: string
}

export function PronunciationList({ word }: { word: Word }) {
    const [pronunciations, setPronunciations] = useState<Pronunciation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { readConfiguration, retrieveRecordings } = useApi();

    const fetchData = async () => {
        try {
            const config = await readConfiguration();
            const data = await retrieveRecordings(word.term, config.fromLanguage);
            const fuse = new Fuse(data ?? [], {
                keys: ["title"],
                threshold: 1.0,
            });
            const fusedData = fuse.search(word.term).map((result) => result.item);
            setPronunciations(fusedData);
            setIsLoading(false);
        } catch (err: any) {
            setError(err);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [word, readConfiguration, retrieveRecordings]);

    if (error) {
        return (
            <div>
                <h2>Error: {error.message}...</h2>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <h2>Loading pronunciations....</h2>
            </div>
        );
    }

    return (
        <div
            className="__pronunciations-list"
            style={{ maxHeight: '230px', overflowY: 'auto', padding: '15px' }}
        >
            <div>
                {pronunciations.map((item, index) => {
                    return <PronPlayer
                        key={index}
                        title={item.title}
                        url={item.url}
                        tags={item.tags}
                        translation={item.translation}
                    />
                })}
            </div>
        </div>
    );
}
