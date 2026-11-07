import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow
} from '@vis.gl/react-google-maps';
import {
  Search,
  Bell,
  ChevronDown,
  Camera,
  ArrowRight,
  Fish,
  Eye,
  Waves,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  BarChart2,
  Star,
  AlertTriangle,
  X,
  Upload,
  PlusCircle,
  Globe,
  Radio,
  Activity,
  Sparkles,
  Compass,
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-react';
import { Observation } from '../data/observations';
import { Species } from '../data/species';
import { SanctuaryLocation } from '../data/mapLocations';
import { TabKey } from './Sidebar';
import { UserProfile } from './LoginView';

interface DashboardViewProps {
  observations: Observation[];
  speciesList: Species[];
  sanctuaries: SanctuaryLocation[];
  onNavigate: (tab: TabKey) => void;
  onSelectSpecies: (sp: Species) => void;
  onAddObservation: (obs: Omit<Observation, 'id' | 'createdAt' | 'verified'>) => void;
  currentUser: UserProfile;
  onTriggerToast?: (msg: string) => void;
}

interface MapMarkerItem {
  id: string;
  name: string;
  category: 'species' | 'habitat' | 'pollution';
  lat: number;
  lng: number;
  location: string;
  status: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  observations,
  speciesList,
  sanctuaries,
  onNavigate,
  onAddObservation,
  currentUser,
  onTriggerToast
}) => {
  const mapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_API_KEY : '') ||
    '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapCategory, setSelectedMapCategory] = useState<'ALL' | 'species' | 'habitat' | 'pollution'>('ALL');
  const [activeMarker, setActiveMarker] = useState<MapMarkerItem | null>(null);

  // Modal to add an observation with picture
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newSpecies, setNewSpecies] = useState(speciesList[0]?.commonName || 'Hawksbill Sea Turtle');
  const [newLocation, setNewLocation] = useState('Andaman Sea Coral Reef');
  const [newCount, setNewCount] = useState(1);
  const [newDepth, setNewDepth] = useState(12);
  const [newTemp, setNewTemp] = useState(25.5);
  const [newNotes, setNewNotes] = useState('');
  const [newPicture, setNewPicture] = useState('');
  const [picturePreview, setPicturePreview] = useState('');

  // Preset sample pictures for quick testing
  const samplePictures = [
    { label: 'Sea Turtle', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Dolphin', url: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Whale Shark', url: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Coral Reef', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewPicture(result);
        setPicturePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes.trim()) return;

    const now = new Date();
    onAddObservation({
      speciesName: newSpecies,
      location: newLocation,
      observerName: currentUser.name,
      observerRole: currentUser.role,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      count: newCount,
      depth: newDepth,
      waterTemp: newTemp,
      behaviorNotes: newNotes.trim(),
      healthStatus: 'Healthy',
      imageUrl: newPicture || undefined
    });

    setIsReportModalOpen(false);
    setNewNotes('');
    setNewPicture('');
    setPicturePreview('');
    if (onTriggerToast) {
      onTriggerToast(`Field observation for ${newSpecies} with photo added successfully!`);
    }
  };

  // Markers mapped across key sanctuaries and wildlife zones matching reference
  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'm-1',
      name: 'Olive Ridley Sea Turtle Sanctuary',
      category: 'species',
      lat: 11.7401,
      lng: 92.6586,
      location: 'Andaman Sea',
      status: 'Protected Species Corridor'
    },
    {
      id: 'm-2',
      name: 'Pristine Coral Barrier Atoll',
      category: 'habitat',
      lat: 10.5667,
      lng: 72.6417,
      location: 'Lakshadweep Archipelago',
      status: 'High Biodiversity Nursery'
    },
    {
      id: 'm-3',
      name: 'Irrawaddy & Bottlenose Dolphin Pod',
      category: 'species',
      lat: 16.5,
      lng: 85.0,
      location: 'Bay of Bengal Basin',
      status: 'Active Feeding Sightings'
    },
    {
      id: 'm-4',
      name: 'Derelict Gear & Netting Cluster',
      category: 'pollution',
      lat: 5.9,
      lng: 80.5,
      location: 'South Sri Lanka Shipping Lane',
      status: 'Cleanup Patrol Dispatched'
    },
    {
      id: 'm-5',
      name: 'Whale Shark Aggregation Zone',
      category: 'species',
      lat: -0.7893,
      lng: 130.5612,
      location: 'Raja Ampat Strait',
      status: 'Population Increasing'
    },
    {
      id: 'm-6',
      name: 'Abyssal Trench Ecological Biosphere',
      category: 'habitat',
      lat: 11.3493,
      lng: 142.1996,
      location: 'Western Pacific Margin',
      status: 'Deep Hadal Sanctuary'
    },
    {
      id: 'm-7',
      name: 'Thermal Stress & Bleaching Risk Alert',
      category: 'pollution',
      lat: -18.2871,
      lng: 147.6992,
      location: 'Northern Great Barrier Reef',
      status: 'Thermal Warning Active'
    },
    {
      id: 'm-8',
      name: 'Mangrove Estuarine Forest Reserve',
      category: 'habitat',
      lat: 21.9497,
      lng: 89.1833,
      location: 'Sundarbans Biosphere',
      status: 'Critical Coastal Buffer'
    }
  ];

  const filteredMarkers = mapMarkers.filter(
    (m) => selectedMapCategory === 'ALL' || m.category === selectedMapCategory
  );

  // Reference screenshot default recent observation cards
  const defaultRecentItems = [
    {
      id: 'rec-1',
      title: 'Sea Turtle',
      location: 'Andaman Sea',
      date: 'Nov 7, 2026',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'rec-2',
      title: 'Coral Reef',
      location: 'Lakshadweep',
      date: 'Nov 5, 2026',
      status: 'Pending',
      imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'rec-3',
      title: 'Dolphin',
      location: 'Bay of Bengal',
      date: 'Nov 3, 2026',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // If user adds an observation, show it at the top
  const userAdded = observations.filter(
    (o) => o.id.startsWith('obs-user') || o.imageUrl?.startsWith('data:')
  );
  // Select recent observations (top 4 field records)
  // Select recent observations (top 4 field records with rich metadata)
  const displayObservations = observations.slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 w-full max-w-7xl mx-auto text-[#06283D]">
      {/* ========================================================
          1. TOP APP BAR (COMPACT & CLEAN SAAS HEADER)
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8E6ED]">
        {/* Global Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search species, sanctuaries, telemetry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full !h-9 !pl-9 !pr-8 !bg-white !border !border-[#CDE0EA] !rounded-xl text-xs text-[#06283D] placeholder-[#718995] focus:!ring-2 focus:!ring-[#0284C7]/20 focus:!border-[#0284C7] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 !p-1 !bg-transparent !shadow-none"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Status, Actions & User Profile */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Real-time Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Patrol: Active</span>
          </div>

          {/* Quick Report Button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="!bg-gradient-to-r !from-[#0E8388] !to-[#14B8A6] hover:!from-[#0b6f73] hover:!to-[#0f9485] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-teal-500/20 hover:scale-102 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Report Observation</span>
          </button>

          {/* Notifications */}
          <div className="relative cursor-pointer p-2 rounded-xl bg-white border border-[#DCE7ED] text-[#334E60] hover:text-[#0284C7] hover:border-[#0284C7] transition-all shadow-2xs">
            <Bell className="w-3.5 h-3.5 text-[#334E60]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#EF4444] text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              2
            </span>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-1.5 py-1 px-2.5 rounded-xl bg-white border border-[#DCE7ED] cursor-pointer select-none hover:border-[#0E8388] transition-all shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#20C9C3] flex items-center justify-center text-white font-extrabold text-[11px] shadow-2xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-[#06283D] block leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-[#0E8388] font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#718995]" />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. WELCOME / HERO BANNER (COMPACT, ELEGANT & BALANCED)
         ======================================================== */}
      <section className="relative overflow-hidden rounded-2xl shadow-sm border border-[#0F4A6A]/20 min-h-[145px] sm:min-h-[160px] flex items-center bg-gradient-to-r from-[#031B2C] via-[#062F4A] to-[#0A4D73]">
        {/* Subtle Underwater Marine Photo Background */}
        <img
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80"
          alt="Underwater marine background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay"
        />

        {/* Luminous Oceanic Radial Lights */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 30%, rgba(32, 201, 195, 0.18) 0%, transparent 60%)'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-8 py-4 sm:py-5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#67E8F9] text-[10px] font-bold mb-2 backdrop-blur-md border border-white/20 shadow-2xs">
            <Compass className="w-3 h-3 text-[#22D3EE]" />
            <span>BlueWatch • Global Marine Sanctuary Patrol</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 leading-tight mb-1">
            <span>Welcome, {currentUser.name}!</span>
            <span className="text-xl animate-bounce">🌊</span>
          </h1>

          <p className="text-xs sm:text-[13px] text-[#E0F2FE] font-normal leading-relaxed mb-3.5 max-w-lg">
            Discover marine life, record high-precision observations with verified photos, and protect oceanic ecosystems across 8 sanctuaries.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="!bg-gradient-to-r !from-[#0E8388] !to-[#14B8A6] hover:!from-[#0b6f73] hover:!to-[#0f9485] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-sm shadow-teal-900/30 hover:scale-102 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Report an Observation (+ Photo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 backdrop-blur-md border border-white/25 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Explore Map</span>
            </button>
          </div>
        </div>

        {/* Sea Turtle Graphic on Right */}
        <div className="absolute top-0 right-0 h-full w-[40%] pointer-events-none hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80"
            alt="Sea Turtle swimming over coral"
            className="w-full h-full object-cover object-center"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
            }}
          />
        </div>
      </section>

      {/* ========================================================
          3. FOUR COMPACT STATISTIC CARDS
         ======================================================== */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Species Catalog */}
          <div
            onClick={() => onNavigate('species')}
            className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 group-hover:scale-105 transition-transform">
                <Fish className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Species Catalog</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">120+</div>
              </div>
            </div>
            <svg className="w-8 h-4 text-sky-300 shrink-0" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 10 Q 14 2, 26 10 T 50 10" />
            </svg>
          </div>

          {/* 2. Total Observations */}
          <div
            onClick={() => onNavigate('observations')}
            className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#CCFBF1] flex items-center justify-center text-[#0D9488] shrink-0 group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Total Observations</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {observations.length > 50 ? observations.length : '842'}
                </div>
              </div>
            </div>
            <svg className="w-8 h-4 text-teal-300 shrink-0" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 10 Q 14 2, 26 10 T 50 10" />
            </svg>
          </div>

          {/* 3. Habitat Reports */}
          <div
            onClick={() => onNavigate('habitats')}
            className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shrink-0 group-hover:scale-105 transition-transform">
                <Waves className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Habitat Reports</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">215</div>
              </div>
            </div>
            <svg className="w-8 h-4 text-purple-300 shrink-0" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 10 Q 14 2, 26 10 T 50 10" />
            </svg>
          </div>

          {/* 4. Verified Observations */}
          <div
            onClick={() => onNavigate('observations')}
            className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Verified Sightings</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">621</div>
              </div>
            </div>
            <svg className="w-8 h-4 text-emerald-300 shrink-0" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 10 Q 14 2, 26 10 T 50 10" />
            </svg>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MARINE OBSERVATION MAP & RECENT OBSERVATIONS (SIDE BY SIDE)
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Marine Observation Map (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0284C7]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-0">
                Marine Observation Map
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>View Full Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Map Container */}
          <div className="relative rounded-lg overflow-hidden border border-slate-200 h-[320px] sm:h-[350px] bg-slate-900">
            <APIProvider apiKey={mapsApiKey} libraries={['marker']}>
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: 10.0, lng: 90.0 }}
                defaultZoom={3}
                minZoom={2}
                mapTypeId="satellite"
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                gestureHandling="greedy"
                disableDefaultUI={true}
              >
                {filteredMarkers.map((marker) => (
                  <AdvancedMarker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => setActiveMarker(marker)}
                    title={marker.name}
                  >
                    <div className="relative cursor-pointer hover:scale-125 transition-transform duration-200">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border-2 border-white ring-2 ${
                          marker.category === 'species'
                            ? 'bg-[#0284C7] ring-[#0284C7]/30'
                            : marker.category === 'habitat'
                            ? 'bg-[#EA580C] ring-[#EA580C]/30'
                            : 'bg-[#DC2626] ring-[#DC2626]/30'
                        }`}
                      >
                        {marker.category === 'species' ? (
                          <Fish className="w-3 h-3 text-white" />
                        ) : marker.category === 'habitat' ? (
                          <Waves className="w-3 h-3 text-white" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

                {activeMarker && (
                  <InfoWindow
                    position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                    onCloseClick={() => setActiveMarker(null)}
                  >
                    <div className="p-2.5 max-w-[260px] text-left text-[#06283D]">
                      <div className="font-bold text-xs text-[#0284C7] mb-0.5">
                        {activeMarker.name}
                      </div>
                      <div className="text-[11px] text-[#718995] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0E8388]" />
                        <span>{activeMarker.location}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#06283D] bg-[#F0FAFA] px-2 py-1 rounded border border-[#D5E6E9] mb-2">
                        {activeMarker.status}
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('map')}
                        className="text-[11px] text-[#0284C7] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* Bottom Floating Legend Pills */}
            <div className="absolute bottom-2.5 left-2.5 bg-[#06283D]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2.5 text-[10px] font-bold text-white shadow-md border border-white/20">
              <button
                type="button"
                onClick={() => setSelectedMapCategory(selectedMapCategory === 'species' ? 'ALL' : 'species')}
                className={`flex items-center gap-1 transition-opacity ${selectedMapCategory === 'habitat' || selectedMapCategory === 'pollution' ? 'opacity-50' : 'opacity-100'}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                <span>Species</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMapCategory(selectedMapCategory === 'habitat' ? 'ALL' : 'habitat')}
                className={`flex items-center gap-1 transition-opacity ${selectedMapCategory === 'species' || selectedMapCategory === 'pollution' ? 'opacity-50' : 'opacity-100'}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                <span>Habitats</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMapCategory(selectedMapCategory === 'pollution' ? 'ALL' : 'pollution')}
                className={`flex items-center gap-1 transition-opacity ${selectedMapCategory === 'species' || selectedMapCategory === 'habitat' ? 'opacity-50' : 'opacity-100'}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span>Pollution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Observations (4 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#0E8388]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-0">
                Recent Observations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('observations')}
              className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Clean observation items stacked vertically */}
          <div className="space-y-2.5 flex-1 flex flex-col justify-around">
            {displayObservations.slice(0, 3).map((obs) => {
              const isVerified = obs.verified;
              const photoUrl =
                obs.imageUrl ||
                (obs.speciesName.toLowerCase().includes('turtle')
                  ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'
                  : obs.speciesName.toLowerCase().includes('coral')
                  ? 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=400&q=80'
                  : 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=400&q=80');

              return (
                <div
                  key={obs.id}
                  onClick={() => onNavigate('observations')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 hover:bg-slate-100 border border-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={photoUrl}
                      alt={obs.speciesName}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate mb-0.5">
                        {obs.speciesName}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                        <MapPin className="w-3 h-3 text-[#0E8388] shrink-0" />
                        <span className="truncate">{obs.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 shrink-0" />
                        <span>{obs.date}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. MARINE INSIGHTS & MY CONTRIBUTIONS
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Marine Insights (7 or 8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#0284C7]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-0">
                Marine Insights
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
              <span>Last 6 Months</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
            {/* Donut Chart with Breakdown (5 cols) */}
            <div className="sm:col-span-5 flex items-center gap-3">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="4.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="#0284C7"
                    strokeWidth="4.5"
                    strokeDasharray="42.2 100"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="#EA580C"
                    strokeWidth="4.5"
                    strokeDasharray="28.1 100"
                    strokeDashoffset="-42.2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="#DC2626"
                    strokeWidth="4.5"
                    strokeDasharray="17.6 100"
                    strokeDashoffset="-70.3"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-900 leading-none">842</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[11px] flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7] shrink-0" />
                    <span className="text-slate-700 font-medium text-[11px]">Marine Species</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px]">48%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C] shrink-0" />
                    <span className="text-slate-700 font-medium text-[11px]">Coral &amp; Habitat</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px]">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                    <span className="text-slate-700 font-medium text-[11px]">Pollution</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px]">20%</span>
                </div>
              </div>
            </div>

            {/* Line Trend Chart (7 cols) */}
            <div className="sm:col-span-7 pl-0 sm:pl-3 sm:border-l border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 mb-1">Observation Trend</div>
              <div className="relative h-24 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 70">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="25" y1="10" x2="195" y2="10" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="25" y1="35" x2="195" y2="35" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="25" y1="60" x2="195" y2="60" stroke="#F1F5F9" />

                  <text x="18" y="13" fill="#94A3B8" fontSize="8" textAnchor="end">200</text>
                  <text x="18" y="38" fill="#94A3B8" fontSize="8" textAnchor="end">100</text>
                  <text x="18" y="63" fill="#94A3B8" fontSize="8" textAnchor="end">0</text>

                  <path
                    d="M 35 55 L 65 50 L 95 44 L 125 35 L 155 30 L 190 20 L 190 60 L 35 60 Z"
                    fill="url(#trendGradient)"
                  />
                  <path
                    d="M 35 55 L 65 50 L 95 44 L 125 35 L 155 30 L 190 20"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle cx="35" cy="55" r="3" fill="#0284C7" />
                  <circle cx="65" cy="50" r="3" fill="#0284C7" />
                  <circle cx="95" cy="44" r="3" fill="#0284C7" />
                  <circle cx="125" cy="35" r="3" fill="#0284C7" />
                  <circle cx="155" cy="30" r="3" fill="#0284C7" />
                  <circle cx="190" cy="20" r="3.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                <div className="flex justify-between pl-6 pr-1 text-[9px] text-slate-400 font-semibold pt-1">
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: My Contributions (5 or 4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#0284C7]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-0">
                My Contributions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>View My Reports</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3 Metric Columns with centered text and perfect edges */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Total Submitted */}
            <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-1 shadow-2xs">
                <Waves className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">{observations.length}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Submitted</div>
            </div>

            {/* Pending */}
            <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">2</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Pending</div>
            </div>

            {/* Verified */}
            <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">{Math.max(1, observations.length - 2)}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Verified</div>
            </div>
          </div>

          {/* Action Box with centered text and rounded edges */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#031B2C] via-[#062F4A] to-[#0A4D73] text-white flex items-center justify-between gap-2.5 shadow-2xs">
            <div>
              <div className="text-xs font-bold text-white">Log a New Sighting?</div>
              <div className="text-[10px] text-cyan-200">Attach photos &amp; depth telemetry</div>
            </div>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="text-xs font-bold text-white bg-[#0E8388] hover:bg-[#0b6f73] px-3 py-1.5 rounded-lg shrink-0 shadow-2xs transition-all"
            >
              + Sighting
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. MODAL: REPORT AN OBSERVATION WITH PICTURE UPLOAD
         ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#06283D]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-white/20 animate-[appear_0.3s_ease]">
            {/* Modal Header */}
            <div className="p-6 sm:p-7 bg-gradient-to-r from-[#087E8B] to-[#20C9C3] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">
                    Report Field Observation with Picture
                  </h3>
                  <p className="text-xs text-[#B8F3F0] mb-0">
                    Add verified sighting details and photo telemetry
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="text-white hover:opacity-80 !p-1.5 !bg-transparent !shadow-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitObservation} className="p-6 sm:p-8 space-y-6">
              {/* Species Name */}
              <div>
                <label className="block text-xs font-bold text-[#06283D] mb-2 uppercase tracking-wider">
                  Species Observed *
                </label>
                <select
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  className="w-full !p-3.5 !rounded-xl border border-[#D5E6E9] text-sm"
                >
                  {speciesList.map((sp) => (
                    <option key={sp.id} value={sp.commonName}>
                      {sp.commonName} ({sp.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-[#06283D] mb-2 uppercase tracking-wider">
                  Sanctuary / Location *
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Andaman Sea Reef Slope, Hawaii North Coast..."
                  required
                  className="w-full !p-3.5 !rounded-xl border border-[#D5E6E9] text-sm"
                />
              </div>

              {/* Photo Upload Box */}
              <div className="p-5 rounded-2xl bg-[#F0FAFA] border-2 border-dashed border-[#20C9C3]">
                <label className="block text-xs font-bold text-[#087E8B] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>Upload Sighting Picture / Photo</span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-[#718995] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#087E8B] file:text-white hover:file:bg-[#06283D] cursor-pointer"
                />

                <div className="mt-3">
                  <div className="text-[11px] text-[#718995] mb-2">Or choose a preset marine photo:</div>
                  <div className="flex flex-wrap gap-2">
                    {samplePictures.map((pic) => (
                      <button
                        key={pic.label}
                        type="button"
                        onClick={() => {
                          setNewPicture(pic.url);
                          setPicturePreview(pic.url);
                        }}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#D5E6E9] hover:border-[#087E8B] text-[#06283D]"
                      >
                        {pic.label}
                      </button>
                    ))}
                  </div>
                </div>

                {picturePreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={picturePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-[#20C9C3] shadow-md"
                    />
                    <div className="text-xs text-[#06283D]">
                      <span className="font-bold text-emerald-700">✓ Picture Attached!</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPicture('');
                          setPicturePreview('');
                        }}
                        className="block text-[11px] text-red-600 underline mt-1 !p-0 !bg-transparent !shadow-none"
                      >
                        Remove Picture
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Count & Depth */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#06283D] mb-1.5 uppercase tracking-wider">
                    Count Seen
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
                    className="w-full !p-3 !rounded-xl border border-[#D5E6E9] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#06283D] mb-1.5 uppercase tracking-wider">
                    Depth (meters)
                  </label>
                  <input
                    type="number"
                    value={newDepth}
                    onChange={(e) => setNewDepth(parseFloat(e.target.value) || 0)}
                    className="w-full !p-3 !rounded-xl border border-[#D5E6E9] text-sm"
                  />
                </div>
              </div>

              {/* Behavior Notes */}
              <div>
                <label className="block text-xs font-bold text-[#06283D] mb-1.5 uppercase tracking-wider">
                  Field Observations &amp; Animal Behavior *
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Describe swimming, interactions, water clarity, health status..."
                  required
                  className="w-full !p-3.5 !rounded-xl border border-[#D5E6E9] text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5F0F0]">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="btn-secondary !text-xs !py-3 !px-5 !rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="!text-xs !py-3 !px-6 !rounded-xl font-bold flex items-center gap-2 shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Observation with Picture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
