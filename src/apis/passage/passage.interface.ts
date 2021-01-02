export interface PassageSchema {
    filepath: string
    filename: string
    title: string
    content: string
    description: string
    mtime: string
    date: string
    permalink: string
}

export interface PassageNode {
    title: string
    key: string
    hasContent: boolean
    children?: PassageNode[]
}