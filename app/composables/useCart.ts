export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string | null;
  color: string | null;
  requiresSelection: boolean;
  availableSizes?: string[];
  availableColors?: string[];
}

export const useCart = () => {
  const { user } = useAuth()
  
  // Dynamic localStorage key based on auth state
  const cartKey = computed(() => {
    if (user.value?.id) {
      return `vigo_cart_user_${user.value.id}`
    }
    return 'vigo_cart_guest'
  })

  // Using useState to persist cart state across the client session
  const cartItems = useState<CartItem[]>('cart_items', () => []);
  const isCartOpen = useState<boolean>('cart_open', () => false);
  const hasHydratedCart = useState<boolean>('cart_hydrated', () => false);
  const hasCartWatcher = useState<boolean>('cart_watcher_ready', () => false);
  const previousUserId = useState<string | null>('previous_user_id', () => null);

  // Load from localStorage only after mount to avoid SSR hydration mismatches.
  if (import.meta.client) {
    onMounted(() => {
      if (!hasHydratedCart.value) {
        loadCart();
        hasHydratedCart.value = true;
      }

      if (!hasCartWatcher.value) {
        watch(cartItems, (newItems) => {
          saveCart(newItems);
        }, { deep: true });
        hasCartWatcher.value = true;
      }
    });

    // Watch for auth state changes to reload cart
    watch(() => user.value?.id, (newUserId, oldUserId) => {
      if (newUserId !== oldUserId) {
        // User logged in or logged out
        if (newUserId && !oldUserId) {
          // User just logged in - merge guest cart with user cart
          mergeGuestCartToUserCart(newUserId);
        } else if (!newUserId && oldUserId) {
          // User just logged out - clear user cart from memory
          clearCart();
        } else {
          // User switched - load new user's cart
          loadCart();
        }
        previousUserId.value = newUserId || null;
      }
    });
  }

  // Load cart from localStorage using current key
  const loadCart = () => {
    const savedCart = localStorage.getItem(cartKey.value);
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        cartItems.value = [];
      }
    } else {
      cartItems.value = [];
    }
  };

  // Save cart to localStorage using current key
  const saveCart = (items: CartItem[]) => {
    localStorage.setItem(cartKey.value, JSON.stringify(items));
  };

  // Merge guest cart with user cart on login
  const mergeGuestCartToUserCart = (userId: string) => {
    const guestCartKey = 'vigo_cart_guest';
    const userCartKey = `vigo_cart_user_${userId}`;
    
    // Load guest cart
    const guestCartStr = localStorage.getItem(guestCartKey);
    let guestCart: CartItem[] = [];
    if (guestCartStr) {
      try {
        guestCart = JSON.parse(guestCartStr);
      } catch (e) {
        console.error('Failed to parse guest cart', e);
      }
    }

    // Load user cart
    const userCartStr = localStorage.getItem(userCartKey);
    let userCart: CartItem[] = [];
    if (userCartStr) {
      try {
        userCart = JSON.parse(userCartStr);
      } catch (e) {
        console.error('Failed to parse user cart', e);
      }
    }

    // Merge carts: user cart takes priority, guest items added if not duplicate
  const mergedCart = [...userCart];
  
  guestCart.forEach(guestItem => {
    const existingItem = mergedCart.find(
      item => item.productId === guestItem.productId && 
                item.size === guestItem.size && 
                item.color === guestItem.color
    );
    
    if (existingItem) {
      // Merge quantities
      existingItem.quantity += guestItem.quantity;
    } else {
      // Add new item with default values for new fields if missing
      mergedCart.push({
        ...guestItem,
        requiresSelection: guestItem.requiresSelection || false,
        availableSizes: guestItem.availableSizes || [],
        availableColors: guestItem.availableColors || []
      });
    }
  });

    // Save merged cart to user key
    localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
    
    // Delete guest cart
    localStorage.removeItem(guestCartKey);
    
    // Update state with merged cart
    cartItems.value = mergedCart;
    
    console.log(`[CART] Merged guest cart (${guestCart.length} items) with user cart (${userCart.length} items) → ${mergedCart.length} items`);
  };

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
      const requiresSelection = !!(product.sizes?.length || product.colors?.length);
      cartItems.value.push({
        id: Math.random().toString(36).substring(2, 9), // simple unique ID for cart row
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || '',
        size: size || null,
        color: color || null,
        requiresSelection,
        availableSizes: product.sizes || [],
        availableColors: product.colors || []
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

  const updateCartItemVariant = (id: string, type: 'size' | 'color', value: string) => {
    const item = cartItems.value.find(item => item.id === id);
    if (item) {
      if (type === 'size') {
        item.size = value;
      } else if (type === 'color') {
        item.color = value;
      }
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    saveCart([]);
  };

  return {
    cartItems,
    isCartOpen,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemVariant,
    clearCart
  };
};
