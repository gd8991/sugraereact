import type { Product, ExperienceItem, NavLink } from '../types';

export const NAVIGATION_LINKS: NavLink[] = [
  { href: '#founder', text: 'Our Story' },
  { href: '#collection', text: 'Collection' },
  { href: '#experience', text: 'Experience' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'alpha',
    number: '01',
    name: 'ALPHA',
    notes: 'Bergamot • White Tea • Soft Musk',
    description: 'Inspired by morning\'s first light touching a newborn\'s cheek. A gentle awakening that celebrates new beginnings with the softest touch.',
    bottleText: 'Sugraé'
  },
  {
    id: 'first-love',
    number: '02',
    name: 'First Love',
    notes: 'Honey • Vanilla • Sandalwood',
    description: 'The warmth of an embrace, the strength of love. Created for the woman who carries life while maintaining her golden radiance.',
    bottleText: 'Sugraé'
  },
  {
    id: 'aura',
    number: '03',
    name: 'AURA',
    notes: 'Rose Petals • Peach • White Cedar',
    description: 'Proof that gentleness is the ultimate luxury. A sophisticated whisper that speaks volumes without overwhelming.',
    bottleText: 'Sugraé'
  }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    icon: '🤰',
    label: 'GENTLE',
    text: 'Safe for pregnancy & sensitive skin'
  },
  {
    icon: '👶',
    label: 'BABY-SAFE',
    text: 'Mild enough for mothers & newborns'
  },
  {
    icon: '💎',
    label: 'LUXURIOUS',
    text: 'Premium ingredients, zero compromise'
  },
  {
    icon: '⏰',
    label: 'LONG-LASTING',
    text: '12+ hours of gentle elegance'
  }
];

export const FOUNDER_STORY = {
  subtitle: 'The Genesis',
  title: 'BORN FROM\nPURE LOVE',
  paragraphs: [
    'She had always been a woman of fragrances—bold, confident, unapologetic. Her collection of perfumes was her armor, her signature. Until the day two lines appeared on a test, and everything changed.',
    'Suddenly, the scents she loved became her enemy. Even the gentlest fragrance would overwhelm her expecting senses. She longed for that feeling again—to wear her confidence, to feel complete. She needed something revolutionary: a perfume gentle enough for her journey into motherhood, yet luxurious enough for the woman she remained.',
    'Her husband watched her struggle, and in that darkness, inspiration struck. Together, they crafted something unprecedented—solid perfumes that whisper instead of shout, that embrace without overwhelming. Portable luxury. Gentle power. Long-lasting elegance.',
    'Sugraé was born not in a laboratory, but in a moment of love. A husband\'s promise to his wife. A mother\'s wish for her child. A revolution in luxury fragrance that proves true opulence lies in caring for those we love.'
  ],
  signature: '— Founders, House of Sugraé'
};