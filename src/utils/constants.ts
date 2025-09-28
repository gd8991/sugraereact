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
    bottleText: 'Sugraé',
    price: 125,
    shopifyVariantId: '51885552927020'
  },
  {
    id: 'first-love',
    number: '02',
    name: 'First Love',
    notes: 'Honey • Vanilla • Sandalwood',
    description: 'The warmth of an embrace, the strength of love. Created for the woman who carries life while maintaining her golden radiance.',
    bottleText: 'Sugraé',
    price: 135,
    shopifyVariantId: '51885552927020'
  },
  {
    id: 'aura',
    number: '03',
    name: 'AURA',
    notes: 'Rose Petals • Peach • White Cedar',
    description: 'Proof that gentleness is the ultimate luxury. A sophisticated whisper that speaks volumes without overwhelming.',
    bottleText: 'Sugraé',
    price: 145,
    shopifyVariantId: '51885552927020'
  }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    icon: '🤰',
    label: 'GENTLE',
    text: 'Crafted with the utmost care for expectant mothers, our fragrances use only the finest natural ingredients that are completely safe during pregnancy. Every note is carefully selected to provide a luxurious experience without any harmful chemicals or overwhelming intensity.',
    image: '/placeholder-gentle.jpg'
  },
  {
    icon: '👶',
    label: 'BABY-SAFE',
    text: 'Our revolutionary formula is so gentle and pure that it\'s safe to wear around newborns and infants. The subtle, non-invasive scent profile ensures that both mother and baby can enjoy the beautiful fragrance without any concerns about sensitivity or overpowering aromas.',
    image: '/placeholder-baby-safe.jpg'
  },
  {
    icon: '💎',
    label: 'LUXURIOUS',
    text: 'We believe that luxury shouldn\'t be compromised during motherhood. Each fragrance is created using premium ingredients sourced from the finest perfume houses around the world. The sophisticated blend delivers an opulent experience that makes every moment feel special.',
    image: '/placeholder-luxurious.jpg'
  },
  {
    icon: '⏰',
    label: 'LONG-LASTING',
    text: 'Experience up to 12 hours of gentle, consistent fragrance that evolves beautifully throughout the day. Our solid perfume technology ensures that the scent stays close to your skin, creating an intimate and personal fragrance experience that lasts from morning to night.',
    image: '/placeholder-long-lasting.jpg'
  },
  {
    icon: '🌿',
    label: 'SUSTAINABLE',
    text: 'Our commitment to the environment matches our commitment to mothers. Every ingredient is ethically sourced, our packaging is eco-friendly and recyclable, and our production process minimizes environmental impact. Beautiful fragrances that care for your family and the planet.',
    image: '/placeholder-sustainable.jpg'
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