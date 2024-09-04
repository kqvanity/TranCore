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
            style={{
                display: "inline-block",
                width: "0px",
                paddingRight: "30px",
                transform: "scale(1.3)"
            }}
        />
        <span>{pron.title}</span>
    </div>
}