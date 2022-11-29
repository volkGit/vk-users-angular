export interface IInfo {
    name?: string
    photo?: string
    date?: number
}

export interface IMessage  {
    copyInfo: IInfo,
    from: IInfo
    files: any[],
    linkFiles: any[],
    text: string
}