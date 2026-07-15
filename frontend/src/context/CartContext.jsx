import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cboyistore_cart_v1";
const WISHLIST_KEY = "cboyistore_wishlist_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function addItem(product, variant = {}) {
    const storage = variant.storage || undefined;
    const color = variant.color || undefined;
    const lineId = `${product.id}::${storage || ""}::${color ? color.name : ""}`;
    const price = typeof variant.price === "number" ? variant.price : product.price;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === lineId);
      if (existing) {
        return prev.map((i) => (i.id === lineId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          image: product.images?.[0] || product.image,
          brand: product.brand,
          price,
          storage,
          color,
          qty: 1,
        },
      ];
    });
    setIsOpen(true);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  function addToWishlist(product, variant = {}) {
    const storage = variant.storage || undefined;
    const color = variant.color || undefined;
    const lineId = `${product.id}::${storage || ""}::${color ? color.name : ""}`;
    const price = typeof variant.price === "number" ? variant.price : product.price;
    setWishlist((prev) => {
      if (prev.find((i) => i.id === lineId)) return prev;
      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          image: product.images?.[0] || product.image,
          brand: product.brand,
          price,
          storage,
          color,
          qty: 1,
        },
      ];
    });
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  }

  function moveToCart(id) {
    setWishlist((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      setItems((cart) => {
        const existing = cart.find((i) => i.id === id);
        if (existing) {
          return cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
        }
        return [...cart, item];
      });
      return prev.filter((i) => i.id !== id);
    });
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const wishlistCount = useMemo(() => wishlist.reduce((s, i) => s + i.qty, 0), [wishlist]);

  const value = {
    items,
    wishlist,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    total,
    count,
    wishlistCount,
    isOpen,
    setIsOpen,
    checkoutOpen,
    setCheckoutOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
