import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

type GroceryItem = {
  price: Number;
  id: string;
  name: string;
  quantity: number;
  category: string;
};

type GroceryStore = {
  items: GroceryItem[];
  addItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (item: GroceryItem) => void;
};

export const useGroceryStore = create<GroceryStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateItem: (updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        })),
    }),
    {
      name: 'grocery-storage', // Key in AsyncStorage
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
