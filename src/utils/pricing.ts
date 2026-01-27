import type { Product } from '../types';
import type { Region } from '../contexts/RegionContext';

export const getProductPrice = (product: Product, region: Region): number => {
  switch (region) {
    case 'India':
      return product.priceINR || product.price;
    case 'UAE':
      return product.priceAED || product.price;
    default:
      return product.price;
  }
};

export const getProductVariantId = (product: Product, region: Region): string => {
  switch (region) {
    case 'India':
      return product.shopifyVariantIdINR || product.shopifyVariantId || '';
    case 'UAE':
      return product.shopifyVariantIdAED || product.shopifyVariantId || '';
    default:
      return product.shopifyVariantId || '';
  }
};

export const formatPrice = (price: number, currencySymbol: string): string => {
  // Format with exactly 2 decimal places if price has decimals, otherwise show as integer
  const hasDecimals = price % 1 !== 0;
  const formatted = hasDecimals
    ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return `${currencySymbol}${formatted}`;
};
