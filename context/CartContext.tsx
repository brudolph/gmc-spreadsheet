'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  priceMin: number;
  priceMax: number;
  quantity: number;
  inventory: number;
  imageUrl: string;
  strain: string;
  category: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex((i) => i.productId === action.payload.productId);
      const maxQty = action.payload.inventory;
      if (idx >= 0) {
        const updated = [...state.items];
        const newQty = Math.min(updated[idx].quantity + action.payload.quantity, maxQty);
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          inventory: maxQty,
        };
        return { items: updated };
      }
      return {
        items: [
          ...state.items,
          { ...action.payload, quantity: Math.min(action.payload.quantity, maxQty) },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.productId !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== action.payload.productId) };
      }
      return {
        items: state.items.map((i) => {
          if (i.productId !== action.payload.productId) return i;
          return { ...i, quantity: Math.min(action.payload.quantity, i.inventory) };
        }),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return { items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gmc-cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('gmc-cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const getItemQuantity = (productId: string) => {
    const item = state.items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id, qty) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: id, quantity: qty } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        totalItems,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
