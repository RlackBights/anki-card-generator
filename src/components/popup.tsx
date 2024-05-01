import { useContext, useState } from "react";
import { deckContext } from "../App";

export default function Popup({ content, type, setter = ()=>{}, deckIndex = undefined }: PopupInfo) {

    const [input, setInput] = useState("");
    const setDecks: (value: React.SetStateAction<DeckBase[]>) => void = useContext(deckContext).setDecks;
    const container: HTMLElement | null = document.getElementById("container");

    if (type === null) {
        if (container) container.style.filter = "blur(0px)";
        return (<></>);
    }

    if (container) container.style.filter = "blur(5px)";

    return (
        <div id="popup">
            <form onSubmit={e => e.preventDefault()}>
                <h2>Popup</h2>
                <p>{content}</p>
                {type === "textInput" && <input type="text" placeholder="Enter text here" onChange={e => {
                    setInput(e.target.value);
                }}/>}
                {type === "textInput" && <button type="button" onClick={() => {
                    setDecks((currDecks: DeckBase[]) => [...currDecks].fill({name:  (!currDecks.map(base => base.name).includes(input)) ? input : currDecks[deckIndex!].name, content: currDecks[deckIndex!].content} as DeckBase, deckIndex!, deckIndex! + 1) as DeckBase[]);
                    setter({content: "", type: null} as PopupBase);
                }}>Ok</button>}
            </form>
        </div>
    )
}