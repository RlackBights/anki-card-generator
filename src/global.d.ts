/// <reference types="react-scripts" />

type PopupType = "ok" | "yesNo" | "error" | "textInput" | null;

interface PopupBase {
    content:string;
    type: PopupType;
}

interface DeckBase {
    name: string;
    content: Array<{from: string, to: string}>;
}