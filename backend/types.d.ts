export interface User {
    username: string;
}

export interface ChatMessage {
    username: string;
    text: string;
}

export type IncomingMessage =
    | { type: 'SEND_MESSAGE'; payload: string }
    | { type: 'SET_USERNAME'; payload: string };

export type OutgoingMessage =
    | { type: 'NEW_MESSAGE'; payload: ChatMessage }
    | { type: 'USER_LIST'; payload: User[] };
