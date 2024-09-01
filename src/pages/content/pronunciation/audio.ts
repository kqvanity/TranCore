import {fetchData} from "../fetch";

/* Possible events for audio source */
type audioEvent = 'start' | 'pause' | 'end'

export const speak = async(
    audioUrl: string,
    onFinish: () => void
): Promise<AudioBufferSourceNode> => {

    const audioContext = new AudioContext();
    const audioBufferSource = audioContext.createBufferSource()

    const data: string = await fetchData({remoteSiteUrl: audioUrl, msg: 'audio'})
    const arrayBuffer = new Uint8Array(JSON.parse(data)).buffer

    audioBufferSource.buffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.start(audioContext.currentTime);
    audioContext.resume();

    audioBufferSource.onended = onFinish

    // audioBufferSource.stop()
    // audioContext.suspend()

    return audioBufferSource
}