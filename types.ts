export interface Item {
  id: number;
  name: string;
  category: number;
  location: number;
  description: string | null;
  date: string;
  photo: string | null;
}

export type ItemMutation = Omit<Item, 'id' | 'date'>;
