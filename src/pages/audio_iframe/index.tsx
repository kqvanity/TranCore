import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function IframeAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Ensure the message is from the expected origin (your extension)
            // In a real extension, you'd want more robust origin checking
            if (event.source !== window.parent) {
                return;
            }

            const { type, src } = event.data;

            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.addEventListener('ended', () => {
                    if (window.parent) {
                        window.parent.postMessage({ type: 'audioEnded' }, '*');
                    }
                });
            }

            if (type === 'play' && src) {
                if (audioRef.current.src !== src) {
                    audioRef.current.src = src;
                    audioRef.current.load();
                }
                audioRef.current.play().then(() => {
                    if (window.parent) {
                        window.parent.postMessage({ type: 'audioPlaying' }, '*');
                    }
                }).catch(error => {
                    console.error("Error playing audio:", error);
                    if (window.parent) {
                        window.parent.postMessage({ type: 'audioError', error: error.message }, '*');
                    }
                });
            } else if (type === 'pause') {
                audioRef.current.pause();
                if (window.parent) {
                    window.parent.postMessage({ type: 'audioPaused' }, '*');
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return <audio ref={audioRef} style={{ display: 'none' }} />;
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<React.StrictMode><IframeAudioPlayer /></React.StrictMode>);
}
