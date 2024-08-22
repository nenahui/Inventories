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

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export type CategoryMutation = Omit<Category, 'id'>;

export interface Location {
  id: number;
  name: string;
  description: string | null;
}

export type LocationMutation = Omit<Location, 'id'>;
