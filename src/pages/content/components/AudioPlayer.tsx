import React, { useState, useRef, useEffect } from 'react';
import { useStyletron } from 'styletron-react';
import PlayIcon from '../../../assets/img/play.svg';
import PauseIcon from '../../../assets/img/pause.svg';
import { fetchData } from "../../../core/adapter/gateways/fetch";

interface AudioPlayerProps {
    src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
    const [css] = useStyletron();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Reset component state when the src URL changes
    useEffect(() => {
        setIsPlaying(false);
        setIsLoading(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // Cleanup blob URL on unmount
    useEffect(() => {
        // The blobUrl is captured in the closure of the cleanup function.
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    const togglePlayPause = async () => {
        // If playing, pause.
        if (isPlaying) {
            if(audioRef.current) audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // If audio is already loaded, just play.
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        // Do nothing if already loading.
        if (isLoading) {
            return;
        }

        // First time playing: fetch the audio data.
        setIsLoading(true);
        try {
            const audioDataString = await fetchData({ remoteSiteUrl: src, msg: "audio" });
            const audioData = new Uint8Array(JSON.parse(audioDataString));
            const audioBlob = new Blob([audioData], { type: 'audio/mpeg' }); // Assuming mp3
            const newBlobUrl = URL.createObjectURL(audioBlob);
            
            setBlobUrl(newBlobUrl); // Save for cleanup

            const audio = new Audio(newBlobUrl);
            audio.addEventListener('ended', () => setIsPlaying(false));
            audioRef.current = audio;
            audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error("Failed to load audio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const spinner = (
        <div className={css({
            width: '20px',
            height: '20px',
            border: '3px solid rgba(0, 0, 0, 0.1)',
            borderLeftColor: '#09f',
            borderRadius: '50%',
            animationDuration: '1s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationName: {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
            },
        })}></div>
    );

    return (
        <div className={css({ display: 'flex', alignItems: 'center' })}>
            <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className={css({
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '24px',
                    height: '24px',
                    justifyContent: 'center',
                })}
            >
                {isLoading ? spinner : (
                    <img
                        src={isPlaying ? PauseIcon : PlayIcon}
                        alt={isPlaying ? 'Pause' : 'Play'}
                        className={css({ width: '24px', height: '24px' })}
                    />
                )}
            </button>
        </div>
    );
}
