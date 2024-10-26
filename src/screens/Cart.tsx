import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { CartContext } from '../screens/CartContext'; 
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './ThingsToDo';
import CheckBox from '@react-native-community/checkbox';

interface TicketOption {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string;
  name: string;
  option: TicketOption | null;
  date: string;
  time: string;
  quantity: number;
}

interface CartItem {
  id: string; 
  name: string;  
  option: TicketOption | null; 
  date: string;  
  time: string;  
  quantity: number; 
  image: string;
}

const Cart: React.FC = () => {
  const context = useContext(CartContext);

  if (!context) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Cart context is not available.</Text>
      </View>
    );
  }

  const { cartItems } = context;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (

    <View style={styles.cartItemContainer}>
      <CheckBox
        value={selectedItems.includes(item.id)}
        onValueChange={() => toggleSelectItem(item.id)}
      />
      <View style={styles.imageContainer}>
        {/* Placeholder for image */}
        {item.option?.image ? (
          <Image source={{ uri: item.option.image }} style={styles.ticketImage} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.cartDetails}>
        <Text style={styles.itemTitle}>{item.option?.title}</Text>
        <Text style={styles.itemText}>Date: {item.date}</Text>
        <Text style={styles.itemText}>Travelers: Adults</Text>
        <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>RM {item.option?.price}</Text>
      </View>
    </View>
  );

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.option?.price || 0) * item.quantity, 0);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <Image source={require('../image/back-icon.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>Cart</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
              <Image source={require('../image/Shopping-cart.png')} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal:</Text>
          <Text style={styles.summaryPrice}>RM {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Discount:</Text>
          <Text style={styles.summaryPrice}>RM 0.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Price:</Text>
          <Text style={styles.summaryPrice}>RM {subtotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', 
    justifyContent: 'center', 
  },
  container: {
    flex: 1,
    padding: 16,
  },
  cartHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 40,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    marginTop: 0,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
  },
  cartDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: -30,
    width: 399,
    height: 240,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, 
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001a33',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001a33',
  },
  checkoutButton: {
    backgroundColor: '#003366',
    paddingVertical: 16,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001a33',
    marginLeft: 30,
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    marginTop: 15,
  }
});

export default Cart;
