export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export const useCart = () => {
  // Using useState to persist cart state across the client session
  const cartItems = useState<CartItem[]>('cart_items', () => []);
  const isCartOpen = useState<boolean>('cart_open', () => false);

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  const cartItemCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0);
  });

  const addToCart = (product: any, quantity: number = 1, size?: string, color?: string) => {
    const existingItem = cartItems.value.find(
      item => item.productId === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        id: Math.random().toString(36).substring(2, 9), // simple unique ID for cart row
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || '',
        size,
        color
      });
    }
  };

  const removeFromCart = (id: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = cartItems.value.find(item => item.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  return {
    cartItems,
    isCartOpen,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
