import { createContext, useReducer } from "react";

export const CartContext = createContext({
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCartQuantity: () => {},
  updateCartItem: () => {},
  cartItems: [],
  totalAmount: 0,
});

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItems = action.payload;
      let updatedCart = [...state.cartItems];

      newItems.forEach((newItem) => {
        const idx = updatedCart.findIndex(
          (item) => item.ticketId === newItem.ticketId
        );
        const quantityToAdd = Number(newItem.quantity); // Always ensure quantity is a number

        if (idx !== -1) {
          updatedCart[idx] = {
            ...updatedCart[idx],
            quantity: Number(updatedCart[idx].quantity) + quantityToAdd,
          };
        } else {
          updatedCart.push({
            ...newItem,
            quantity: quantityToAdd,
          });
        }
      });

      const newTotal = updatedCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return {
        ...state,
        cartItems: updatedCart,
        totalAmount: newTotal,
      };
    }
    case "REMOVE_FROM_CART": {
      const updatedCart = [...state.cartItems];
      const itemToRemove = updatedCart.find(
        (item) => item.ticketId === action.payload.ticketId
      );
      if (itemToRemove) {
        updatedCart.splice(updatedCart.indexOf(itemToRemove), 1);
      }

      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.ticketId !== action.payload.ticketId
        ),
        totalAmount:
          state.totalAmount - itemToRemove.price * itemToRemove.quantity,
      };
    }
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
        totalAmount: 0,
      };
    case "UPDATE_QUANTITY": {
      const { ticketId, quantity } = action.payload;
      const updatedCartItems = state.cartItems.map((item) =>
        item.ticketId === ticketId
          ? { ...item, quantity: Number(quantity) }
          : item
      );
      const newTotal = updatedCartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return {
        ...state,
        cartItems: updatedCartItems,
        totalAmount: newTotal,
      };
    }
    case "UPDATE_CART_ITEM": {
      const { ticketId, updates } = action.payload;
      const updatedCartItems = state.cartItems.map((item) =>
        item.ticketId === ticketId ? { ...item, ...updates } : item
      );
      const newTotal = updatedCartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return {
        ...state,
        cartItems: updatedCartItems,
        totalAmount: newTotal,
      };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [],
    totalAmount: 0,
  });

  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (ticketId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { ticketId } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const updateCartQuantity = (ticketId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { ticketId, quantity } });
  };

  const updateCartItem = (ticketId, updates) => {
    dispatch({ type: "UPDATE_CART_ITEM", payload: { ticketId, updates } });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        totalAmount: state.totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
