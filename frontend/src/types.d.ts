export interface ChatMessage {
    username: string;
    text: string;
}

export interface IncomingMessage {
    type: string;
    payload: ChatMessage;
}

export interface User {
    _id: string;
    token: string;
    payload: ChatMessage;
}
