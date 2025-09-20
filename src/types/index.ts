export interface Product {
  id: string;
  number: string;
  name: string;
  notes: string;
  description: string;
  bottleText: string;
}

export interface ExperienceItem {
  icon: string;
  label: string;
  text: string;
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