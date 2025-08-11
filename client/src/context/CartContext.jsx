import { createContext, useReducer } from "react";

export const CartContext = createContext({
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
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

      console.log("UPDATED CART: ", updatedCart);

      return {
        ...state,
        cartItems: updatedCart,
        totalAmount: newTotal,
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.id !== action.payload.id
        ),
        totalAmount: state.totalAmount - action.payload.price,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
        totalAmount: 0,
      };
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

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        totalAmount: state.totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
