import { Pronunciation } from "../../../core/domain/entities/model";
import { AudioPlayer } from "./AudioPlayer";
import { useStyletron } from "styletron-react";

export const PronPlayer = (pron: Pronunciation) => {
    const [css] = useStyletron();
    return (
        <div
            className={css({
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
            })}
        >
            <AudioPlayer src={pron.url} />
            <span className={css({ marginLeft: '10px' })}>{pron.title}</span>
            {pron.translation && (
                <span className={css({ marginLeft: '5px', color: '#666' })}>
                    {' / '}
                    {pron.translation.title}
                </span>
            )}
        </div>
    );
};
