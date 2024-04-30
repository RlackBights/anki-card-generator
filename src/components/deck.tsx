import { useContext } from "react";
import { deckContext } from "../App";

export default function Deck( { deckInfo, removeMethod, renameMethod }: { deckInfo: DeckBase, removeMethod: Function, renameMethod: Function } ) {

    return (
        <div className="deck">
            <p onClick={() => {renameMethod()}}>{deckInfo.name}</p>
            <textarea rows={20} cols={50}></textarea>
            <br/>
            <button onClick={() => {removeMethod()}}>Remove</button>
        </div>
    )
}