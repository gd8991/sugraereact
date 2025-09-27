import type { CartItem } from '../types';

export interface ShopifyLineItem {
  variant_id: string;
  quantity: number;
}

export const createShopifyCheckoutUrl = (items: CartItem[], domain: string = 'sugrae.myshopify.com'): string => {
  if (items.length === 0) {
    throw new Error('Cannot create checkout URL with empty cart');
  }

  // Build cart permalink with variant IDs and quantities
  const cartItems = items.map(item => {
    const variantId = item.product.shopifyVariantId || '10080692535596';
    return `${variantId}:${item.quantity}`;
  }).join(',');

  const checkoutUrl = `https://${domain}/cart/${cartItems}`;
  console.log('Generated Shopify checkout URL:', checkoutUrl);
  console.log('Cart items:', items.map(item => `${item.product.name} (Qty: ${item.quantity})`));

  return checkoutUrl;
};

export const addToCartAndRedirect = async (items: CartItem[], domain: string = 'sugrae.myshopify.com'): Promise<void> => {
  try {
    // Create form data for adding multiple items to cart
    const formData = new FormData();

    items.forEach(item => {
      const variantId = item.product.shopifyVariantId || '51885552927020';
      formData.append('items[][id]', variantId);
      formData.append('items[][quantity]', item.quantity.toString());
    });

    // Add items to cart via POST request
    const response = await fetch(`https://${domain}/cart/add.js`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // If successful, redirect to checkout
      window.open(`https://${domain}/checkout`, '_blank', 'noopener,noreferrer');
    } else {
      throw new Error('Failed to add items to cart');
    }
  } catch (error) {
    console.error('Error adding items to cart:', error);
    // Fallback to direct cart URL method
    const cartUrl = createShopifyCheckoutUrl(items, domain);
    window.open(cartUrl, '_blank', 'noopener,noreferrer');
  }
};

export const redirectToShopifyCheckout = (items: CartItem[], domain?: string): void => {
  try {
    const storeDomain = domain || 'sugrae.myshopify.com';

    console.log('Cart items to purchase:', items.map(item => `${item.product.name} (Qty: ${item.quantity})`));

    // Use the buy_button channel template format
    const cartItems = items.map(item => {
      const variantId = item.product.shopifyVariantId || '51885552927020';
      return `${variantId}:${item.quantity}`;
    }).join(',');

    const checkoutUrl = `https://${storeDomain}/cart/${cartItems}`;
    console.log('Shopify checkout URL:', checkoutUrl);

    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');

  } catch (error) {
    console.error('Failed to redirect to Shopify checkout:', error);

    // Fallback: Just open the cart page
    const fallbackUrl = `https://${domain || 'sugrae.myshopify.com'}/cart`;
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');

    alert('Redirected to cart page. Please manually add your items.');
  }
};