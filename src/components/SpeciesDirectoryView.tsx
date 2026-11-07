import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldAlert, ArrowUpRight, Plus, X, Globe, Heart, Activity } from 'lucide-react';
import { Species } from '../data/species';

interface SpeciesDirectoryViewProps {
  speciesList: Species[];
  onLogObservationForSpecies: (speciesName: string) => void;
  selectedSpeciesModal: Species | null;
  setSelectedSpeciesModal: (sp: Species | null) => void;
}

export const SpeciesDirectoryView: React.FC<SpeciesDirectoryViewProps> = ({
  speciesList,
  onLogObservationForSpecies,
  selectedSpeciesModal,
  setSelectedSpeciesModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredSpecies = useMemo(() => {
    return speciesList.filter((sp) => {
      const matchesSearch =
        sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.habitat.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || sp.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || sp.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [speciesList, searchQuery, statusFilter, categoryFilter]);

  const categories = [
    { id: 'ALL', label: 'All Marine Species' },
    { id: 'mammals', label: 'Marine Mammals' },
    { id: 'turtles', label: 'Sea Turtles & Reptiles' },
    { id: 'sharks', label: 'Sharks & Rays' },
    { id: 'corals', label: 'Corals & Invertebrates' },
    { id: 'fish', label: 'Pelagic & Reef Fishes' }
  ];

  return (
    <div className="page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1>Marine Species Directory &amp; Ocean Life</h1>
          <p>
            Comprehensive catalog of oceanic fishes, sharks, and marine wildlife. Explore their biological profiles, depth ranges, and current conditions from Least Concern (in good condition) to Critically Endangered.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-[#087E8B] bg-[#EAF7F7] px-3 py-1.5 rounded-full border border-[#D0ECEC]">
            Showing {filteredSpecies.length} of {speciesList.length} Species
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[280px]">
          <input
            id="species-search"
            type="text"
            placeholder="Search by common name, scientific name, or habitat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 !p-1 !bg-transparent !shadow-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All IUCN Red List Statuses</option>
          <option value="CR">Critically Endangered (CR)</option>
          <option value="EN">Endangered (EN)</option>
          <option value="VU">Vulnerable (VU)</option>
          <option value="NT">Near Threatened (NT)</option>
          <option value="LC">Least Concern (LC)</option>
        </select>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`!px-3.5 !py-1.5 !text-xs !rounded-full transition-all ${
              categoryFilter === cat.id
                ? '!bg-[#087E8B] !text-white !shadow-sm'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9] hover:!bg-[#F0FAFA]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* SPECIES GRID */}
      {filteredSpecies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-[var(--shadow)] border border-[#E5F0F0]">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#06283D] mb-1">No Species Found</h3>
          <p className="text-sm text-[#718995] max-w-md mx-auto mb-4">
            No marine species matched your filter criteria. Try clearing filters or searching for terms like "Turtle", "Whale", or "Coral".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setCategoryFilter('ALL');
            }}
            className="btn-secondary text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="species-grid">
          {filteredSpecies.map((species) => (
            <div key={species.id} className="species-card group">
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                <img
                  src={species.imageUrl}
                  alt={species.commonName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className={`status-badge status-${species.status.toLowerCase()} shadow-md`}>
                    {species.status} • {species.statusLabel}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-[#06283D]/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-white font-medium">
                  Depth: {species.depthRange}
                </div>
              </div>

              <h3>{species.commonName}</h3>
              <p className="italic font-serif text-[12px] !text-[#087E8B] !mb-2">
                {species.scientificName}
              </p>

              <p className="line-clamp-2 text-xs text-[#718995] mb-3">
                {species.description}
              </p>

              <div className="mb-4 space-y-1.5 text-xs">
                <p>
                  <strong className="text-[#06283D]">Habitat:</strong> {species.habitat}
                </p>
                <p>
                  <strong className="text-[#06283D]">Population Trend:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      species.populationTrend === 'Decreasing'
                        ? 'text-red-500'
                        : species.populationTrend === 'Increasing'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {species.populationTrend}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#183B4E] uppercase tracking-wider mb-1.5">
                  Primary Threats:
                </div>
                <div className="flex flex-wrap gap-1">
                  {species.threats.slice(0, 2).map((threat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#F0FAFA] text-[#087E8B] border border-[#D5E6E9] px-2 py-0.5 rounded"
                    >
                      {threat}
                    </span>
                  ))}
                  {species.threats.length > 2 && (
                    <span className="text-[10px] text-[#718995] self-center">
                      +{species.threats.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[#E5F0F0] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpeciesModal(species)}
                  className="flex-1 !py-2 !text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onLogObservationForSpecies(species.commonName)}
                  title="Log observation for this species"
                  className="btn-secondary !p-2 !rounded-lg text-[#087E8B] hover:text-[#06283D]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SPECIES DETAIL MODAL */}
      {selectedSpeciesModal && (
        <div className="fixed inset-0 z-50 bg-[#06283D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-[appear_0.3s_ease]">
            <div className="relative h-64 w-full bg-gray-900">
              <img
                src={selectedSpeciesModal.imageUrl}
                alt={selectedSpeciesModal.commonName}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setSelectedSpeciesModal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 !w-9 !h-9 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className={`status-badge status-${selectedSpeciesModal.status.toLowerCase()} mb-2`}>
                  {selectedSpeciesModal.status} • {selectedSpeciesModal.statusLabel}
                </span>
                <h2 className="text-2xl font-bold text-white mb-0 drop-shadow">
                  {selectedSpeciesModal.commonName}
                </h2>
                <p className="text-xs italic text-[#B8F3F0] mb-0 drop-shadow">
                  {selectedSpeciesModal.scientificName}
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-1">
                  Biological Overview
                </h4>
                <p className="text-sm text-[#183B4E] leading-relaxed">
                  {selectedSpeciesModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
                <div>
                  <div className="text-[11px] text-[#718995]">Habitat Zone</div>
                  <div className="text-xs font-bold text-[#06283D] mt-0.5">
                    {selectedSpeciesModal.habitat}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718995]">Depth Range</div>
                  <div className="text-xs font-bold text-[#06283D] mt-0.5">
                    {selectedSpeciesModal.depthRange}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718995]">Population Trend</div>
                  <div className="text-xs font-bold text-red-600 mt-0.5">
                    {selectedSpeciesModal.populationTrend}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-2">
                  Active Conservation Measures
                </h4>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  {selectedSpeciesModal.conservationAction}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-2">
                  Identified Threats
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpeciesModal.threats.map((threat, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium"
                    >
                      • {threat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5F0F0]">
                <button
                  type="button"
                  onClick={() => setSelectedSpeciesModal(null)}
                  className="btn-secondary !text-xs !py-2.5 !px-4"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const spName = selectedSpeciesModal.commonName;
                    setSelectedSpeciesModal(null);
                    onLogObservationForSpecies(spName);
                  }}
                  className="!text-xs !py-2.5 !px-5 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Sighting for this Species</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
