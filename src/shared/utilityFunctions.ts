import { type DragEvent } from "react";

export function handleDragOver(e: DragEvent<HTMLDivElement>): void {
  e.preventDefault(); // allows this element to be a valid target for dropping
  if (e.currentTarget.className === "card") {
    // current target - element that we hover the card over
    e.currentTarget.style.boxShadow = "0 4px 3px grey";
  }
}

export function handleDragEnd(e: DragEvent<HTMLDivElement>): void {
  e.currentTarget.style.boxShadow = "none";
}
