export type GroceryItem = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    discount: any;
    id: string;
    name: string;
    quantity: number;
    price: number;
  };

  export type FormatCurrency = (value: number, currency?: string, locale?: string) => string;