export type Card = {
  id: number;
  text: string;
};

export type Board = {
  id: number;
  title: string;
  items: Card[];
};
