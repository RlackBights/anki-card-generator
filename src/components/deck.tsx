export default function Deck( { deckInfo, removeMethod, renameMethod, changeMethod, finaliseMethod, editMethod, moveSplitMethod, slideMethod, toggleAccceptMethod, mergeUpMethod }: { deckInfo: DeckBase, removeMethod: Function, renameMethod: Function, changeMethod: Function, finaliseMethod: Function, editMethod: Function, moveSplitMethod: Function, slideMethod: Function, toggleAccceptMethod: Function, mergeUpMethod: Function } ) {

    return (
        <div className="deck">
            <p onClick={() => {renameMethod()}}>{deckInfo.name}</p>
            {deckInfo.state === "edit" && <textarea id={`${deckInfo.name}-content`} value={deckInfo.rawContent} rows={20} cols={50} onChange={(e) => {changeMethod(e.target.value)}}></textarea>}
            {deckInfo.state === "finished" && 
            <div id="finished-content">
                {deckInfo.content.filter(line => line.confidence !== -1).map((line, index) => (
                    <p className="finished-line" key={index} {...{confidence: line.accepted ? "true" : "false"}}>
                        <button onClick={() => {toggleAccceptMethod(index)}}>{line.accepted ? "✔" : "✖"}</button>
                        <button disabled={(line.accepted || line.confidence === 2)} onClick={() => {
                            moveSplitMethod(index, -1);
                        }}>{"<"}</button>
                        {line.from} | {line.to}
                        <button disabled={(line.accepted || line.confidence === 2)} onClick={() => {
                            moveSplitMethod(index, 1);
                        }}>{">"}</button>
                        <button className="merge-btn" disabled={line.accepted} onClick={() => {mergeUpMethod(index)}}>⇑</button>
                    </p>
                ))}
            </div>
            }
            <br/>
            <button onClick={() => {removeMethod()}}>Remove</button>
            <button onClick={() => {finaliseMethod()}}>Finalise Deck</button>
            <button onClick={() => {editMethod()}}>Edit Deck</button>
            <button onClick={() => {slideMethod(false)}} className="slide-btn slide-up-btn">Ʌ</button>
            <button onClick={() => {slideMethod(true)}} className="slide-btn slide-down-btn">V</button>
        </div>
    )
}