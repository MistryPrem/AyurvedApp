export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  avatarUrl: string;
  hospital: string;
  availableSlots: string[]; // e.g. ["2026-08-06 10:00 AM", "2026-08-06 11:30 AM"]
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
}

export type RecordType = 'Lab Report' | 'Prescription' | 'Consultation' | 'Vaccination' | 'Allergy';

export interface HealthRecord {
  id: string;
  title: string;
  type: RecordType;
  date: string; // ISO string e.g., '2026-05-14'
  doctorName?: string;
  facility: string;
  summary: string;
  tags: string[];
  thumbnailUrl: string;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  slot: string;
  bookingDate: string;
  patientName: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING_OFFLINE' | 'PENDING';
  fee: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
