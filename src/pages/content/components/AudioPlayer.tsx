import React, { useState, useRef, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import PlayIcon from '../../../assets/img/play.svg';
import PauseIcon from '../../../assets/img/pause.svg';

const useStyles = createUseStyles({
    player: {
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        width: '24px',
        height: '24px',
    },
});

interface AudioPlayerProps {
    src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
    const classes = useStyles();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(src);
        const audio = audioRef.current;

        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.pause();
            audioRef.current = null;
        };
    }, [src]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={classes.player}>
            <button onClick={togglePlayPause} className={classes.button}>
                <img src={isPlaying ? PauseIcon : PlayIcon} alt={isPlaying ? 'Pause' : 'Play'} className={classes.icon} />
            </button>
        </div>
    );
}
