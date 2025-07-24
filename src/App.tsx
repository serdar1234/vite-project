import { useState, type DragEvent } from "react";
import { type Board, type Card } from "./shared/types";
import "./App.css";

function App() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: 1,
      title: "title 1",
      items: [
        { id: 1, text: "Card 1" },
        { id: 2, text: "Card 2" },
        { id: 3, text: "Card 3" },
        { id: 4, text: "Card 4" },
      ],
    },
    {
      id: 2,
      title: "title 2",
      items: [
        { id: 1, text: "Card 1" },
        { id: 2, text: "Card 2" },
        { id: 3, text: "Card 3" },
        { id: 4, text: "Card 4" },
      ],
    },
    {
      id: 3,
      title: "title 3",
      items: [
        { id: 1, text: "Card 1" },
        { id: 2, text: "Card 2" },
        // { id: 3, text: "Card 3" },
        // { id: 4, text: "Card 4" },
      ],
    },
  ]);

  const [currentBd, setCurrentBd] = useState<Board | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  function handleDragStart(
    _: DragEvent<HTMLDivElement>,
    bd: Board,
    card: Card
  ): void {
    setCurrentBd(bd);
    setCurrentCard(card);
  }

  function handleDragEnd(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (e.currentTarget.className === "card") {
      e.currentTarget.style.boxShadow = "0 4px 3px grey";
    }
  }

  function handleDrop(
    e: DragEvent<HTMLDivElement>,
    bd: Board,
    card: Card
  ): void {
    e.preventDefault();
    if (!currentCard || !currentBd) return;

    const currentIndex = currentBd.items.indexOf(currentCard);
    currentBd.items.splice(currentIndex, 1);
    const dropIndex = bd.items.indexOf(card);
    bd.items.splice(dropIndex + 1, 0, currentCard!);
    setBoards(
      boards.map((b) => {
        if (b.id === bd.id) {
          return bd;
        }
        if (b.id === currentBd.id) {
          return currentBd;
        }
        return b;
      })
    );
  }

  return (
    <>
      <main className="main">
        {boards.map((bd) => (
          <div className="board" key={bd.id}>
            <div className="board-title">{bd.title}</div>
            {bd.items.map((card) => (
              <div
                className="card"
                key={card.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, bd, card)}
                onDragEnd={(e) => handleDragEnd(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, bd, card)}
              >
                {card.text}
              </div>
            ))}
          </div>
        ))}
      </main>
    </>
  );
}

export default App;
