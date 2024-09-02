import React, {useState, useEffect, useRef} from "react";
import { loadPronunciations } from ".";
import { Pronunciation } from "./model";
import { PronPlayer } from "./PronPlayer";

interface Word {
    term: string
}

export function PronunciationList(word: Word) {
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
      try {
        const data = await loadPronunciations(word.term);
        setPronunciations(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
  }

  useEffect(() => {
    fetchData()
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
      <div>
        {pronunciations.map((item, index) => {
            return <PronPlayer
                title={item.title}
                url={item.url}
            />
        })}
      </div>
    </div>
  );
}
