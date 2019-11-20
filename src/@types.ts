export interface INodeParameters {
    type: string;
    name?: string;
    where?: object;
}

export interface IRelationParameters {
    type: string;
    name?: string;
    source?: string;
    target?: string;
    where?: object;
}
