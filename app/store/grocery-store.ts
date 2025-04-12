import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import type { GroceryItem } from '../types';
import { categorizeItem } from '../utils/categorizeItem';
import uuid from "react-native-uuid";

type TemplateList = {
  id: string;
  name: string;
  items: GroceryItem[];
};

type GroceryStore = {
  items: GroceryItem[];
  templateLists: TemplateList[];
  addItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (item: GroceryItem) => void;
  saveTemplateList: (name: string) => void;
};

export const useGroceryStore = create<GroceryStore>()(
  persist(
    (set, get) => ({
      items: [],
      templateLists: [],

      addItem: (item) => {
        const categorizedItem = {
          ...item,
          id: uuid.v4().toString(),
          category: categorizeItem(item.name),
        };
        set((state) => ({
          items: [...state.items, categorizedItem],
        }));
      },

      saveTemplateList: (name) => {
        const newTemplate: TemplateList = {
          id: uuid.v4().toString(),
          name,
          items: get().items.map((item) => ({ ...item })), // Deep copy
        };
        set((state) => ({
          templateLists: [...state.templateLists, newTemplate],
        }));
      },

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
      name: 'grocery-storage',
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
