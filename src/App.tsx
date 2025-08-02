import { useState, type DragEvent } from "react";
import { type Board, type Card } from "./shared/types";
import { handleDragOver, handleDragEnd } from "./shared/utilityFunctions";

import "./App.css";
import sourceData from "./data/sourceData.json";

function App() {
  const [boards, setBoards] = useState<Board[]>(sourceData);

  const [sourceBoard, setSourceBoard] = useState<Board | null>(null);
  const [sourceCard, setSourceCard] = useState<Card | null>(null);

  const [isHoveringOverCard, setIsHoveringOverCard] = useState<boolean>(false);

  function handleDragStart(
    _: DragEvent<HTMLDivElement>,
    bd: Board,
    card: Card
  ): void {
    setSourceBoard(bd); // save in state the board from where you take the card
    setSourceCard(card); // save in state the card that you've picked
  }

  function handleDragOverCard(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault(); // allows this element to be a valid target for dropping
    if (e.currentTarget.className === "card") {
      // current target - element that we hover the card over
      e.currentTarget.style.boxShadow = "0 4px 3px grey";
      setIsHoveringOverCard(true);
    }
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
    setIsHoveringOverCard(false);
  }

  function handleDrop(
    e: DragEvent<HTMLDivElement>,
    dropBoard: Board, // board that we drop card to
    dropCard: Card // card on which we drop card
  ): void {
    e.preventDefault();
    if (!sourceCard || !sourceBoard) return; // sort of type guarding, helping TS

    const sourceIndex = sourceBoard.items.indexOf(sourceCard);
    sourceBoard.items.splice(sourceIndex, 1); // remove card from the source board
    const dropIndex = dropBoard.items.indexOf(dropCard);
    dropBoard.items.splice(dropIndex + 1, 0, sourceCard); // add source card after drop card
    setBoards(
      boards.map((b) => {
        // go over every board (b)
        if (b.id === dropBoard.id) {
          // if this is the board where we drop
          return dropBoard; // replace it with changed drop board
        }
        if (b.id === sourceBoard.id) {
          // if this is the board where we pick from
          return sourceBoard; // replace it with changed drop board
        }
        return b; // if neither leave it alone
      })
    );
    e.currentTarget.style.boxShadow = "none";
  }

  function handleDropCard(
    e: DragEvent<HTMLDivElement>,
    dropBoard: Board
  ): void {
    if (!sourceCard || !sourceBoard) return;
    const sourceIndex = sourceBoard.items.indexOf(sourceCard);
    sourceBoard.items.splice(sourceIndex, 1);

    setBoards((boards) => {
      return boards.map((b) => {
        if (b.id === dropBoard.id) {
          return { ...b, items: [...b.items, sourceCard] };
        }
        if (b.id === sourceBoard.id) {
          return {
            ...b,
            items: [
              ...b.items.slice(0, sourceIndex),
              ...b.items.slice(sourceIndex),
            ],
          };
        }
        return b;
      });
    });
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
            onDragOver={
              isHoveringOverCard ? undefined : (e) => handleDragOver(e)
            } // allows to drop things onto the board, board becomes a valid target
            onDrop={
              isHoveringOverCard ? undefined : (e) => handleDropCard(e, bd)
            }
          >
            <div className="board-title">{bd.title}</div>
            {bd.items.map((card) => (
              <div
                className="card"
                key={card.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, bd, card)} // when start dragging
                onDragOver={(e) => handleDragOverCard(e)} // when dragged element hovers over another one
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
