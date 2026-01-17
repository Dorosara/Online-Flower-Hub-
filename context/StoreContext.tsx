import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, Product, Order } from '../types';
import { api } from '../services/mockData';

interface StoreContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (name: string, email: string) => Promise<void>;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Order State
  const [orders, setOrders] = useState<Order[]>([]);

  // Init - Load Auth & Cart
  useEffect(() => {
    // Check for existing session
    api.auth.getCurrentUser().then(u => {
      if (u) {
        setUser(u);
        api.orders.list(u.id).then(setOrders);
      }
    });

    // Load Local Cart
    const savedCart = localStorage.getItem('flowerhub_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowerhub_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, pass: string) => {
    const u = await api.auth.login(email, pass);
    setUser(u);
    await refreshOrders();
  };

  const signup = async (name: string, email: string, pass: string) => {
    // Note: mockData api signature changed in previous step to accept 3 args
    const u = await api.auth.signup(name, email, pass);
    setUser(u);
  };

  const updateUserProfile = async (name: string, email: string) => {
    if (!user) return;
    await api.auth.updateProfile(user.id, { name, email });
    setUser({ ...user, name, email });
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    setOrders([]);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const refreshOrders = async () => {
    if (user) {
      const list = await api.orders.list(user.id);
      setOrders(list);
    }
  };

  const placeOrder = async () => {
    if (!user) throw new Error("Must be logged in");
    const newOrder = await api.orders.create(user.id, cart, cartTotal);
    // Add new order to top of list
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      user, isAuthenticated: !!user, login, signup, updateUserProfile, logout,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      orders, placeOrder, refreshOrders
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};