import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGroceryStore } from '../store/grocery-store';
import Toast from 'react-native-toast-message';
import Header from '../components/ui/Header';
import { categorizeItem } from '../utils/categorizeItem';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const getItemById = useGroceryStore((state) =>
    state.items.find((item) => item.id === id)
  );

  const updateItem = useGroceryStore((state) => state.updateItem);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState(''); // Discount state
  const [discountType, setDiscountType] = useState('fixed'); // State for discount type
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getItemById) {
      setName(getItemById.name);
      setPrice(getItemById.price.toString());
      setQuantity(getItemById.quantity.toString());
      setDiscount(getItemById.discount ? getItemById.discount.toString() : ''); // Set discount if available
    }
  }, [getItemById]);

  const handleUpdate = () => {
    if (!name || !price || !quantity) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields',
      });
      return;
    }

    setLoading(true);

    const normalizedPrice = price.replace(',', '.'); // Normalize price input (replace commas)
    const parsedQuantity = Number.parseInt(quantity, 10);
    const parsedPrice = Number.parseFloat(normalizedPrice);

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid quantity',
      });
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid price',
      });
      return;
    }

    // Calculate discount based on discount type (fixed price or percentage)
    let finalPrice = parsedPrice;
    if (discount) {
      const parsedDiscount = Number.parseFloat(discount);
      if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
        Toast.show({
          type: 'error',
          text1: 'Please enter a valid discount',
        });
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

    const updatedItem = {
      id: id as string,
      name,
      quantity: parsedQuantity,
      price: finalPrice, // Updated price with discount
      discount: Number.parseFloat(discount), // Save discount if applicable
      discountType, // Save the discount type
      category: name !== getItemById?.name
      ? categorizeItem(name) : getItemById?.category ?? "Others", // Update category if name changed
    };

    updateItem(updatedItem);
    setLoading(false);

    Toast.show({
      type: 'success',
      text1: 'Item updated successfully!',
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Item" />

      <TextInput
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
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

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00b809',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  discountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
