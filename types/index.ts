export type GroceryItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    category?: string;
  };

  export type FormatCurrency = (value: number, currency?: string, locale?: string) => string;