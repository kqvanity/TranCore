import AudioPlayer, {RHAP_UI} from "react-h5-audio-player";
import { Pronunciation } from "pages/content/model";

export const PronPlayer = (pron: Pronunciation) => {
    return <div>
        <AudioPlayer
            layout={"horizontal"}
            src={pron.url}
            customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
            showJumpControls={false}
            customProgressBarSection={[]}
        />
    </div>
}
