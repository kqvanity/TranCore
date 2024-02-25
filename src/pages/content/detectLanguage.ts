// FIXME: Code ranges aren't through, whereby languages of the same/similar alphabet will override each other out!
function detectHighlightedWordLanguage(word) {
    let wordLanguage;
    let forvoLanguageCodes = {
        // 'English': 'en_usa',
        'English': 'de',
        'Russian': 'ru',
        'Arabic': 'ar',
        'Persian': 'fa',
        'Hebrew': 'he',
        'Bengali': 'bn',
        'Greek': 'el',
        'Georgian': 'ka',
        'Thai': 'th',
        'Chinese': 'zh',
        'Japanese': 'ja'
    }
    let languageUnicodeRanges = {
        "English": /^[a-zA-Z]+$/,
        "Russian": /[\u0400-\u045F]/,
        "Arabic": /[\u0600-\u06FF]/,
        "Persian": /[\u0750-\u077F]/,
        "Hebrew": /[\u0590-\u05FF]/,
        "Bengali": /[\u0980-\u09FF]/,
        "Greek": /[\u0370-\u03FF]/,
        "Georgian": /[\u10A0-\u10FF]/,
        "Thai": /[\u0E00-\u0E7F]/,
        'Chinese': /[\u4E00-\u9FCC]/,
        'Japanese': /[\u3011-\u3096]/
    }
    Object.entries(languageUnicodeRanges).forEach(([key, value]) => {
        if (value.test(word) === true) {
            wordLanguage = key;
        }
    })
    if (wordLanguage === undefined) wordLanguage = 'English'
    return (forvoLanguageCodes[wordLanguage])
}
const detectHighlightedWordLanguageTest = () => {
    const words = ['Hello', 'российское', 'علم', 'دانشگاه', 'הַקֹּדֶשׁ', 'আছে', 'Καλημέρα', 'კვერცხი', 'สวัสดี', '爱', 'はい']
}