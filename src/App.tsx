import React, { createContext, useState } from 'react';
import Deck from './components/deck';
import Popup from './components/popup';

export const deckContext = createContext({
  decks: [] as Array<DeckBase>,
  setDecks: (decks: Array<DeckBase>) => {}
});

function App() {
  const [decks, setDecks] = useState<Array<DeckBase>>([{name: "test", content: []}]);
  const [popup, setPopup] = useState<{content: string, type: PopupType}>({content: "", type: null});

  return (
    <>
      <Popup content={popup.content} type={popup.type} setter={setPopup} />
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
          <deckContext.Provider value={{ decks, setDecks }}>
            {decks.map((deck) => (
              <Deck
                deckInfo={deck as DeckBase}
                removeMethod={() => {
                  setDecks(currDecks => currDecks.filter(anyDeck => anyDeck.name !== deck.name));;
                }} key={deck.name}
                renameMethod={() => {
                  setPopup({content: "Rename deck", type: "textInput"});
                }}    
              />
            ))}
          </deckContext.Provider>
        </div>
      </form>
    </>
    
  );
}

export default App;
