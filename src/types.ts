export interface Product {
  id?: string;
  name: string;
  price: string;
  image: string;
  desc: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  // Huile de Moteur
  { name: 'CANADA PLUS OIL 20W-50', price: '3,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'DADO OIL (4 L)', price: '14,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'DADO OIL (1 L)', price: '3,500 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'CASTROL OIL 10w-40 (5 L)', price: '25,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'CASTROL OIL 5w-30 (5 L)', price: '30,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'CASTROL OIL 20w-50 (5 L)', price: '22,500 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'CASTROL OIL 15w-40 (5 L)', price: '20,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'TOYOTA 5w-30 (5 L)', price: '30,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Oil (Huile de Moteur)' },
  { name: 'V8 ENGINE FLUSH PLUS', price: '5,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Engine Flush (Huile de Moteur)' },
  { name: 'V8 OIL TREATMENT', price: '5,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Oil Treatment (Huile de Moteur)' },
  
  // Liquide de Frein
  { name: 'ROYAL BREAK FLUID', price: '1,500 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Brake Fluid (Liquide de Frein)' },
  
  // Eau de Radiateur
  { name: 'LIQUIDE DE REFROIDISSEMENT (5L)', price: '5,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Radiator Coolant (Eau de Radiateur)' },
  
  // L'Huile de Boite de Vitesses
  { name: 'MACAT SAE 90', price: '2,500 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Gearbox Oil (Huile de Boite de Vitesses)' },
  
  // Huile de Crémaillère
  { name: 'MACAT ATF TYPE-A', price: '2,500 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Power Steering Fluid (Huile de Crémaillère)' },
  { name: 'ATOMATIC TRANSMISSION FLUID ATF III', price: '5,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'ATF Level III (Huile de Crémaillère)' },

  // Batteries
  { name: 'Loong Battery 95A', price: '65,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Car Battery' },
  { name: 'Loong Battery 75A', price: '45,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Car Battery' },
  { name: 'Supreme Battery 100A', price: '95,000 FRS', image: 'https://i.ibb.co/gbjr4w68/Chat-GPT-Image-Mar-14-2026-06-35-03-PM.png', desc: 'Car Battery' }
];