import React, { createContext, useState, Dispatch } from 'react';
import Deck from './components/deck';
import Popup from './components/popup';

export const deckContext = createContext({
  decks: [] as Array<DeckBase>,
  setDecks: (()=>{}) as Dispatch<React.SetStateAction<DeckBase[]>>
});

function App() {
  const [decks, setDecks] = useState<Array<DeckBase>>([{name: "test", content: []} as DeckBase]);
  const [popup, setPopup] = useState<PopupInfo>({content: "", type: null, deckIntex: null} as PopupInfo);

  return (
    <deckContext.Provider value={{ decks, setDecks }}>
      <Popup content={popup.content} type={popup.type} deckIndex={popup.deckIndex} setter={setPopup}/>
      <form id="container" onSubmit={e => e.preventDefault()}>
        <h1>Anki Card Generator</h1>
        <p>A site for making it easy to generate anki cards from plain text, like dictionaries</p>
        <div id='add-deck'>
          <input id='deck-name' type="text" placeholder='Deck name' /> <br/>
          <button onClick={() => {
            const deckNameContainer = document.getElementById('deck-name') as HTMLInputElement;
            const deckName = deckNameContainer.value as string;
            if (deckName === "" || decks.filter(deck => deck.name === deckName).length > 0) return;
            const newDeck = { name: deckName, content: [] as Array<{from: string, to: string}> } as DeckBase;
            setDecks(currDecks => [...currDecks, newDeck]);
          }}>Add a deck</button>
        </div>
        <div id='decks'>
            {decks.map((deck, index) => (
              <Deck
                deckInfo={deck as DeckBase}
                removeMethod={() => {
                  setDecks(currDecks => currDecks.filter(anyDeck => anyDeck.name !== deck.name));
                }} key={deck.name}
                renameMethod={() => {
                  setPopup({content: "Rename deck", type: "textInput", setter: (()=>{}), deckIndex: index} as PopupInfo);
                }}
                changeMethod={(value: string) => {
                  const newcontent = value.split('\n').map(line => ({from: line.split(' ')[0], to: line.split(' ').slice(1).join(' '), confidence: line.split(' ').length}));
                  console.table(newcontent);
                  setDecks(currDecks => [...currDecks].fill({name: deck.name, content: [{from: "", to: "", confidence: 0}]} as DeckBase, index, index + 1) as DeckBase[]);
                }}
              />
            ))}
        </div>
      </form>
    </deckContext.Provider>
  );
}

export default App;
