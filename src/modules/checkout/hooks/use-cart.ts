import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  // using zustand selectors to avoid unnecessary re-renders
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []));

  const toggleProduct = useCallback((productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  }, [productIds, addProduct, removeProduct, tenantSlug]);

  const isProductInCart = useCallback((productId: string) => {
    return productIds.includes(productId);
  },[productIds]);

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [clearCart, tenantSlug]);

  const handleAddProduct = useCallback((productId: string) => {
    addProduct(tenantSlug, productId);
  }, [addProduct, tenantSlug]);

  const handleRemoveProduct = useCallback((productId: string) => {
    removeProduct(tenantSlug, productId);
  }, [removeProduct, tenantSlug]);

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
