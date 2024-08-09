import React, { useState, useEffect } from "react";
import { loadPronunciations } from ".";
import { Pronunciation } from "./model";
import { playAudio } from "./pronunciation/audio";

export function PronunciationList({term}) {
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadPronunciations(term);
        setPronunciations(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <div>
        <h2>Error: {error}...</h2>
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
    <div className="__pronunciations-list">
      <h2>Pronunciations</h2>
      <ul>
        {pronunciations.map((item, index) => {
            return <li>
                <button onClick={() => playAudio(item.url)}>Play</button>    
                <span>{item.title}</span>
            </li>
        })}
      </ul>
    </div>
  );
}

