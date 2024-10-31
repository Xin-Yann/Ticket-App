import React, { createContext, useState} from 'react';
import { Alert } from 'react-native'; 

interface TicketOption {
  id: string;
  title: string;
  price: number; 
}

interface CartItem {
  id: string; 
  name: string;  
  option: TicketOption | null; 
  date: string;  
  time: string; 
  quantity: number;  
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[]; 
  addToCart: (item: CartItem) => void; 
  removeItem: (item: string) => void; 
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => [...prevItems, item]);
    console.log('Item added to cart:', item); 

    Alert.alert(
      'Success!',
      'Item added to cart successfully!',
      [{ text: 'OK' }],
      { cancelable: false } 
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      if (newItems.length < prevItems.length) {
        Alert.alert(
          'Removed!',
          'Item removed from cart successfully!',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
      return newItems;
    });
    console.log('Item removed from cart:', itemId);
  };

  console.log('Current cart items:', cartItems);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeItem  }}>
      {children}
    </CartContext.Provider>
  );
};
