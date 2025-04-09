import { create } from 'zustand';

type GroceryItem = {
  id: string;
  name: string;
};

type GroceryStore = {
  items: GroceryItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
};

export const useGroceryStore = create<GroceryStore>((set) => ({
  items: [],
  addItem: (name) =>
    set((state) => ({
      items: [
        ...state.items,
        { id: Date.now().toString(), name },
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
