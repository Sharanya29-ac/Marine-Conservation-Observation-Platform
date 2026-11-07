import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Thermometer,
  Waves,
  MapPin,
  Calendar,
  User,
  Search,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Observation } from '../data/observations';
import { Species } from '../data/species';
import { UserProfile } from './LoginView';

interface ObservationsViewProps {
  observations: Observation[];
  onAddObservation: (obs: Omit<Observation, 'id' | 'createdAt' | 'verified'>) => void;
  onDeleteObservation: (id: string) => void;
  currentUser: UserProfile;
  speciesList: Species[];
  prefilledSpecies?: string;
  onClearPrefilledSpecies?: () => void;
}

export const ObservationsView: React.FC<ObservationsViewProps> = ({
  observations,
  onAddObservation,
  onDeleteObservation,
  currentUser,
  speciesList,
  prefilledSpecies,
  onClearPrefilledSpecies
}) => {
  const [speciesName, setSpeciesName] = useState(prefilledSpecies || '');
  const [location, setLocation] = useState('');
  const [observerName, setObserverName] = useState(currentUser.name);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [count, setCount] = useState<number>(1);
  const [depth, setDepth] = useState<number>(15);
  const [waterTemp, setWaterTemp] = useState<number>(24.5);
  const [healthStatus, setHealthStatus] = useState<Observation['healthStatus']>('Healthy');
  const [behaviorNotes, setBehaviorNotes] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Handle prefilled species update if changed from outside
  React.useEffect(() => {
    if (prefilledSpecies) {
      setSpeciesName(prefilledSpecies);
    }
  }, [prefilledSpecies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speciesName.trim() || !location.trim() || !behaviorNotes.trim()) {
      return;
    }

    onAddObservation({
      speciesName: speciesName.trim(),
      location: location.trim(),
      observerName: observerName.trim() || currentUser.name,
      observerRole: currentUser.role,
      date,
      time,
      count: Number(count) || 1,
      depth: Number(depth) || 0,
      waterTemp: Number(waterTemp) || 20,
      behaviorNotes: behaviorNotes.trim(),
      healthStatus,
      imageUrl: imageUrl.trim() || undefined
    });

    // Reset form
    setSpeciesName('');
    setLocation('');
    setBehaviorNotes('');
    setImageUrl('');
    setImagePreview('');
    setCount(1);
    if (onClearPrefilledSpecies) {
      onClearPrefilledSpecies();
    }
  };

  const filteredObservations = observations.filter((obs) => {
    const matchesFilter = filterSpecies === 'ALL' || obs.speciesName === filterSpecies;
    const matchesSearch =
      obs.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.observerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.behaviorNotes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Species', 'Location', 'Observer', 'Date', 'Time', 'Count', 'Depth(m)', 'WaterTemp(C)', 'HealthStatus', 'Notes'];
    const rows = filteredObservations.map((o) => [
      o.id,
      `"${o.speciesName.replace(/"/g, '""')}"`,
      `"${o.location.replace(/"/g, '""')}"`,
      `"${o.observerName.replace(/"/g, '""')}"`,
      o.date,
      o.time,
      o.count,
      o.depth,
      o.waterTemp,
      o.healthStatus,
      `"${o.behaviorNotes.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bluewatch-observations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E5F0F0]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#06283D] tracking-tight mb-1">
            Marine Field Observations &amp; Telemetry
          </h1>
          <p className="text-xs text-[#718995] leading-relaxed max-w-2xl">
            Log verified offshore wildlife sightings, environmental water metrics, and
            animal behavioral health status into the international marine registry.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCSV}
            className="btn-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5 !rounded-lg"
          >
            <Download className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* 1. OBSERVATION FORM */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-2xs border border-[#E5F0F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E5F0F0] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EAF7F7] flex items-center justify-center text-[#087E8B]">
              <ClipboardList className="w-5 h-5 text-[#087E8B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#06283D] mb-0.5">Record New Field Sighting</h2>
              <p className="text-xs text-[#718995] mb-0">
                Observer: <strong className="text-[#087E8B]">{currentUser.name}</strong> ({currentUser.role})
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-[#EAF7F7] text-[#087E8B] rounded-full border border-[#D5E6E9] self-start sm:self-center">
            Standard Telemetry Format
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Species Observed *
              </label>
              <input
                type="text"
                list="species-options"
                placeholder="e.g. Hawksbill Sea Turtle, Whale Shark..."
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                required
                className="w-full !p-3"
              />
              <datalist id="species-options">
                {speciesList.map((sp) => (
                  <option key={sp.id} value={sp.commonName} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Sanctuary / Geographic Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Raja Ampat - Dampier Strait"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full !p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Observer Name
              </label>
              <input
                type="text"
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                required
                className="w-full !p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Specimen Count
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                required
                className="w-full !p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Sighting Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full !p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Sighting Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full !p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Water Depth (Meters)
              </label>
              <input
                type="number"
                min="0"
                max="11000"
                step="0.5"
                placeholder="e.g. 15"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                required
                className="w-full !p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Water Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 24.5"
                value={waterTemp}
                onChange={(e) => setWaterTemp(parseFloat(e.target.value) || 0)}
                required
                className="w-full !p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
                Key: Condition &amp; Health Status
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as Observation['healthStatus'])}
                className="w-full !p-3"
              >
                <option value="Healthy">Healthy (Normal feeding / cruising)</option>
                <option value="Juvenile Nursery">Juvenile Nursery (Young calves)</option>
                <option value="Vulnerable / Injured">Vulnerable / Injured (Scar / slow)</option>
                <option value="Distressed / Entangled">Distressed / Entangled (Urgent)</option>
              </select>
            </div>
          </div>

          {/* ADD PICTURE TO OBSERVATION (FILE UPLOAD OR URL) */}
          <div className="bg-[#F0FAFA]/80 p-5 rounded-2xl border border-[#D5E6E9]">
            <label className="block text-xs font-bold text-[#06283D] mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#087E8B]" />
              <span>Key: Add Sighting Picture / Photo</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const res = reader.result as string;
                        setImageUrl(res);
                        setImagePreview(res);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-[#718995] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#087E8B] file:text-white hover:file:bg-[#06283D] cursor-pointer"
                />
                <div className="text-[11px] text-[#718995] mt-1.5">
                  Upload an authentic offshore photo from your phone or computer (JPG, PNG, WebP).
                </div>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="url"
                  placeholder="Or paste web photo URL..."
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full !p-2.5 !text-xs !rounded-xl"
                />
              </div>

              {imagePreview && (
                <div className="relative shrink-0">
                  <img
                    src={imagePreview}
                    alt="Observation Preview"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#20C9C3] shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImagePreview('');
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="flex items-center justify-center gap-2 !py-4 !px-8 text-sm font-semibold shadow-md !rounded-xl">
              <Plus className="w-4 h-4" />
              <span>Submit Verified Field Observation</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. OBSERVATION LIST & CONTROLS */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-2xs border border-[#E5F0F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E5F0F0]">
          <div>
            <h2 className="text-lg font-bold text-[#06283D] mb-0.5">
              Field Log Registry ({filteredObservations.length})
            </h2>
            <p className="text-xs text-[#718995] mb-0">
              Complete archive of verified animal sightings, environmental metrics, and observer logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718995]" />
              <input
                type="text"
                placeholder="Search sightings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!py-2 !pl-9 !pr-3 !text-xs !w-52 !rounded-xl border border-[#D5E6E9]"
              />
            </div>

            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="!py-2 !px-3 !text-xs !rounded-xl border border-[#D5E6E9]"
            >
              <option value="ALL">All Logged Species</option>
              {Array.from(new Set(observations.map((o) => o.speciesName))).map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredObservations.length === 0 ? (
          <div className="bg-[#F0FAFA] rounded-2xl p-12 text-center text-[#718995] border border-[#D5E6E9]">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold text-[#06283D] mb-1">No observations found</p>
            <p className="text-xs text-[#718995]">Try adjusting your search query or species filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredObservations.map((obs) => (
              <div
                key={obs.id}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#E5F0F0] hover:border-[#20C9C3] hover:shadow-md transition-all"
              >
                {/* CARD HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F0FAFA]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F7] flex items-center justify-center text-lg shrink-0">
                      🌊
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#06283D] mb-0.5">
                        {obs.speciesName}
                      </h3>
                      <span className="text-xs font-mono text-[#087E8B] bg-[#EAF7F7] px-2 py-0.5 rounded">
                        Key: Record ID → #{obs.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        obs.healthStatus === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : obs.healthStatus === 'Juvenile Nursery'
                          ? 'bg-blue-100 text-blue-800'
                          : obs.healthStatus === 'Vulnerable / Injured'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Key: Status → {obs.healthStatus}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Telemetry</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteObservation(obs.id)}
                      title="Delete record"
                      className="btn-danger !p-2 !rounded-xl ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SIGHTING PHOTO IF UPLOADED OR PROVIDED */}
                {obs.imageUrl && (
                  <div className="relative h-52 sm:h-60 w-full rounded-2xl overflow-hidden mb-5 bg-gray-100 border border-[#D5E6E9] shadow-inner">
                    <img
                      src={obs.imageUrl}
                      alt={obs.speciesName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow">
                      <Camera className="w-3.5 h-3.5 text-[#20C9C3]" />
                      <span>Verified Field Photo</span>
                    </div>
                  </div>
                )}

                {/* DISTINCT KEY-VALUE GRID (CLEAR, SPACIOUS DATA COLUMNS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  <div className="p-3.5 rounded-xl bg-[#F0FAFA]/70 border border-[#D5E6E9]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#718995] mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#087E8B]" />
                      <span>Key: Observed By</span>
                    </div>
                    <div className="text-xs font-bold text-[#06283D] truncate">
                      {obs.observerName}
                    </div>
                    <div className="text-[11px] text-[#718995] truncate">
                      Role: {obs.observerRole}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F0FAFA]/70 border border-[#D5E6E9]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#718995] mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#20C9C3]" />
                      <span>Key: Sanctuary Location</span>
                    </div>
                    <div className="text-xs font-bold text-[#06283D] truncate">
                      {obs.location}
                    </div>
                    <div className="text-[11px] text-[#718995]">
                      Sanctuary Zone
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F0FAFA]/70 border border-[#D5E6E9]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#718995] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#087E8B]" />
                      <span>Key: Date &amp; Time</span>
                    </div>
                    <div className="text-xs font-bold text-[#06283D]">
                      {obs.date}
                    </div>
                    <div className="text-[11px] text-[#718995]">
                      Logged at {obs.time}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F0FAFA]/70 border border-[#D5E6E9]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#718995] mb-1 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                      <span>Key: Environmental Telemetry</span>
                    </div>
                    <div className="text-xs font-bold text-[#06283D]">
                      {obs.depth}m Depth • {obs.waterTemp}°C
                    </div>
                    <div className="text-[11px] text-[#718995]">
                      Specimen Count: <strong>{obs.count}</strong>
                    </div>
                  </div>
                </div>

                {/* OBSERVATION NOTES */}
                <div className="p-4 rounded-xl bg-[#F0FAFA]/40 border border-[#E5F0F0]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#718995] mb-1.5 flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5 text-[#087E8B]" />
                    <span>Key: Behavioral Field Notes</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#183B4E] leading-relaxed mb-0 italic">
                    "{obs.behaviorNotes}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
