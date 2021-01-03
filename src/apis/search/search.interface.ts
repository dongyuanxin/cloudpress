interface SearchPassageSchema {
    title: string;
    content: string;
    permalink: string
}

export interface SearchPassagesReturn {
    passages: SearchPassageSchema[];
    count: number;
}
