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

  // Customer Authentication - Create Account
  async createCustomerAccount(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    acceptsEmailMarketing?: boolean
  ): Promise<any> {
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const input = {
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      acceptsMarketing: acceptsEmailMarketing || false,
    };

    try {
      const response = await this.query(mutation, { input });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (response.data?.customerCreate?.customerUserErrors?.length > 0) {
        const error = response.data.customerCreate.customerUserErrors[0];
        throw new Error(error.message || 'Failed to create account');
      }

      return response.data.customerCreate.customer;
    } catch (error) {
      console.error('Error creating customer account:', error);
      throw error;
    }
  }

  // Customer Authentication - Login with Access Token
  async customerLogin(email: string, password: string): Promise<any> {
    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const input = { email, password };

    try {
      const response = await this.query(mutation, { input });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (response.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
        const error = response.data.customerAccessTokenCreate.customerUserErrors[0];
        throw new Error(error.message || 'Invalid email or password');
      }

      const accessToken = response.data.customerAccessTokenCreate.customerAccessToken.accessToken;

      // Fetch customer details with the access token
      const customer = await this.getCustomerDetails(accessToken);
      return { ...customer, accessToken };
    } catch (error) {
      console.error('Error logging in customer:', error);
      throw error;
    }
  }

  // Get Customer Details with Access Token
  async getCustomerDetails(accessToken: string): Promise<any> {
    const query = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
          displayName
        }
      }
    `;

    try {
      const response = await this.query(query, { customerAccessToken: accessToken });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      return response.data.customer;
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
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