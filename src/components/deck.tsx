export default function Deck( { deckInfo, removeMethod, renameMethod, changeMethod }: { deckInfo: DeckBase, removeMethod: Function, renameMethod: Function, changeMethod: Function } ) {

    return (
        <div className="deck">
            <p onClick={() => {renameMethod()}}>{deckInfo.name}</p>
            <textarea rows={20} cols={50} onChange={(e) => {changeMethod(e.target.value)}}></textarea>
            <br/>
            <button onClick={() => {removeMethod()}}>Remove</button>
        </div>
    )
}