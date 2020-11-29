interface SearchPassageSchema {
    title: string;
    psgID: string;
    content: string;
    publishTime: string;
    goodTimes: number;
}

export interface SearchPassagesReturn {
    passages: SearchPassageSchema[];
    count: number;
}
