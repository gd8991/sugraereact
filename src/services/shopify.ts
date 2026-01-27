interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface ShopifyResponse {
  data?: {
    products?: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export class ShopifyStorefrontAPI {
  private domain: string;
  private accessToken: string;
  private apiVersion: string = '2024-10';

  constructor(domain: string, accessToken: string) {
    this.domain = domain;
    this.accessToken = accessToken;
  }

  private async query(query: string, variables?: any): Promise<any> {
    console.log('Making Shopify API request to:', `https://${this.domain}/api/${this.apiVersion}/graphql.json`);
    console.log('Query:', query);
    console.log('Variables:', variables);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': this.accessToken,
    };

    const response = await fetch(`https://${this.domain}/api/${this.apiVersion}/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error response:', errorText);
      throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Shopify API response:', result);
    return result;
  }

  async fetchProducts(first: number = 10, countryCode?: string): Promise<ShopifyProduct[]> {
    const query = `
      query getProducts($first: Int!, $country: CountryCode) @inContext(country: $country) {
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      console.log('Fetching products from Shopify with first:', first, 'country:', countryCode);
      const variables = { first, country: countryCode };
      const response: ShopifyResponse = await this.query(query, variables);

      console.log('Raw Shopify response:', response);

      if (response.errors) {
        console.error('GraphQL errors:', response.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (!response.data?.products?.edges) {
        console.warn('No products found in response');
        return [];
      }

      const products = response.data.products.edges.map(edge => edge.node);
      console.log('Parsed products:', products);

      return products;
    } catch (error) {
      console.error('Error fetching products from Shopify:', error);
      throw error;
    }
  }
}

// Initialize with your Storefront API access token
export const shopifyAPI = new ShopifyStorefrontAPI(
  'sugrae.myshopify.com',
  '7989ca7d6768798fa773b37d614cb61d'
);

// Test function - you can call this in browser console to debug
export const testShopifyConnection = async () => {
  try {
    console.log('Testing Shopify connection...');
    const products = await shopifyAPI.fetchProducts(5);
    console.log('✅ Shopify connection successful!');
    console.log('Products found:', products.length);
    console.log('Products:', products);
    return products;
  } catch (error) {
    console.error('❌ Shopify connection failed:', error);
    throw error;
  }
};

// Make test function globally accessible for debugging
if (typeof window !== 'undefined') {
  (window as any).testShopifyConnection = testShopifyConnection;
  (window as any).shopifyAPI = shopifyAPI;
}