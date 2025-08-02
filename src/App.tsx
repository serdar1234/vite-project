import { useState, type DragEvent } from "react";
import { type Board, type Card } from "./shared/types";
import "./App.css";
import sourceData from "./data/sourceData.json";

function App() {
  const [boards, setBoards] = useState<Board[]>(sourceData);

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

  function handleDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (e.currentTarget.className === "card") {
      e.currentTarget.style.boxShadow = "0 4px 3px grey";
    }
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
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
    e.currentTarget.style.boxShadow = "none";
  }

  function handleDropCard(e: DragEvent<HTMLDivElement>, bd: Board): void {
    if (!currentCard || !currentBd) return;
    bd.items.push(currentCard);
    const currentIndex = currentBd.items.indexOf(currentCard);
    currentBd.items.splice(currentIndex, 1);
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
    e.currentTarget.style.boxShadow = "none";
  }

  function handleDragEnd(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <>
      <main className="main">
        {boards.map((bd) => (
          <div
            className="board"
            key={bd.id}
            tabIndex={bd.id}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDropCard(e, bd)}
          >
            <div className="board-title">{bd.title}</div>
            {bd.items.map((card) => (
              <div
                className="card"
                tabIndex={card.id}
                key={card.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, bd, card)} // when start dragging
                onDragOver={(e) => handleDragOver(e)} // when dragged element hovers over another one
                onDragLeave={(e) => handleDragLeave(e)} // when leaving hovering over another element
                onDrop={(e) => handleDrop(e, bd, card)} // actually dropping the dragged element
                onDragEnd={(e) => handleDragEnd(e)} // clean up fn when finished dragging, successfully or not
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
