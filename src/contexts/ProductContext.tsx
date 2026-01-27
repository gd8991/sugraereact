import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types';
import { PRODUCTS } from '../utils/constants'; // Fallback products
import { shopifyAPI, testShopifyConnection } from '../services/shopify';
import { MARKETS } from './RegionContext';

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
const convertShopifyProduct = (shopifyProduct: any, index: number, region: string): Product => {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const variantId = firstVariant?.id ? firstVariant.id.split('/').pop() : undefined;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 125;

  // Build the product with base info
  const product: Product = {
    id: shopifyProduct.handle || `product-${index}`,
    number: String(index + 1).padStart(2, '0'),
    name: shopifyProduct.title,
    notes: shopifyProduct.description ? shopifyProduct.description.substring(0, 100) + '...' : 'Premium fragrance',
    description: shopifyProduct.description || 'No description available',
    bottleText: 'Sugraé', // Keep brand consistent
    price: price, // Default price
    shopifyVariantId: variantId,
  };

  // Store region-specific prices and variant IDs
  if (region === 'India') {
    product.priceINR = price;
    product.shopifyVariantIdINR = variantId;
  } else if (region === 'UAE') {
    product.priceAED = price;
    product.shopifyVariantIdAED = variantId;
  }

  return product;
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

      // Fetch products from all markets and merge the data
      const productsByMarket: Record<string, any[]> = {};

      for (const [regionKey, market] of Object.entries(MARKETS)) {
        try {
          console.log(`Fetching products for ${market.name} (${market.countryCode})...`);
          const shopifyProducts = await shopifyAPI.fetchProducts(20, market.countryCode);
          productsByMarket[regionKey] = shopifyProducts;
          console.log(`✓ Fetched ${shopifyProducts.length} products for ${market.name}`);
        } catch (error) {
          console.error(`Failed to fetch products for ${market.name}:`, error);
          productsByMarket[regionKey] = [];
        }
      }

      // Merge products from all markets
      const productMap = new Map<string, Product>();

      // Process each market's products
      for (const [regionKey, shopifyProducts] of Object.entries(productsByMarket)) {
        shopifyProducts.forEach((shopifyProduct, index) => {
          const handle = shopifyProduct.handle;
          const convertedProduct = convertShopifyProduct(
            shopifyProduct,
            index,
            regionKey
          );

          if (productMap.has(handle)) {
            // Merge region-specific data into existing product
            const existingProduct = productMap.get(handle)!;
            if (regionKey === 'India') {
              existingProduct.priceINR = convertedProduct.priceINR;
              existingProduct.shopifyVariantIdINR = convertedProduct.shopifyVariantIdINR;
            } else if (regionKey === 'UAE') {
              existingProduct.priceAED = convertedProduct.priceAED;
              existingProduct.shopifyVariantIdAED = convertedProduct.shopifyVariantIdAED;
            }
          } else {
            // Add new product
            productMap.set(handle, convertedProduct);
          }
        });
      }

      // Convert map to array
      const finalProducts = Array.from(productMap.values());

      if (finalProducts.length > 0) {
        setState({
          products: finalProducts,
          isLoading: false,
          error: null,
          isShopifyData: true,
        });

        console.log('Successfully loaded products from Shopify:', finalProducts.length);
        console.log('Products with multi-market pricing:', finalProducts);
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