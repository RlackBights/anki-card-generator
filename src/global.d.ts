/// <reference types="react-scripts" />

type PopupType = "ok" | "yesNo" | "error" | "textInput" | null;

interface PopupBase {
    content:string;
    type: PopupType;
}

interface PopupInfo {
    content: string;
    type: PopupType;
    setter?: React.Dispatch<React.SetStateAction<PopupBase>>;
    deckIndex?: number | undefined;
}

interface DeckBase {
    name: string;
    content: Array<{from: string, to: string, confidence: number}>;
}