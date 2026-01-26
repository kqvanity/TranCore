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
            <div
                className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                    flex: '1',
                    minWidth: '0',
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
