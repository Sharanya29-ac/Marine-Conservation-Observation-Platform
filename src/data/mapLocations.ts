export interface SanctuaryLocation {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  lat: number;
  lng: number;
  x: number; // percentage from left
  y: number; // percentage from top
  icon: string;
  areaSqKm: string;
  protectionLevel: 'Fully Protected Marine Reserve' | 'Managed Resource Sanctuary' | 'Biosphere Reserve';
  establishedYear: number;
  waterTemp: string;
  coralHealth: string;
  activePatrols: number;
  speciesWatched: string[];
  recentAlert: string;
  alertType: 'warning' | 'normal' | 'critical';
  description: string;
}

export const SANCTUARY_LOCATIONS: SanctuaryLocation[] = [
  {
    id: 'sanct-1',
    name: 'Great Barrier Reef Marine Park',
    region: 'Coral Sea, Queensland, Australia',
    coordinates: '18.2871° S, 147.6992° E',
    lat: -18.2871,
    lng: 147.6992,
    x: 82,
    y: 68,
    icon: '🐠',
    areaSqKm: '344,400 km²',
    protectionLevel: 'Managed Resource Sanctuary',
    establishedYear: 1975,
    waterTemp: '27.4°C',
    coralHealth: 'Moderate - Severe Northern Bleaching Risk',
    activePatrols: 14,
    speciesWatched: ['Staghorn Coral', 'Hawksbill Sea Turtle', 'Giant Oceanic Manta Ray', 'Dugong', 'Ocellaris Clownfish', 'Regal Blue Tang'],
    recentAlert: 'Level 2 Thermal Bleaching Warning active in Ribbon Reef sector. Solar shading trials initiated.',
    alertType: 'warning',
    description: 'The worlds largest living structure, comprising over 2,900 individual reefs and 900 islands stretching over 2,300 kilometers.'
  },
  {
    id: 'sanct-2',
    name: 'Galápagos Marine Reserve',
    region: 'Equatorial Pacific Ocean, Ecuador',
    coordinates: '0.9538° S, 90.9656° W',
    lat: -0.9538,
    lng: -90.9656,
    x: 24,
    y: 56,
    icon: '🦈',
    areaSqKm: '133,000 km²',
    protectionLevel: 'Fully Protected Marine Reserve',
    establishedYear: 1998,
    waterTemp: '21.8°C',
    coralHealth: 'High Resilience - Upwelling buffer active',
    activePatrols: 8,
    speciesWatched: ['Great Hammerhead Shark', 'Galapagos Marine Iguana', 'Whale Shark', 'Shortfin Mako Shark'],
    recentAlert: 'Record congregation of 120+ scalloped hammerhead sharks logged at Darwin Arch cleaning station.',
    alertType: 'normal',
    description: 'A biological crossroads where three major oceanic currents converge, generating extraordinary endemism and pelagic shark aggregations.'
  },
  {
    id: 'sanct-3',
    name: 'Monterey Bay National Marine Sanctuary',
    region: 'Central California Coast, USA',
    coordinates: '36.8007° N, 121.9473° W',
    lat: 36.8007,
    lng: -121.9473,
    x: 18,
    y: 34,
    icon: '🐋',
    areaSqKm: '15,783 km²',
    protectionLevel: 'Managed Resource Sanctuary',
    establishedYear: 1992,
    waterTemp: '13.2°C',
    coralHealth: 'Temperate Deep Sponge & Kelp Zone',
    activePatrols: 6,
    speciesWatched: ['Blue Whale', 'Sea Otter', 'Great White Shark', 'Ocean Sunfish (Mola Mola)'],
    recentAlert: 'Migratory super-pod of 40+ blue and humpback whales feeding on dense anchovy and krill blooms.',
    alertType: 'normal',
    description: 'Renowned as the Serengeti of the Sea, centered around a submarine canyon twice as deep as the Grand Canyon.'
  },
  {
    id: 'sanct-4',
    name: 'Raja Ampat Marine Protected Area Network',
    region: 'Bird’s Head Seascape, West Papua, Indonesia',
    coordinates: '0.5369° S, 130.5447° E',
    lat: -0.5369,
    lng: 130.5447,
    x: 77,
    y: 53,
    icon: '🌊',
    areaSqKm: '20,000 km²',
    protectionLevel: 'Fully Protected Marine Reserve',
    establishedYear: 2007,
    waterTemp: '28.9°C',
    coralHealth: 'Exceptional - 75% of all known coral species',
    activePatrols: 11,
    speciesWatched: ['Giant Oceanic Manta Ray', 'Ocellaris Clownfish', 'Hawksbill Sea Turtle', 'Mandarinfish', 'Bumphead Parrotfish'],
    recentAlert: 'Community rangers intercepted and escorted an unauthorized foreign longline vessel out of the Dampier Strait.',
    alertType: 'warning',
    description: 'The global epicenter of marine biodiversity, containing over 550 species of scleractinian corals and 1,400 species of reef fish.'
  },
  {
    id: 'sanct-5',
    name: 'Azores Deep Seamount Sanctuary',
    region: 'Mid-Atlantic Ridge, Portugal',
    coordinates: '38.6500° N, 27.2200° W',
    lat: 38.6500,
    lng: -27.2200,
    x: 43,
    y: 33,
    icon: '🐬',
    areaSqKm: '287,000 km²',
    protectionLevel: 'Fully Protected Marine Reserve',
    establishedYear: 2024,
    waterTemp: '17.5°C',
    coralHealth: 'Deep-water Cold Coral Garden Formations',
    activePatrols: 5,
    speciesWatched: ['Blue Whale', 'Broadbill Swordfish', 'Giant Oarfish', 'Atlantic Bluefin Tuna'],
    recentAlert: 'Subsea acoustic telemetry detected continuous sperm whale echolocation clicking along the Condor Seamount crest.',
    alertType: 'normal',
    description: 'The largest protected marine sanctuary in the North Atlantic, shielding hydrothermal vent chimneys and volcanic seamounts.'
  },
  {
    id: 'sanct-6',
    name: 'Belize Barrier Reef Reserve System',
    region: 'Mesoamerican Barrier Reef, Caribbean',
    coordinates: '17.3167° N, 87.5333° W',
    lat: 17.3167,
    lng: -87.5333,
    x: 27,
    y: 45,
    icon: '🪸',
    areaSqKm: '960 km²',
    protectionLevel: 'Biosphere Reserve',
    establishedYear: 1996,
    waterTemp: '28.1°C',
    coralHealth: 'Restoration Active - Staghorn Nursery Recovery',
    activePatrols: 7,
    speciesWatched: ['Staghorn Coral', 'Hawksbill Sea Turtle', 'Atlantic Goliath Grouper', 'Longsnout Seahorse'],
    recentAlert: 'Successful outplanting of 3,500 nursery-grown Staghorn coral fragments into the South Water Caye reef crest.',
    alertType: 'normal',
    description: 'The second largest barrier reef system in the world, famous for the iconic Great Blue Hole and vital mangrove nurseries.'
  },
  {
    id: 'sanct-7',
    name: 'Ross Sea Marine Protected Area',
    region: 'Southern Ocean, Antarctica',
    coordinates: '75.0000° S, 175.0000° W',
    lat: -75.0000,
    lng: 175.0000,
    x: 88,
    y: 89,
    icon: '❄️',
    areaSqKm: '1,550,000 km²',
    protectionLevel: 'Fully Protected Marine Reserve',
    establishedYear: 2017,
    waterTemp: '-1.4°C',
    coralHealth: 'Cryosphere Sponges & Antarctic Benthos',
    activePatrols: 4,
    speciesWatched: ['Antarctic Toothfish', 'Blue Whale', 'Beluga Whale'],
    recentAlert: 'Satellite ice surveillance reports anomalous polynya opening in the eastern Ross shelf; research vessel underway.',
    alertType: 'warning',
    description: 'The worlds largest marine protected area, preserving one of the most pristine and untouched oceanic ecosystems remaining on the globe.'
  },
  {
    id: 'sanct-8',
    name: 'Papahānaumokuākea Marine Monument',
    region: 'Northwestern Hawaiian Islands, Pacific',
    coordinates: '25.7000° N, 171.7333° W',
    lat: 25.7000,
    lng: -171.7333,
    x: 8,
    y: 42,
    icon: '🏝️',
    areaSqKm: '1,510,000 km²',
    protectionLevel: 'Fully Protected Marine Reserve',
    establishedYear: 2006,
    waterTemp: '24.6°C',
    coralHealth: 'High Endemism - Low Human Pressure',
    activePatrols: 9,
    speciesWatched: ['Tiger Shark', 'Whale Shark', 'Indo-Pacific Sailfish', 'Great Hammerhead Shark'],
    recentAlert: 'Specialist salvage team cleared 24 tons of derelict plastic ghost nets from shallow atoll lagoons.',
    alertType: 'normal',
    description: 'A remote chain of coral atolls, shoals, and deep underwater seamounts harboring more than 7,000 rare marine species.'
  }
];
