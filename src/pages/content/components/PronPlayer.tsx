import { Pronunciation } from "../../../core/domain/entities/model";
import { AudioPlayer } from "./AudioPlayer";
import { useStyletron } from "styletron-react";

export const PronPlayer = (pron: Pronunciation) => {
    const [css] = useStyletron();
    return (
        <div
            className={css({
                // Overrides for unexpected parent styling
                backgroundColor: 'transparent',
                textAlign: 'left',
                // Original styles
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
            })}
        >
            <AudioPlayer src={pron.url} />
            <div
                className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                    flex: '1',
                    minWidth: '0',
                    alignItems: 'flex-start',
                })}
            >
                <span
                    className={css({
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    })}
                >
                    {pron.title}
                </span>
                {pron.translation && (
                    <span
                        className={css({
                            fontSize: '12px',
                            color: '#888',
                        })}
                    >
                        {pron.translation.title}
                    </span>
                )}
            </div>
        </div>
    );
};
