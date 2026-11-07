import React, { useState } from 'react';
import { Waves, Thermometer, ShieldAlert, Globe, ArrowUpRight, X, Sparkles } from 'lucide-react';
import { HABITATS, Habitat } from '../data/habitats';

export const HabitatExplorerView: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<string>('ALL');
  const [activeHabitatModal, setActiveHabitatModal] = useState<Habitat | null>(null);

  const filteredHabitats = HABITATS.filter((h) => {
    if (selectedThreat === 'ALL') return true;
    return h.threatLevel === selectedThreat;
  });

  return (
    <div className="page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1>Oceanic Habitat &amp; Ecosystem Explorer</h1>
          <p>
            Explore diverse marine biomes—from shallow sunlit coral lagoons to abyssal hadal
            trenches. Tracking ecosystem resilience, carbon sequestration, and conservation priority.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#087E8B] bg-[#EAF7F7] px-3 py-1.5 rounded-full border border-[#D0ECEC]">
            6 Essential Oceanic Biomes
          </span>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-semibold text-[#183B4E] uppercase tracking-wider mr-2">
          Threat Level:
        </span>
        {['ALL', 'Critical', 'High', 'Moderate'].map((threat) => (
          <button
            key={threat}
            onClick={() => setSelectedThreat(threat)}
            className={`!px-3.5 !py-1.5 !text-xs !rounded-full transition-all ${
              selectedThreat === threat
                ? '!bg-[#087E8B] !text-white !shadow-sm'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9] hover:!bg-[#F0FAFA]'
            }`}
          >
            {threat === 'ALL' ? 'All Marine Habitats' : `${threat} Priority`}
          </button>
        ))}
      </div>

      {/* HABITAT GRID */}
      <div className="habitat-grid">
        {filteredHabitats.map((hab) => (
          <div key={hab.id} className="habitat-card group">
            <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img
                src={hab.imageUrl}
                alt={hab.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-md ${
                    hab.threatLevel === 'Critical'
                      ? 'bg-red-500 text-white'
                      : hab.threatLevel === 'High'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {hab.threatLevel} Priority
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-[#06283D]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] text-white">
                {hab.depthRange}
              </div>
            </div>

            <h3>{hab.name}</h3>

            <p className="line-clamp-2 text-xs text-[#718995] mb-3">
              {hab.description}
            </p>

            <div className="space-y-1 text-xs mb-3">
              <p>
                <strong>Depth:</strong> {hab.depthRange}
              </p>
              <p>
                <strong>Temp:</strong> {hab.temperature}
              </p>
              <p>
                <strong>Location:</strong> {hab.location}
              </p>
              <p>
                <strong>Biodiversity:</strong> {hab.biodiversityIndex}
              </p>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-semibold text-[#183B4E] uppercase tracking-wider mb-1">
                Keystone Fauna:
              </div>
              <div className="flex flex-wrap gap-1">
                {hab.keystoneSpecies.map((k, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#EAF7F7] text-[#087E8B] font-medium px-2 py-0.5 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[#E5F0F0]">
              <button
                type="button"
                onClick={() => setActiveHabitatModal(hab)}
                className="w-full !py-2 !text-xs flex items-center justify-center gap-1.5"
              >
                <span>Inspect Ecological Status</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* HABITAT DETAIL MODAL */}
      {activeHabitatModal && (
        <div className="fixed inset-0 z-50 bg-[#06283D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-[appear_0.3s_ease]">
            <div className="relative h-60 w-full bg-gray-900">
              <img
                src={activeHabitatModal.imageUrl}
                alt={activeHabitatModal.name}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setActiveHabitatModal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 !w-9 !h-9 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
                    activeHabitatModal.threatLevel === 'Critical'
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {activeHabitatModal.threatLevel} Priority Ecosystem
                </span>
                <h2 className="text-2xl font-bold text-white mb-0 drop-shadow">
                  {activeHabitatModal.name}
                </h2>
                <p className="text-xs text-[#B8F3F0] mb-0 drop-shadow">
                  {activeHabitatModal.location}
                </p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-[#183B4E] leading-relaxed mb-5">
                {activeHabitatModal.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
                <div>
                  <div className="text-[11px] text-[#718995]">Depth Column</div>
                  <div className="text-xs font-bold text-[#06283D] mt-0.5">
                    {activeHabitatModal.depthRange}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718995]">Water Temperature</div>
                  <div className="text-xs font-bold text-[#06283D] mt-0.5">
                    {activeHabitatModal.temperature}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718995]">Biodiversity Index</div>
                  <div className="text-xs font-bold text-[#087E8B] mt-0.5">
                    {activeHabitatModal.biodiversityIndex}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-2">
                  Planetary Ecological Service
                </h4>
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#0B3954] leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
                  <span>{activeHabitatModal.ecologicalService}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-2">
                  Active Conservation Projects
                </h4>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                  {activeHabitatModal.conservationProjects}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-[#718995] tracking-wider mb-2">
                  Critical Vulnerabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeHabitatModal.primaryThreats.map((threat, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200"
                    >
                      • {threat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5F0F0]">
                <button
                  type="button"
                  onClick={() => setActiveHabitatModal(null)}
                  className="btn-secondary !text-xs !py-2 !px-5"
                >
                  Close Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
