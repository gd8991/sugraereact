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
    text: 'Our perfumes are crafted with a delicate balance of notes that linger softly on the skin, offering a refined presence without ever overwhelming. Each fragrance unfolds gracefully, ensuring that every spray feels light, smooth, and perfectly suited for daily wear. Designed for comfort and elegance, these scents become an effortless part of your routine, leaving a subtle trail of sophistication wherever you go. Gentle yet captivating, our perfumes embody the art of understated luxury.',
    image: '/placeholder-gentle.jpg'
  },
  {
    icon: '👶',
    label: 'BABY-SAFE',
    text: 'Purity meets safety in every bottle. Our formulations are carefully designed with premium, skin-friendly ingredients that prioritize your well-being. Free from harsh elements, the perfumes offer a clean, breathable fragrance experience that feels safe even around little ones. This makes them a trusted choice for modern lifestyles where comfort, care, and responsibility are valued as much as elegance. With baby-safe compositions, you can embrace a fragrance that reflects not just your style, but also your commitment to gentleness and safety.',
    image: '/placeholder-baby-safe.jpg'
  },
  {
    icon: '💎',
    label: 'LUXURIOUS',
    text: 'Step into a world where every detail exudes refinement. Our perfumes are more than scents—they are experiences, created with the finest ingredients sourced globally and blended by master perfumers. Each fragrance is layered with richness, depth, and a timeless aura that captures the essence of true indulgence. From the very first spritz, you’ll discover elegance that feels both classic and contemporary. With packaging that mirrors the artistry inside, our perfumes embody luxury that can be felt, seen, and remembered.',
    image: '/placeholder-luxurious.jpg'
  },
  {
    icon: '⏰',
    label: 'LONG-LASTING',
    text: 'Endurance is the hallmark of true craftsmanship. Our perfumes are designed to stay with you from morning to night, evolving with the rhythm of your day. Each fragrance is meticulously composed to ensure lasting power without compromising on quality or refinement. The notes remain vibrant and balanced, offering a consistent aura that feels fresh and sophisticated for hours on end. With long-lasting performance, every moment becomes an opportunity to leave a memorable impression—effortlessly elegant, always present.',
    image: '/placeholder-long-lasting.jpg'
  },
  {
    icon: '🌿',
    label: 'SUSTAINABLE',
    text: 'True luxury embraces responsibility. Our perfumes are thoughtfully created with sustainability at the heart of every step—from ethically sourced ingredients to eco-conscious packaging. We believe beauty should never come at the expense of the planet, which is why each fragrance reflects a commitment to both elegance and environmental care. By choosing our perfumes, you celebrate not only refined craftsmanship but also a mindful lifestyle. Every bottle is a testament to harmony between indulgence and integrity, proving that sophistication and sustainability can coexist beautifully.',
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