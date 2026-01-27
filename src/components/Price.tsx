import type { FC } from 'react';
import { useRegion } from '../contexts/RegionContext';
import { getProductPrice, formatPrice } from '../utils/pricing';
import type { Product } from '../types';

interface PriceProps {
  product: Product;
  className?: string;
}

const Price: FC<PriceProps> = ({ product, className = '' }) => {
  const { region, marketConfig } = useRegion();
  const price = getProductPrice(product, region);

  // If price is 0 or undefined, show loading indicator
  if (!price || price === 0) {
    return <span className={className}>Loading...</span>;
  }

  const formattedPrice = formatPrice(price, marketConfig.currencySymbol);
  return <span className={className}>{formattedPrice}</span>;
};

export default Price;
