import React, { createContext, useState, Dispatch } from 'react';
import Deck from './components/deck';
import Popup from './components/popup';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function download(downloadDecks: Array<{deckName: string, from: Array<string>, to: Array<string>}>, special?: any) {
  let element = document.createElement('a');
  let outputString = special ? JSON.stringify(special) : "#separator:tab\n#html:true\n#notetype column:1\n#deck column:2\n#tags column:5\n";
  
  if (!special) {
    downloadDecks.forEach(deck => {
      for (let i = 0; i < deck.from.length; i++) {
        outputString += `Basic (and reversed card)\t${deck.deckName}\t${deck.from[i]}\t${deck.to[i]}\t\n`;
      }
    });
  }
  
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputString));
  element.setAttribute('download', 'anki-deck-import.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const deckContext = createContext({
  decks: [] as Array<DeckBase>,
  setDecks: (()=>{}) as Dispatch<React.SetStateAction<DeckBase[]>>
});

function App() {
  const [decks, setDecks] = useState<Array<DeckBase>>([]);
  const [popup, setPopup] = useState<PopupInfo>({content: "", type: null, deckIntex: null} as PopupInfo);

  return (
    <deckContext.Provider value={{ decks, setDecks }}>
      <Popup content={popup.content} type={popup.type} deckIndex={popup.deckIndex} setter={setPopup}/>
      <form id="container" onSubmit={e => e.preventDefault()}>
        <h1>Anki Card Generator</h1>
        <p>A site for making it easy to generate anki cards from plain text, like dictionaries/<br/>Can only generate the Basic (and reversed card) versions for now</p>
        <div id='add-deck'>
          <input id='deck-name' type="text" placeholder='Deck name' /> <br/>
          <button onClick={() => {
            const deckName = (document.getElementById('deck-name') as HTMLInputElement).value as String;
            (document.getElementById('deck-name') as HTMLInputElement).value = "";
            if (deckName === "" || decks.filter(deck => deck.name === deckName).length > 0) return;
            const newDeck = { name: deckName, rawContent: "", content: [] as Array<{from: string, to: string, splitIndex: number, confidence: number, accepted: false}>, state: 'edit'} as DeckBase;
            setDecks(currDecks => [...currDecks, newDeck]);
          }}>Add a deck</button>
        </div>
        <button onClick={() => {download(decks.filter(deck => deck.state === "finished").map(deck => ({deckName: deck.name, from: deck.content.filter(line => line.accepted === true).map(line => line.from), to: deck.content.filter(line => line.accepted === true).map(line => line.to)})), false)}}>Download finalised decks</button>
        
        <div id='decks'>
            {decks.map((deck, index) => (
              <Deck
                deckInfo={deck as DeckBase}
                key={deck.name}

                removeMethod={() => {
                  setDecks(currDecks => currDecks.filter(anyDeck => anyDeck.name !== currDecks[index].name));
                }}

                renameMethod={() => {
                  setPopup({content: "Rename deck", type: "textInput", setter: (()=>{}), deckIndex: index} as PopupInfo);
                }}

                changeMethod={(value: string) => {
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], rawContent: value} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                finaliseMethod={() => {
                  if (decks[index].state === "finished") return;
                  const newcontent = deck.rawContent.replace(/\n\n/g, '\n').split('\n').map(line => ({from: line.split(' ')[0], to: line.split(' ').slice(1).join(' '), splitIndex: 0, confidence: line.split(' ').length, accepted: line.split(' ').length === 2}));
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], content: newcontent, state: "finished"} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                editMethod={() => {
                  if (decks[index].state === "edit") return;
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], state: "edit"} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                moveSplitMethod={(lineIndex: number, amount: number) => {
                  console.log(lineIndex);
                  let newContent = [...decks[index].content];
                  console.log(decks[index].rawContent);
                  const lineFromRaw = decks[index].rawContent.split('\n')[lineIndex];
                  newContent[lineIndex] = {from: lineFromRaw.split(' ').splice(0, clamp(decks[index].content[lineIndex].splitIndex + amount, 0, lineFromRaw.split(' ').length - 2) + 1).join(' '), to: lineFromRaw.split(' ').splice(clamp(decks[index].content[lineIndex].splitIndex + amount, 0, lineFromRaw.split(' ').length - 2) + 1).join(' '), splitIndex: clamp(decks[index].content[lineIndex].splitIndex + amount, 0, lineFromRaw.split(' ').length - 2), confidence: decks[index].content[lineIndex].confidence, accepted: decks[index].content[lineIndex].accepted};
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], content: newContent} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                toggleAccceptMethod={(lineIndex: number) => {
                  let newContent = [...decks[index].content];
                  newContent[lineIndex].accepted =!newContent[lineIndex].accepted;
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], content: newContent} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                mergeUpMethod={(lineIndex: number) => {
                  let newContent = [...decks[index].content];
                  newContent[lineIndex - 1].to = [newContent[lineIndex - 1].to, [newContent[lineIndex].from, newContent[lineIndex].to].join(' ').trim()].join(' ').trim();
                  newContent[lineIndex - 1].confidence = newContent[lineIndex - 1].to.split(' ').length + 1;
                  newContent.splice(lineIndex, 1);
                  console.log([...decks[index].content]);
                  let tempRawContent = decks[index].rawContent.split('\n').fill([decks[index].rawContent.split('\n')[lineIndex - 1], decks[index].rawContent.split('\n')[lineIndex]].join(' '), lineIndex - 1, lineIndex);
                  tempRawContent.splice(lineIndex, 1);
                  let newRawContent = tempRawContent.join('\n')
                  setDecks(currDecks => [...currDecks].fill({...currDecks[index], rawContent: newRawContent, content: newContent} as DeckBase, index, index + 1) as DeckBase[]);
                }}

                slideMethod={(isDown: boolean) => {
                  let tempDecks = [...decks];
                  if (isDown) {
                    let moveDeck = tempDecks[index + 1];
                    tempDecks[index + 1] = tempDecks[index];
                    tempDecks[index] = moveDeck;
                  } else {
                    let moveDeck = tempDecks[index - 1];
                    tempDecks[index - 1] = tempDecks[index];
                    tempDecks[index] = moveDeck;
                  }
                  setDecks(tempDecks);
                }}
              />
            ))}
        </div>
        <div style={{display: !window.location.href.includes("debug") ? "none" : "block"}}>
          <button onClick={() => {download([], decks)}}>Download states</button>
          <textarea id="stateUpload" cols={30} rows={5}></textarea>
          <button onClick={() => {setDecks(JSON.parse((document.getElementById("stateUpload") as HTMLTextAreaElement).value))}}>Upload states</button>
        </div>
      </form>
    </deckContext.Provider>
  );
}

export default App;