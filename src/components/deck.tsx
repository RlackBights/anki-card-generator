import { useContext } from "react";
import { deckContext } from "../App";
import { DeckBase } from "../classes";

export default function Deck( { deckInfo, removeMethod }: { deckInfo: DeckBase, removeMethod: Function } ) {

    return (
        <div className="deck">
            <p>{deckInfo.name}</p>
            <textarea rows={20} cols={50}></textarea>
            <br/>
            <button onClick={() => {removeMethod()}}>Remove</button>
        </div>
    )
}