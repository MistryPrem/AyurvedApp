import { Doctor, Product, HealthRecord, RecordType } from '../types';

const SPECIALTIES = [
  'Kayachikitsa (Internal Medicine)',
  'Panchakarma (Detoxification)',
  'Shalya Tantra (Surgery)',
  'Kaumarbhritya (Pediatrics)',
  'Shalakya Tantra (ENT & Ophthalmology)',
  'Agada Tantra (Toxicology)',
  'Rasayana (Rejuvenation)',
  'Vajikarana (Aphrodisiac)',
];

const HOSPITALS = [
  'Amrutam Ayurvedic Wellness Center',
  'AyurVeda Grama Super Specialty',
  'Charaka Ayurvedic Institute',
  'Sushruta Health & Holistic Center',
  'Patrik Ayush Hospital',
];

const PRODUCT_CATEGORIES = [
  'Immunity & Vitality',
  'Chyawanprash & Tonics',
  'Hair Care & Oils',
  'Skincare & Herbal Soaps',
  'Digestive Health',
  'Stress & Sleep',
];

const RECORD_TYPES: RecordType[] = ['Lab Report', 'Prescription', 'Consultation', 'Vaccination', 'Allergy'];

const TAG_POOL = ['blood-test', 'liver-detox', 'panchakarma', 'herbal-rx', 'annual-checkup', 'dosha-analysis', 'pitta-balancing', 'vata-care', 'skin-report'];

// Reuse static image pool to avoid thousands of unique network requests to picsum
const SAMPLE_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80',
  'https://images.unsplash.com/photo-1512290900676-26c2a4d4b51d?w=200&q=80',
  'https://images.unsplash.com/photo-1608248597263-0057e57b4524?w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80',
];

// In-memory singletons to avoid re-generating datasets on navigation switches
let cachedDoctors: Doctor[] | null = null;
let cachedProducts: Product[] | null = null;
let cachedHealthRecords: HealthRecord[] | null = null;

export function generateDoctors(count: number = 5000): Doctor[] {
  if (cachedDoctors && cachedDoctors.length === count) {
    return cachedDoctors;
  }

  const doctors: Doctor[] = [];
  const timeSlots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  for (let i = 1; i <= count; i++) {
    const specIndex = i % SPECIALTIES.length;
    const hospIndex = i % HOSPITALS.length;
    doctors.push({
      id: `doc_${i}`,
      name: `Dr. ${getDoctorName(i)}`,
      specialty: SPECIALTIES[specIndex],
      experienceYears: 3 + (i % 30),
      rating: +(4 + (i % 10) / 10).toFixed(1),
      consultationFee: 300 + (i % 15) * 50,
      avatarUrl: SAMPLE_IMAGE_POOL[i % SAMPLE_IMAGE_POOL.length],
      hospital: HOSPITALS[hospIndex],
      availableSlots: timeSlots.map((slot) => `2026-08-${10 + (i % 15)} ${slot}`),
    });
  }

  cachedDoctors = doctors;
  return doctors;
}

export function generateProducts(count: number = 20000): Product[] {
  if (cachedProducts && cachedProducts.length === count) {
    return cachedProducts;
  }

  const products: Product[] = [];
  const baseNames = ['Nari Sondarya Malt', 'Bhringa Hair Oil', 'Chyawanprash Care', 'Kuntal Care Hair Spa', 'Triphala Churna', 'Amrutam Skincare Oil', 'Ashwagandha Vitality', 'Brahmi Brain Booster'];

  for (let i = 1; i <= count; i++) {
    const catIndex = i % PRODUCT_CATEGORIES.length;
    const nameIndex = i % baseNames.length;
    const price = 250 + (i % 100) * 10;

    products.push({
      id: `prod_${i}`,
      title: `${baseNames[nameIndex]} ${i}`,
      category: PRODUCT_CATEGORIES[catIndex],
      price: price,
      originalPrice: price + 150,
      rating: +(4 + (i % 10) / 10).toFixed(1),
      reviewCount: 12 + (i % 500),
      imageUrl: SAMPLE_IMAGE_POOL[i % SAMPLE_IMAGE_POOL.length],
      description: `Authentic Ayurvedic formulation infused with natural herbs to restore balance and harmony in your body.`,
      inStock: i % 10 !== 0,
    });
  }

  cachedProducts = products;
  return products;
}

export function generateHealthRecords(count: number = 10000): HealthRecord[] {
  if (cachedHealthRecords && cachedHealthRecords.length === count) {
    return cachedHealthRecords;
  }

  const records: HealthRecord[] = [];
  const currentYear = 2026;

  for (let i = 1; i <= count; i++) {
    const typeIndex = i % RECORD_TYPES.length;
    const type = RECORD_TYPES[typeIndex];
    const month = (i % 12) + 1;
    const year = currentYear - (i % 3);
    const day = (i % 28) + 1;

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const date = `${year}-${monthStr}-${dayStr}`;

    const selectedTags = [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 1) % TAG_POOL.length]];

    records.push({
      id: `rec_${i}`,
      title: `${type} #${i}`,
      type: type,
      date: date,
      doctorName: `Dr. ${getDoctorName(i)}`,
      facility: HOSPITALS[i % HOSPITALS.length],
      summary: `Clinical notes and test parameters for ${type.toLowerCase()} conducted on ${date}.`,
      tags: selectedTags,
      thumbnailUrl: SAMPLE_IMAGE_POOL[i % SAMPLE_IMAGE_POOL.length],
    });
  }

  cachedHealthRecords = records;
  return records;
}

function getDoctorName(seed: number): string {
  const firsts = ['Ananya', 'Rohan', 'Priya', 'Vaidya Vikram', 'Aarav', 'Meera', 'Kavita', 'Siddharth', 'Aditi', 'Rajesh'];
  const lasts = ['Sharma', 'Verma', 'Gupta', 'Joshi', 'Deshmukh', 'Patel', 'Iyer', 'Nair', 'Bhat', 'Chatterjee'];
  return `${firsts[seed % firsts.length]} ${lasts[seed % lasts.length]}`;
}
