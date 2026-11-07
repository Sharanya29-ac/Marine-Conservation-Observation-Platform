export interface Observation {
  id: string;
  speciesName: string;
  location: string;
  observerName: string;
  observerRole: string;
  date: string;
  time: string;
  count: number;
  depth: number; // in meters
  waterTemp: number; // in °C
  behaviorNotes: string;
  healthStatus: 'Healthy' | 'Vulnerable / Injured' | 'Distressed / Entangled' | 'Juvenile Nursery';
  verified: boolean;
  createdAt: number;
  imageUrl?: string;
  lat?: number;
  lng?: number;
}

export const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-101',
    speciesName: 'Hawksbill Sea Turtle',
    location: 'Raja Ampat - Dampier Strait Reef Slope',
    observerName: 'Dr. Maya Lin',
    observerRole: 'Lead Marine Biologist',
    date: '2026-11-06',
    time: '09:45',
    count: 2,
    depth: 14,
    waterTemp: 28.5,
    behaviorNotes: 'Adult female grazing on barrel sponge. Shell clear of epibionts, active breathing intervals, no signs of boat strike trauma.',
    healthStatus: 'Healthy',
    verified: true,
    createdAt: Date.now() - 86400000,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    lat: -0.5369,
    lng: 130.5447
  },
  {
    id: 'obs-102',
    speciesName: 'Blue Whale',
    location: 'Monterey Bay - Submarine Canyon Edge (Lat 36.78 N)',
    observerName: 'Carlos Vance',
    observerRole: 'Sanctuary Patrol Officer',
    date: '2026-11-05',
    time: '14:20',
    count: 3,
    depth: 45,
    waterTemp: 13.1,
    behaviorNotes: 'Mother and calf pair alongside solitary adult male. Deep lunge-feeding on high-density krill layer detected on bio-sonar.',
    healthStatus: 'Juvenile Nursery',
    verified: true,
    createdAt: Date.now() - 172800000,
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
    lat: 36.7800,
    lng: -121.9200
  },
  {
    id: 'obs-103',
    speciesName: 'Great Hammerhead Shark',
    location: 'Galápagos - Darwin Island Arch',
    observerName: 'Sora Takahashi',
    observerRole: 'Acoustic Field Researcher',
    date: '2026-11-04',
    time: '11:15',
    count: 12,
    depth: 26,
    waterTemp: 21.4,
    behaviorNotes: 'Thermocline patrol school circling current edge. Transmitter #GH-809 pinged acoustic receiver station Bravo-4.',
    healthStatus: 'Healthy',
    verified: true,
    createdAt: Date.now() - 259200000,
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80',
    lat: 1.6700,
    lng: -91.9900
  },
  {
    id: 'obs-104',
    speciesName: 'Giant Oceanic Manta Ray',
    location: 'Great Barrier Reef - Lady Elliot Island',
    observerName: 'Dr. Maya Lin',
    observerRole: 'Lead Marine Biologist',
    date: '2026-11-03',
    time: '16:05',
    count: 4,
    depth: 18,
    waterTemp: 26.8,
    behaviorNotes: 'Feeding barrel-rolling loop behavior over bommie cleaning station. Retained trailing mono-filament on right pectoral fin (safely cut away).',
    healthStatus: 'Vulnerable / Injured',
    verified: true,
    createdAt: Date.now() - 345600000,
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    lat: -24.1167,
    lng: 152.7167
  },
  {
    id: 'obs-105',
    speciesName: 'Staghorn Coral',
    location: 'Belize Barrier Reef - South Water Caye',
    observerName: 'Carlos Vance',
    observerRole: 'Sanctuary Patrol Officer',
    date: '2026-11-02',
    time: '10:30',
    count: 45,
    depth: 6,
    waterTemp: 28.2,
    behaviorNotes: 'Monitoring of 2024 restoration nursery site. 88% survival rate with new axial corallite branches extending 3.2cm.',
    healthStatus: 'Healthy',
    verified: true,
    createdAt: Date.now() - 432000000,
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    lat: 16.8167,
    lng: -88.0833
  }
];

const STORAGE_KEY = 'bluewatch_observations_v1';

export function getStoredObservations(): Observation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OBSERVATIONS));
      return INITIAL_OBSERVATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_OBSERVATIONS;
  } catch {
    return INITIAL_OBSERVATIONS;
  }
}

export function saveStoredObservations(observations: Observation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
  } catch (e) {
    console.error('Failed to save observations to localStorage', e);
  }
}
