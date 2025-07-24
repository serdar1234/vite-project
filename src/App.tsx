import { useState, type DragEvent } from "react";
import "./App.css";
import { type Card } from "./shared/types";

function App() {
  const [cardList, setCardList] = useState<Card[]>([
    { id: 1, order: 1, text: "Card 1" },
    { id: 2, order: 2, text: "Card 2" },
    { id: 3, order: 3, text: "Card 3" },
    { id: 4, order: 4, text: "Card 4" },
  ]);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  function dragStartHandler(_: DragEvent<HTMLDivElement>, card: Card): void {
    setCurrentCard(card);
  }

  function dragEndHandler(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.background = "white";
  }

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.currentTarget.style.background = "salmon";
  }

  function dropHandler(e: DragEvent<HTMLDivElement>, card: Card): void {
    e.preventDefault();
    setCardList(
      cardList.map((c: Card) => {
        if (c.id === card.id) {
          return { ...c, order: currentCard!.order };
        }
        if (c.id === currentCard!.id) {
          return { ...c, order: card.order };
        }
        return c;
      })
    );
    e.currentTarget.style.background = "white";
  }

  return (
    <>
      <main className="main">
        <h1 className="header">fake header</h1>
        {cardList.map((card) => (
          <div
            className="card"
            draggable={true}
            onDragStart={(e) => dragStartHandler(e, card)}
            onDragLeave={(e) => dragEndHandler(e)}
            onDragEnd={(e) => dragEndHandler(e)}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropHandler(e, card)}
          >
            {card.text + " " + card.order}
          </div>
        ))}
      </main>
    </>
  );
}

export default App;
