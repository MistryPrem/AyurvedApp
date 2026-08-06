import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Booking, HealthRecord } from '../types';
import { storage } from '../services/storage';

interface AppStateContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>, isOffline?: boolean) => Booking;
  cancelBooking: (bookingId: string) => boolean;

  // Health Records
  customHealthRecords: HealthRecord[];
  addHealthRecord: (record: HealthRecord) => void;
}

const AppStateContext = createContext<AppStateContextType>({} as AppStateContextType);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customHealthRecords, setCustomHealthRecords] = useState<HealthRecord[]>([]);

  // Local persistence load
  useEffect(() => {
    (async () => {
      const savedCart = await storage.getItem<CartItem[]>('user_cart');
      if (savedCart) setCart(savedCart);

      const savedWishlist = await storage.getItem<string[]>('user_wishlist');
      if (savedWishlist) setWishlist(savedWishlist);

      const savedBookings = await storage.getItem<Booking[]>('user_bookings');
      if (savedBookings) setBookings(savedBookings);
    })();
  }, []);

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    storage.setItem('user_cart', newCart);
  };

  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(nextWishlist);
    storage.setItem('user_wishlist', nextWishlist);
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status'>, isOffline: boolean = false): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `book_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: isOffline ? 'PENDING_OFFLINE' : 'CONFIRMED',
    };
    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);
    storage.setItem('user_bookings', nextBookings);
    return newBooking;
  };

  const cancelBooking = (bookingId: string): boolean => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
    );
    setBookings(updated);
    storage.setItem('user_bookings', updated);
    return true;
  };

  const addHealthRecord = (record: HealthRecord) => {
    setCustomHealthRecords((prev) => [record, ...prev]);
  };

  return (
    <AppStateContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        bookings,
        addBooking,
        cancelBooking,
        customHealthRecords,
        addHealthRecord,
      }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
