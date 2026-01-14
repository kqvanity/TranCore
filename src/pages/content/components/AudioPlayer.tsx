import React, { useState, useRef, useEffect } from 'react';
import { useStyletron } from 'styletron-react';
import PlayIcon from '../../../assets/img/play.svg';
import PauseIcon from '../../../assets/img/pause.svg';

interface AudioPlayerProps {
    src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
    const [css] = useStyletron();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // When src changes, we need to reset the audio player
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlaying(false);
        }
    }, [src]);

    // Effect for cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlayPause = () => {
        if (!audioRef.current) {
            // First play: create and play audio
            const audio = new Audio(src);
            audioRef.current = audio;
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.play();
            setIsPlaying(true);
        } else {
            // Subsequent plays: toggle
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={css({ display: 'flex', alignItems: 'center' })}>
            <button
                onClick={togglePlayPause}
                className={css({
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                })}
            >
                <img
                    src={isPlaying ? PauseIcon : PlayIcon}
                    alt={isPlaying ? 'Pause' : 'Play'}
                    className={css({ width: '24px', height: '24px' })}
                />
            </button>
        </div>
    );
}
