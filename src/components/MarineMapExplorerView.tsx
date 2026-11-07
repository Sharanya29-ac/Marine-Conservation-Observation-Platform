import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin
} from '@vis.gl/react-google-maps';
import {
  Compass,
  MapPin,
  Shield,
  Thermometer,
  AlertTriangle,
  Eye,
  Plus,
  Navigation,
  Layers,
  CheckCircle2,
  Anchor,
  Fish,
  Info,
  X,
  Search,
  Sparkles,
  User,
  Calendar,
  Waves
} from 'lucide-react';
import { SANCTUARY_LOCATIONS, SanctuaryLocation } from '../data/mapLocations';
import { Observation } from '../data/observations';
import { Species } from '../data/species';
import { UserProfile } from './LoginView';

interface MarineMapExplorerViewProps {
  onLogObservationForLocation: (locationName: string) => void;
  observations: Observation[];
  speciesList: Species[];
  currentUser: UserProfile;
  onAddObservation: (obs: Omit<Observation, 'id' | 'createdAt' | 'verified'>) => void;
  onTriggerToast: (msg: string) => void;
}

export const MarineMapExplorerView: React.FC<MarineMapExplorerViewProps> = ({
  onLogObservationForLocation,
  observations,
  speciesList,
  currentUser,
  onAddObservation,
  onTriggerToast
}) => {
  const mapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_API_KEY : '') ||
    '';

  // Selected sanctuary or pinned observation for InfoWindow
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryLocation | null>(SANCTUARY_LOCATIONS[0]);
  const [selectedObservationPin, setSelectedObservationPin] = useState<Observation | null>(null);
  
  // Interactive Pinning Mode & Modal
  const [isPinModeActive, setIsPinModeActive] = useState<boolean>(false);
  const [newPinCoords, setNewPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  // New Pin form fields
  const [pinnedSpecies, setPinnedSpecies] = useState<string>(speciesList[0]?.commonName || 'Hawksbill Sea Turtle');
  const [pinnedLocationName, setPinnedLocationName] = useState<string>('');
  const [pinnedCount, setPinnedCount] = useState<number>(1);
  const [pinnedNotes, setPinnedNotes] = useState<string>('');
  const [pinnedDepth, setPinnedDepth] = useState<number>(10);
  const [pinnedTemp, setPinnedTemp] = useState<number>(24.0);
  const [pinnedPicture, setPinnedPicture] = useState<string>('');

  // Map Filter
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'sanctuaries' | 'sightings'>('ALL');
  const [mapType, setMapType] = useState<string>('hybrid'); // hybrid, roadmap, terrain

  // Filtered observations with valid coordinates
  const observationsWithCoords = useMemo(() => {
    return observations.filter((obs) => typeof obs.lat === 'number' && typeof obs.lng === 'number');
  }, [observations]);

  // Handle map click to drop a new pin
  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      setNewPinCoords({ lat, lng });
      setPinnedLocationName(`Coordinates (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`);
      setIsPinModalOpen(true);
      setIsPinModeActive(false);
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinCoords || !pinnedNotes.trim()) return;

    const now = new Date();
    onAddObservation({
      speciesName: pinnedSpecies,
      location: pinnedLocationName.trim() || `Ocean Point (${newPinCoords.lat.toFixed(2)}°, ${newPinCoords.lng.toFixed(2)}°)`,
      observerName: currentUser.name,
      observerRole: currentUser.role,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      count: pinnedCount,
      depth: pinnedDepth,
      waterTemp: pinnedTemp,
      behaviorNotes: pinnedNotes.trim(),
      healthStatus: 'Healthy',
      imageUrl: pinnedPicture || undefined,
      lat: newPinCoords.lat,
      lng: newPinCoords.lng
    });

    setIsPinModalOpen(false);
    setNewPinCoords(null);
    setPinnedNotes('');
    setPinnedPicture('');
    onTriggerToast(`Pinned new sighting for ${pinnedSpecies} on Google Maps!`);
  };

  // Find species details for a sanctuary's watched animals
  const getSpeciesDetails = (name: string): Species | undefined => {
    return speciesList.find((s) => s.commonName.toLowerCase().includes(name.toLowerCase()));
  };

  return (
    <div className="page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1>Google Ocean Map &amp; Animal Species Tracker</h1>
          <p>
            Explore which marine animals and fishes live at any location worldwide, or click
            the map to pin where you spotted an ocean species.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* PIN ANIMAL SIGHTING BUTTON */}
          <button
            type="button"
            onClick={() => setIsPinModeActive(!isPinModeActive)}
            className={`flex items-center gap-2 !py-2.5 !px-4 text-xs font-semibold rounded-xl shadow-md transition-all ${
              isPinModeActive
                ? '!bg-amber-500 !text-white animate-pulse ring-4 ring-amber-200'
                : '!bg-gradient-to-r !from-[#087E8B] !to-[#20C9C3] !text-white hover:opacity-95'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isPinModeActive ? 'Click Map to Drop Pin' : '+ Pin an Animal Sighting'}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PINNING INSTRUCTION BANNER */}
      {isPinModeActive && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl mb-4 text-xs flex items-center justify-between shadow-sm animate-[appear_0.3s_ease]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>
              <strong>Pin Mode Active:</strong> Click anywhere on the ocean or coastline to pin an animal or fish you spotted!
            </span>
          </div>
          <button
            onClick={() => setIsPinModeActive(false)}
            className="text-amber-800 hover:text-amber-950 font-bold text-xs underline !p-0 !bg-transparent !shadow-none"
          >
            Cancel
          </button>
        </div>
      )}

      {/* MAP CONTROLS & FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-white p-3 rounded-xl border border-[#E5F0F0] shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#183B4E] uppercase tracking-wider">
            Display:
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`!px-3 !py-1 !text-xs !rounded-full transition-all ${
              activeFilter === 'ALL'
                ? '!bg-[#087E8B] !text-white'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9]'
            }`}
          >
            All Marine Locations ({SANCTUARY_LOCATIONS.length + observationsWithCoords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('sanctuaries')}
            className={`!px-3 !py-1 !text-xs !rounded-full transition-all ${
              activeFilter === 'sanctuaries'
                ? '!bg-[#087E8B] !text-white'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9]'
            }`}
          >
            Protected Sanctuaries &amp; Habitats ({SANCTUARY_LOCATIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('sightings')}
            className={`!px-3 !py-1 !text-xs !rounded-full transition-all ${
              activeFilter === 'sightings'
                ? '!bg-emerald-600 !text-white'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9]'
            }`}
          >
            Community Animal Sightings ({observationsWithCoords.length})
          </button>
        </div>

        {/* MAP LAYER SELECTOR */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#087E8B]" />
          {(['hybrid', 'roadmap', 'terrain'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMapType(mode)}
              className={`!px-2.5 !py-1 !text-xs !rounded capitalize ${
                mapType === mode ? '!bg-[#087E8B] !text-white' : '!bg-gray-100 !text-[#718995]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* GOOGLE MAP CONTAINER */}
      <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm mb-5 bg-slate-900">
        <APIProvider apiKey={mapsApiKey} libraries={['places', 'marker']}>
          <div style={{ width: '100%', height: '460px', position: 'relative' }}>
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: 10.0, lng: 10.0 }}
              defaultZoom={2}
              minZoom={2}
              mapTypeId={mapType}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
              onClick={handleMapClick}
            >
              {/* SANCTUARY & BIODIVERSITY LOCATIONS */}
              {(activeFilter === 'ALL' || activeFilter === 'sanctuaries') &&
                SANCTUARY_LOCATIONS.map((loc) => (
                  <AdvancedMarker
                    key={loc.id}
                    position={{ lat: loc.lat, lng: loc.lng }}
                    onClick={() => {
                      setSelectedSanctuary(loc);
                      setSelectedObservationPin(null);
                    }}
                    title={`${loc.name} - What lives here?`}
                  >
                    <div className="relative group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-white text-lg flex items-center justify-center shadow-lg border-2 border-[#20C9C3] hover:scale-125 transition-transform duration-200">
                        {loc.icon}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#06283D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none opacity-90">
                        {loc.name.split(' ')[0]}
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* COMMUNITY USER ANIMAL SIGHTINGS */}
              {(activeFilter === 'ALL' || activeFilter === 'sightings') &&
                observationsWithCoords.map((obs) => (
                  <AdvancedMarker
                    key={obs.id}
                    position={{ lat: obs.lat!, lng: obs.lng! }}
                    onClick={() => {
                      setSelectedObservationPin(obs);
                      setSelectedSanctuary(null);
                    }}
                    title={`Sighting: ${obs.speciesName} by ${obs.observerName}`}
                  >
                    <div className="relative group cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-125 transition-transform">
                        <Fish className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none">
                        {obs.speciesName.split(' ')[0]}
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* TEMPORARY PIN WHEN CLICKING MAP */}
              {newPinCoords && (
                <AdvancedMarker position={newPinCoords}>
                  <Pin background="#DC2626" glyphColor="#FFFFFF" borderColor="#FFFFFF" scale={1.2} />
                </AdvancedMarker>
              )}

              {/* INFOWINDOW FOR SANCTUARY: SHOW WHAT ANIMALS LIVE HERE */}
              {selectedSanctuary && (
                <InfoWindow
                  position={{ lat: selectedSanctuary.lat, lng: selectedSanctuary.lng }}
                  onCloseClick={() => setSelectedSanctuary(null)}
                >
                  <div className="p-1 max-w-[300px] text-left text-[#06283D]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xl">{selectedSanctuary.icon}</span>
                      <h4 className="font-bold text-sm text-[#087E8B] leading-tight mb-0">
                        {selectedSanctuary.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-[#718995] mb-2">
                      {selectedSanctuary.region} • <strong>{selectedSanctuary.waterTemp}</strong>
                    </div>

                    <div className="border-t border-b border-[#E5F0F0] py-2 mb-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#06283D] mb-1.5 flex items-center gap-1">
                        <Fish className="w-3.5 h-3.5 text-[#087E8B]" />
                        <span>Animals &amp; Fishes Living Here:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSanctuary.speciesWatched.map((spName, i) => {
                          const details = getSpeciesDetails(spName);
                          return (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                details?.status === 'CR'
                                  ? 'bg-red-100 text-red-800'
                                  : details?.status === 'EN'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-[#EAF7F7] text-[#087E8B]'
                              }`}
                            >
                              {spName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#183B4E] leading-snug mb-2">
                      {selectedSanctuary.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => onLogObservationForLocation(selectedSanctuary.name)}
                      className="w-full !py-1.5 !px-2 !text-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Log Sighting Here</span>
                    </button>
                  </div>
                </InfoWindow>
              )}

              {/* INFOWINDOW FOR COMMUNITY PINNED SIGHTING */}
              {selectedObservationPin && (
                <InfoWindow
                  position={{ lat: selectedObservationPin.lat!, lng: selectedObservationPin.lng! }}
                  onCloseClick={() => setSelectedObservationPin(null)}
                >
                  <div className="p-1 max-w-[280px] text-left text-[#06283D]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-[#087E8B]">
                        {selectedObservationPin.speciesName}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        Count: {selectedObservationPin.count}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#718995] mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#20C9C3]" />
                      <span>{selectedObservationPin.location}</span>
                    </div>

                    <div className="bg-[#F0FAFA] p-2 rounded text-[11px] text-[#183B4E] italic mb-2">
                      "{selectedObservationPin.behaviorNotes}"
                    </div>

                    <div className="text-[10px] text-[#718995] pt-1 border-t border-[#E5F0F0] flex items-center justify-between">
                      <span>Pinned by: <strong>{selectedObservationPin.observerName}</strong></span>
                      <span>{selectedObservationPin.date}</span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>
        </APIProvider>
      </div>

      {/* SELECTED LOCATION DETAILED SPECIES SPOTLIGHT */}
      {selectedSanctuary && (
        <div id="map-location-details" className="!mt-0">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 pb-4 border-b border-[#E5F0F0]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-2xl mr-1">{selectedSanctuary.icon}</span>
                <h2 className="text-xl font-bold text-[#06283D] mb-0">
                  {selectedSanctuary.name}
                </h2>
                <span className="status-badge status-lc">
                  {selectedSanctuary.protectionLevel}
                </span>
                {selectedSanctuary.alertType === 'warning' && (
                  <span className="status-badge status-cr">Thermal Alert</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718995]">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-[#087E8B]" />
                  {selectedSanctuary.region}
                </span>
                <span className="font-mono text-[11px] text-[#06283D] bg-[#F0FAFA] px-2 py-0.5 rounded border border-[#D5E6E9]">
                  Lat: {selectedSanctuary.lat.toFixed(4)}°, Lng: {selectedSanctuary.lng.toFixed(4)}°
                </span>
                <span>Protected Area: <strong>{selectedSanctuary.areaSqKm}</strong></span>
                <span>Water Temp: <strong>{selectedSanctuary.waterTemp}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onLogObservationForLocation(selectedSanctuary.name)}
              className="flex items-center justify-center gap-2 !py-2.5 !px-4 shrink-0 text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Record Sighting at this Location</span>
            </button>
          </div>

          {/* WHAT TYPES OF ANIMALS LIVE AT THIS LOCATION */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#06283D] mb-2 flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#087E8B]" />
              <span>What Types of Animals &amp; Fishes Live Here:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedSanctuary.speciesWatched.map((spName, idx) => {
                const sp = getSpeciesDetails(spName);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#E5F0F0] bg-[#F0FAFA]/60 flex items-center gap-3 hover:border-[#20C9C3] transition-all"
                  >
                    {sp?.imageUrl ? (
                      <img
                        src={sp.imageUrl}
                        alt={spName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#EAF7F7] flex items-center justify-center text-[#087E8B] shrink-0 font-bold">
                        🐟
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#06283D] truncate">{spName}</div>
                      <div className="text-[11px] text-[#718995] truncate">
                        {sp?.scientificName || 'Resident species'}
                      </div>
                      <div className="mt-1">
                        <span className={`status-badge status-${(sp?.status || 'lc').toLowerCase()}`}>
                          {sp?.statusLabel || 'Monitored'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-[#718995] leading-relaxed mb-0">
            {selectedSanctuary.description}
          </p>
        </div>
      )}

      {/* MODAL: PIN A SPECIES SIGHTING AT MAP LOCATION */}
      {isPinModalOpen && newPinCoords && (
        <div className="fixed inset-0 z-50 bg-[#06283D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-white/20 animate-[appear_0.3s_ease] overflow-hidden">
            <div className="bg-gradient-to-r from-[#087E8B] to-[#20C9C3] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white mb-0">
                  Pin an Animal Sighting
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPinModalOpen(false);
                  setNewPinCoords(null);
                }}
                className="text-white hover:opacity-75 !p-1 !bg-transparent !shadow-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="p-6 text-left space-y-4">
              <div className="p-3 bg-[#F0FAFA] rounded-xl border border-[#D5E6E9] text-xs flex items-center justify-between">
                <div>
                  <span className="text-[#718995]">Selected GPS Pin:</span>
                  <div className="font-mono font-bold text-[#06283D]">
                    {newPinCoords.lat.toFixed(4)}° N, {newPinCoords.lng.toFixed(4)}° E
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Map Point Selected
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                  Which Animal or Fish Did You See? *
                </label>
                <select
                  value={pinnedSpecies}
                  onChange={(e) => setPinnedSpecies(e.target.value)}
                  className="w-full"
                  required
                >
                  {speciesList.map((sp) => (
                    <option key={sp.id} value={sp.commonName}>
                      {sp.commonName} ({sp.status}) - {sp.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                  Location / Coastline Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coral Bay Reef, Hawaii North Shore"
                  value={pinnedLocationName}
                  onChange={(e) => setPinnedLocationName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                    How Many Seen?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={pinnedCount}
                    onChange={(e) => setPinnedCount(parseInt(e.target.value) || 1)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                    Depth (meters)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={pinnedDepth}
                    onChange={(e) => setPinnedDepth(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                  Behavior &amp; Observation Details *
                </label>
                <textarea
                  placeholder="Describe what the animal was doing: swimming near surface, feeding, schooling, healthy, or if any netting was nearby..."
                  value={pinnedNotes}
                  onChange={(e) => setPinnedNotes(e.target.value)}
                  required
                  className="w-full min-h-[90px]"
                />
              </div>

              {/* Upload Picture to Map Sighting */}
              <div>
                <label className="block text-xs font-semibold text-[#183B4E] mb-1.5 uppercase tracking-wider">
                  Attach Picture / Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPinnedPicture(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-[#718995] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#087E8B] file:text-white cursor-pointer"
                />
                {pinnedPicture && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={pinnedPicture} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#20C9C3]" />
                    <span className="text-xs text-emerald-700 font-semibold">Photo attached</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5F0F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setNewPinCoords(null);
                  }}
                  className="btn-secondary !text-xs !py-2.5 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="!text-xs !py-2.5 !px-5 flex items-center gap-1.5 shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Drop Pin on Google Maps</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
