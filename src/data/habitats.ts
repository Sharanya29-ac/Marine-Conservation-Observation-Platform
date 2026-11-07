export interface Habitat {
  id: string;
  name: string;
  depthRange: string;
  temperature: string;
  location: string;
  biodiversityIndex: string;
  threatLevel: 'Critical' | 'High' | 'Moderate';
  primaryThreats: string[];
  keystoneSpecies: string[];
  ecologicalService: string;
  conservationProjects: string;
  imageUrl: string;
  description: string;
}

export const HABITATS: Habitat[] = [
  {
    id: 'hab-1',
    name: 'Tropical Coral Reefs',
    depthRange: '1 - 60 m (Epipelagic)',
    temperature: '23°C - 29°C',
    location: 'Indo-Pacific, Caribbean, Red Sea, Coral Sea',
    biodiversityIndex: '9.8 / 10 (Highest in Oceans)',
    threatLevel: 'Critical',
    primaryThreats: ['Thermal coral bleaching', 'Ocean acidification', 'Destructive blast fishing', 'Nutrient agricultural runoff'],
    keystoneSpecies: ['Staghorn Coral', 'Hawksbill Sea Turtle', 'Parrotfish', 'Crown-of-Thorns Sea Star'],
    ecologicalService: 'Dissipates 97% of oceanic wave energy to protect coastlines from storms and provides food security for 500 million people worldwide.',
    conservationProjects: 'Autonomous reef restoration seeding, heat-tolerant zooxanthellae inoculations, and community MPA enforcement.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    description: 'Often hailed as the rainforests of the sea, coral reefs occupy less than 0.1% of the oceans surface while sustaining over 25% of all marine life.'
  },
  {
    id: 'hab-2',
    name: 'Giant Kelp Forests',
    depthRange: '5 - 35 m (Subtidal Coast)',
    temperature: '10°C - 18°C',
    location: 'Pacific Rim, California, Chile, South Africa, Tasmania',
    biodiversityIndex: '8.9 / 10',
    threatLevel: 'High',
    primaryThreats: ['Marine heatwaves', 'Sea urchin barren eruptions', 'Nutrient poor warm water stratification'],
    keystoneSpecies: ['Sea Otter', 'Giant Kelp (Macrocystis pyrifera)', 'Red Sea Urchin', 'Garibaldi'],
    ecologicalService: 'Sequester carbon up to 20 times faster per acre than terrestrial forests while providing three-dimensional refuge for juvenile fishes.',
    conservationProjects: 'Targeted purple sea urchin removal, floating kelp spore nurseries, and coastal MPA water-quality tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
    description: 'Towering underwater forests with giant kelp growing up to 45 centimeters per day, creating majestic cathedral-like canopies beneath temperate swells.'
  },
  {
    id: 'hab-3',
    name: 'Deep Sea Trenches & Hadal Depths',
    depthRange: '6,000 - 11,000 m (Hadal Zone)',
    temperature: '1°C - 4°C',
    location: 'Mariana Trench, Kermadec, Puerto Rico, Japan Trench',
    biodiversityIndex: '6.4 / 10 (High Endemism)',
    threatLevel: 'Moderate',
    primaryThreats: ['Deep-sea polymetallic nodule mining', 'Persistent microplastic accumulation', 'Bottom sediment plumes'],
    keystoneSpecies: ['Mariana Snailfish', 'Gigantic Amphipods', 'Xenophyophores'],
    ecologicalService: 'The ultimate planetary carbon burial sink and source of novel biochemical enzymes for biomedical research.',
    conservationProjects: 'International Seabed Authority mining moratorium campaigns and autonomous deep-lander acoustic mapping.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    description: 'Vast, lightless abyssal canyons with hydrostatic pressures exceeding 1,000 atmospheres, inhabited by organisms with piezolyte protein stabilization.'
  },
  {
    id: 'hab-4',
    name: 'Mangrove Estuaries & Brackish Lagoons',
    depthRange: '0 - 4 m (Intertidal)',
    temperature: '22°C - 31°C',
    location: 'Sundarbans, Florida Everglades, Brazil, Southeast Asia',
    biodiversityIndex: '8.7 / 10',
    threatLevel: 'High',
    primaryThreats: ['Shrimp aquaculture clearance', 'Coastal real estate development', 'Hydrological damming'],
    keystoneSpecies: ['Red Mangrove', 'Mud Crab', 'Bengal Tiger (Sundarbans)', 'Juvenile Lemon Shark'],
    ecologicalService: 'Blue carbon storage storing up to 4 times more carbon than tropical rainforests, locking away organic matter for millennia in anaerobic soil.',
    conservationProjects: 'Community mangrove reforestation, hydraulic reconnection of salt marsh lagoons, and carbon credit accreditation.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Dense tangles of aerial stilt roots that trap sediment, purify runoff water entering the open sea, and serve as the essential nursery cradle of coastal fisheries.'
  },
  {
    id: 'hab-5',
    name: 'Open Ocean Pelagic Highway',
    depthRange: '0 - 200 m (Epipelagic)',
    temperature: '14°C - 28°C',
    location: 'High Seas Global Oceans (Beyond National Jurisdiction)',
    biodiversityIndex: '7.8 / 10',
    threatLevel: 'Critical',
    primaryThreats: ['Industrial longlining & driftnets', 'Unregulated high-seas transshipment', 'Plastic gyre contamination'],
    keystoneSpecies: ['Blue Whale', 'Oceanic Manta Ray', 'Leatherback Turtle', 'Yellowfin Tuna'],
    ecologicalService: 'Generates more than 50% of Earths oxygen through photosynthetic cyanobacteria (Prochlorococcus) and drives planetary weather systems.',
    conservationProjects: 'High Seas Treaty (BBNJ) implementation, satellite AIS vessel tracking, and dynamic ocean management migratory corridors.',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
    description: 'An immense, boundaryless fluid desert crisscrossed by megafauna superhighways, thermal fronts, and plankton-rich upwelling convergences.'
  },
  {
    id: 'hab-6',
    name: 'Polar Ice Shelf & Cryosphere',
    depthRange: '0 - 1,500 m (Polar Waters)',
    temperature: '-1.8°C - 2°C',
    location: 'Ross Sea, Weddell Sea, Svalbard, Beaufort Sea',
    biodiversityIndex: '7.5 / 10',
    threatLevel: 'Critical',
    primaryThreats: ['Rapid polar ice shelf calving and thinning', 'Ocean warming', 'Expansion of commercial polar shipping corridors'],
    keystoneSpecies: ['Antarctic Krill', 'Orca (Killer Whale)', 'Beluga Whale', 'Emperor Penguin'],
    ecologicalService: 'Drives global thermohaline circulation (ocean conveyor belt) by generating dense, cold, oxygen-saturated Antarctic bottom water.',
    conservationProjects: 'CCAMLR marine protected area expansion, Antarctic krill fishing exclusions around breeding colonies, and cryosphere satellite monitoring.',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    description: 'Extreme sub-zero marine waters where the seasonal freeze and thaw of sea ice orchestrates the greatest seasonal biomass bloom on our planet.'
  }
];
