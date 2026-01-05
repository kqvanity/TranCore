import AudioPlayer, {RHAP_UI} from "react-h5-audio-player";
import H5AudioPlayer from "react-h5-audio-player";
import { Pronunciation } from "pages/content/model";
import Play from '../../assets/img/play.svg'
import Pause from '../../assets/img/pause.svg'

export const PronPlayer = (pron: Pronunciation) => {
    return <div>
        <H5AudioPlayer
            layout={"horizontal"}
            src={pron.url}
            customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
            showJumpControls={false}
            customProgressBarSection={[]}
            preload="none"
            autoPlay={false}
            autoPlayAfterSrcChange={false}
            customIcons={{
                play: <Play />,
                pause: <Pause />,
            }}
            style={{
                display: "inline-block",
                width: "0px",
                paddingRight: "50px",
                paddingLeft: "10px",
                paddingBottom: "10px",
            }}
        />
        <span>{pron.title}</span>
        <span>{' / '}</span>
        <span>{pron.translation?.title}</span>
    </div>
}
