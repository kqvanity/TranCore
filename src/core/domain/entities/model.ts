export class Word {
    title: string
    constructor(title: string) {
        this.title = title.replace(/\p{Extended_Pictographic}/gu, '').trim();
    }
}

export class Pronunciation {
  title: string;
  url: string;
  tags: string[] | undefined;
  translation: Translation | undefined;
  constructor(title: string, url: string, tags: string[] | undefined, translation: Translation | undefined) {
    this.title = title;
    this.url = url;
    this.tags = tags
    this.translation = translation
  }
}

export class Translation {
    title: string;
    language_code: string;
    constructor(title: string, langCode: string) {
        this.title = title;
        this.language_code = langCode;
    }
}
