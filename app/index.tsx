import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useGroceryStore } from './store/grocery-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FormatCurrency } from './types/index';
import Toast from 'react-native-toast-message';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const items = useGroceryStore((state) => state.items);
  const removeItem = useGroceryStore((state) => state.removeItem);
  const [templateName, setTemplateName] = useState("");

  // Robust rounding function to prevent floating-point precision errors
  const roundToTwo = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const formatCurrency: FormatCurrency = (value, currency = 'ZAR', locale = 'en-ZA') => {
    // Ensure the value is rounded correctly at the display stage
    const roundedValue = roundToTwo(value);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, // Forces two decimal places
    }).format(roundedValue);
  };

  // Total price calculation without early rounding
  const getTotalPrice = () => {
    const total = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return total; // We will round at the display stage
  };

  // Calculate total number of items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Item removed!',
      text2: 'The item was successfully removed from your list.',
    });
  };

  const handleSaveTemplate = () => {
    if (templateName.trim() === " "){
      Toast.show({
        type: "error",
        position: "top",
        text1: "Template Name is required",
      });
      return;
    }
    useGroceryStore.getState().saveTemplateList(templateName);
    Toast.show({
      type: "success",
      position: "top",
      text1: "Template saved!",
    });
    setTemplateName(" "); //Resets template name
  }

  return (
    <View style={styles.container}>
      <Text style={styles.receiptTitle}>GROCERIES</Text>
      <View style={{ marginTop: 20 }}>
        <View style={styles.templateButtons}>
          <TouchableOpacity 
            onPress={() => router.push("/templates")}
            style={{ padding: 10, width: 160, backgroundColor: '#00b809', borderRadius: 5 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Manage Templates</Text>
          </TouchableOpacity>

          <TextInput
          style={styles.input}
          placeholder="Template Name"
          value={templateName}
          onChangeText={setTemplateName}/>
          <TouchableOpacity onPress={handleSaveTemplate} style={styles.saveButton}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Template</Text>
          </TouchableOpacity>
        </View>
    </View>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items yet...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }} // Make space for footer
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                {item.name
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Text>
                <Text style={styles.itemSubText}>
                  {item.quantity} x {formatCurrency(item.price)} • {item.category}
                </Text>
              </View>
              <View style={styles.itemPriceContainer}>
                <Text style={styles.itemText}>
                  {formatCurrency(item.price * item.quantity)} {/* Price * Quantity */}
                </Text>

                {/* Edit Button */}
                <Link href={{ pathname: '/edit-item/[id]', params: { id: item.id } }} asChild>
                  <TouchableOpacity style={styles.editButton}>
                    <Feather name="edit-2" size={20} color="#00b809" />
                  </TouchableOpacity>
                </Link>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)} // Delete item on press
                  style={styles.deleteButton}
                >
                  <Feather name="x" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>TOTAL:</Text>
          <Text style={styles.totalText}>{formatCurrency(getTotalPrice())}</Text>
        </View>

        <View style={styles.totalItemsContainer}>
          <Text style={styles.totalItemsText}>Total Items: {getTotalItems()}</Text>
        </View>
      </View>

      {/* Add Button Above Footer */}
      <Link href="/add-items" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Sans', // Receipt feel
  },
  itemSubText: {
    fontSize: 12,
    color: '#555',
  },
  itemPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalItemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 120, // Adjust to make space for footer
    backgroundColor: '#00b809',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  editButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#d1e7dd', // Light green
  },
  templateButtons: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#00b809',
    padding: 10,
    borderRadius: 5,
  },
});
