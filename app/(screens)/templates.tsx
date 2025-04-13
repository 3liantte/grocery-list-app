import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useGroceryStore } from '../store/grocery-store';
import { useRouter } from 'expo-router';

export default function TemplatesScreen() {
  const { templateLists, addItem } = useGroceryStore((state) => ({
    templateLists: state.templateLists,
    addItem: state.addItem,
  }));
  const router = useRouter();

  // Function to load the template items into the grocery list
  const loadTemplate = (templateId: string) => {
    const template = templateLists.find((tpl) => tpl.id === templateId);
    if (template) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      template.items.forEach((item) => {
        addItem(item); // Add item to the list
      });
    }
    router.back(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Templates</Text>
      <FlatList
        data={templateLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <Text style={styles.templateName}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => loadTemplate(item.id)}
              style={styles.loadButton}
            >
              <Text style={styles.buttonText}>Load Template</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  templateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  templateName: {
    fontSize: 18,
  },
  loadButton: {
    backgroundColor: '#00b809',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
