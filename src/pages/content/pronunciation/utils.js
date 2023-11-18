export const sortRecordings = (recordings, text) => {
    if (text.includes(' ')) {
        recordings.sort((a, b) => {
            return ((a.word === text) - (b.word === text))
        })
    } else {
        recordings.sort((a, b) => {
            return a.word.length - b.word.length
        })
    }
}

