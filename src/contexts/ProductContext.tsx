import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from '../types';
import { PRODUCTS } from '../utils/constants'; // Fallback products
import { shopifyAPI, testShopifyConnection } from '../services/shopify';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isShopifyData: boolean; // Track if data is from Shopify or fallback
}

interface ProductContextType {
  state: ProductState;
  refreshProducts: () => Promise<void>;
  testConnection: () => Promise<any>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Helper function to convert Shopify product to our Product type
const convertShopifyProduct = (shopifyProduct: any, index: number): Product => {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const variantId = firstVariant?.id ? firstVariant.id.split('/').pop() : undefined;

  return {
    id: shopifyProduct.handle || `product-${index}`,
    number: String(index + 1).padStart(2, '0'),
    name: shopifyProduct.title,
    notes: shopifyProduct.description ? shopifyProduct.description.substring(0, 100) + '...' : 'Premium fragrance',
    description: shopifyProduct.description || 'No description available',
    bottleText: 'Sugraé', // Keep brand consistent
    price: firstVariant ? parseFloat(firstVariant.price.amount) : 125,
    shopifyVariantId: variantId,
  };
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProductState>({
    products: PRODUCTS, // Start with fallback products
    isLoading: true,
    error: null,
    isShopifyData: false,
  });

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch products from Shopify
      const shopifyProducts = await shopifyAPI.fetchProducts(20);

      if (shopifyProducts.length > 0) {
        // Convert Shopify products to our format
        const convertedProducts = shopifyProducts.map(convertShopifyProduct);

        setState({
          products: convertedProducts,
          isLoading: false,
          error: null,
          isShopifyData: true,
        });

        console.log('Successfully loaded products from Shopify:', convertedProducts.length);
      } else {
        // No products found, keep fallback
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No products found in Shopify store',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products from Shopify:', error);

      // Keep fallback products on error
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load products',
      }));
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductContextType = {
    state,
    refreshProducts,
    testConnection: testShopifyConnection,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};