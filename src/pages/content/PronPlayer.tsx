import { Pronunciation } from "./model";
import { AudioPlayer } from "./AudioPlayer";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    pronPlayer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    title: {
        marginLeft: '10px',
    },
    translation: {
        marginLeft: '5px',
        color: '#666',
    },
});

export const PronPlayer = (pron: Pronunciation) => {
    const classes = useStyles();
    return <div className={classes.pronPlayer}>
        <AudioPlayer src={pron.url} />
        <span className={classes.title}>{pron.title}</span>
        {pron.translation && <span className={classes.translation}>{' / '}{pron.translation.title}</span>}
    </div>
}
