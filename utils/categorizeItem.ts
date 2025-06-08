import categoryConfig from './category-config.json';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // remove punctuation
    .trim()
    .replace(/\s+/g, ' '); // remove extra spaces
}

export function categorizeItem(itemName: string): string {
  const normalizedItem = normalize(itemName);

  for (const [category, keywords] of Object.entries(categoryConfig)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);

      // Check if item contains keyword or its plural form
      if (
        normalizedItem.includes(normalizedKeyword) ||
        normalizedItem.includes(normalizedKeyword + 's')
      ) {
        return category;
      }
    }
  }

  return 'Uncategorized';
}
