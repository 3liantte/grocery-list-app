import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroceryStore } from '../store/grocery-store';
import type { GroceryItem } from '../types';
import Header from '../components/ui/Header';

const AddItemsScreen = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(''); // Discount state
  const [discountType, setDiscountType] = useState('fixed'); // Discount type state (fixed or percentage)

  const router = useRouter();
  const addItem = useGroceryStore((state) => state.addItem);

  const handleAdd = () => {
    if (!itemName.trim()) {
      Alert.alert('Please enter an item name.');
      return;
    }

    // Normalize price input: replace comma with dot for locale-specific formatting
    const normalizedPrice = price.replace(',', '.'); // Replace any commas with dots
    const parsedQuantity = Number.parseInt(quantity, 10);
    const parsedPrice = Number.parseFloat(normalizedPrice);

    // Validate quantity and price
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Please enter a valid quantity.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Please enter a valid price.');
      return;
    }

    // Calculate discount based on discount type (fixed price or percentage)
    let finalPrice = parsedPrice;
    if (discount) {
      const parsedDiscount = Number.parseFloat(discount);
      if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
        Alert.alert('Please enter a valid discount.');
        return;
      }

      if (discountType === 'percentage') {
        // Apply percentage discount
        finalPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;
      } else {
        // Apply fixed price discount
        finalPrice = parsedPrice - parsedDiscount;
      }
    }

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: parsedQuantity,
      price: finalPrice,
      discount: undefined
    };

    addItem(newItem);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Add New Item"/>

      <TextInput
        placeholder="e.g. Apples"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Toggle between percentage and fixed discount */}
      <View style={styles.discountTypeContainer}>
        <TouchableOpacity
          style={[styles.discountButton, discountType === 'fixed' && styles.activeButton]}
          onPress={() => setDiscountType('fixed')}
        >
          <Text style={[styles.discountButtonText, discountType === "fixed" && styles.activeButtonText]}>Fixed Price Discount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.discountButton, discountType === 'percentage' && styles.activeButton]}
          onPress={() => setDiscountType('percentage')}
        >
          <Text style={[styles.discountButtonText, discountType === "percentage" && styles.activeButtonText]}>Percentage Discount</Text>
        </TouchableOpacity>
      </View>

      {/* Discount input */}
      <TextInput
        placeholder={discountType === 'fixed' ? 'Discount Amount' : 'Discount Percentage'}
        value={discount}
        onChangeText={setDiscount}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
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
    backgroundColor: '#00b809',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  discountButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#00b809',
    borderColor: '#00b809',
  },
  discountButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
});

export default AddItemsScreen;
