import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroceryStore } from '../store/grocery-store';

const AddItemsScreen = () => {
  const [itemName, setItemName] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    if (!itemName.trim()) {
      Alert.alert('Please enter an item name.');
      return;
    }

    addItem(itemName);
    router.back(); // go back to home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      <TextInput
        placeholder="e.g. Apples"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
function addItem(itemName: string) {
    throw new Error('Function not implemented.');
}

export default AddItemsScreen;