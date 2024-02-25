import {fetchData} from "../fetch";

/*
*   - Audio APi
*   - Functionality
*       - Fetch & Play audio files from the the provided direct audio file URL.
*   - TODO
*       - The ability to pause any currently-running audio (at other tabs), before playing the next audio.
*       - If two audios files are pressed consecutively, then the preferred behavior is to stop the current one, and play the next one.
*         - I guess The way to go about this would *
*               -Pause any video in the current tab, whereas pause any other running audio in any other tab (exception for the current one.)
*/
export async function playAudio(audioUrl) {
    let audio;
    let audioContext = new AudioContext();
    await fetchData(audioUrl, 'audio')
        .then(data => new Uint8Array(JSON.parse(data)).buffer)
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedAudio => {
            audio = decodedAudio;
        });
    (async function playback() {
        const playSound = audioContext.createBufferSource();
        playSound.buffer = audio;
        playSound.connect(audioContext.destination);
        playSound.start(audioContext.currentTime);
        audioContext.resume();
    })()
}