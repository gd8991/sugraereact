export interface Product {
  id: string;
  number: string;
  name: string;
  notes: string;
  description: string;
  bottleText: string;
  price: number;
  shopifyVariantId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ExperienceItem {
  icon: string;
  label: string;
  text: string;
  image: string;
}

export interface VIPBenefit {
  title: string;
  text: string;
}

export interface NavLink {
  href: string;
  text: string;
}

export interface CursorPosition {
  x: number;
  y: number;
}