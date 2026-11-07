import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Waves,
  Fish,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Observation } from '../data/observations';
import { Species } from '../data/species';
import { SANCTUARY_LOCATIONS } from '../data/mapLocations';

interface ReportsViewProps {
  observations: Observation[];
  speciesList: Species[];
  onTriggerToast: (msg: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  observations,
  speciesList,
  onTriggerToast
}) => {
  const [reportPeriod, setReportPeriod] = useState<'Quarter' | 'Annual' | 'AllTime'>('Quarter');

  // Status distributions
  const statusCounts = {
    CR: speciesList.filter((s) => s.status === 'CR').length,
    EN: speciesList.filter((s) => s.status === 'EN').length,
    VU: speciesList.filter((s) => s.status === 'VU').length,
    NT: speciesList.filter((s) => s.status === 'NT').length,
    LC: speciesList.filter((s) => s.status === 'LC').length
  };

  const threatBreakdown = [
    { name: 'Industrial Overfishing & Bycatch', percent: 36, color: 'bg-red-500' },
    { name: 'Marine Plastic & Derelict Ghost Nets', percent: 26, color: 'bg-amber-500' },
    { name: 'Thermal Bleaching & Ocean Acidification', percent: 22, color: 'bg-orange-500' },
    { name: 'Coastal Habitat Destruction & Runoff', percent: 11, color: 'bg-blue-500' },
    { name: 'Commercial Vessel Strikes & Noise', percent: 5, color: 'bg-teal-500' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = `MARINE WATCH CONSERVATION REPORT
Period: ${reportPeriod} 2026
Generated: ${new Date().toLocaleDateString()}

=========================================
EXECUTIVE SUMMARY
=========================================
Total Tracked Species: ${speciesList.length}
Total Verified Field Observations: ${observations.length}
Protected Marine Sanctuaries: ${SANCTUARY_LOCATIONS.length}
Patrol Cutters Live: 72 Vessels

IUCN STATUS CLASSIFICATION:
- Critically Endangered (CR): ${statusCounts.CR} species
- Endangered (EN): ${statusCounts.EN} species
- Vulnerable (VU): ${statusCounts.VU} species
- Near Threatened (NT): ${statusCounts.NT} species
- Least Concern (LC): ${statusCounts.LC} species

KEY CONSERVATION ACHIEVEMENTS:
- 18,400+ Nautical Miles patrolled across 8 sanctuaries
- 34.8 Metric Tons of ghost nets retrieved from atolls
- 4,200 Staghorn coral fragments outplanted in Caribbean nursery
- 120+ Scalloped hammerhead aggregation recorded in Galapagos

Marine Watch Conservation Network • All Rights Reserved
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bluewatch-executive-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast('Conservation report downloaded successfully');
  };

  return (
    <div className="page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1>Oceanic Conservation Reports &amp; Analytics</h1>
          <p>
            Comprehensive data summaries, threat assessments, species vulnerability metrics,
            and patrol fleet audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Briefing</span>
          </button>
        </div>
      </div>

      {/* TIMEFRAME SELECTOR */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-[#183B4E] uppercase tracking-wider">
          Reporting Window:
        </span>
        {(['Quarter', 'Annual', 'AllTime'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setReportPeriod(period)}
            className={`!px-3 !py-1 !text-xs !rounded-full ${
              reportPeriod === period
                ? '!bg-[#087E8B] !text-white'
                : '!bg-white !text-[#183B4E] !border !border-[#D5E6E9]'
            }`}
          >
            {period === 'Quarter' ? 'Q4 2026' : period === 'Annual' ? 'Fiscal 2026' : 'Cumulative History'}
          </button>
        ))}
      </div>

      {/* REPORT SUMMARY CARD */}
      <div id="report-summary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5F0F0] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F7] flex items-center justify-center text-[#087E8B]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#06283D] mb-0">
                Marine Sanctuary Audit &amp; Population Vitality
              </h2>
              <div className="text-xs text-[#718995]">
                Period: {reportPeriod} 2026 • Verified by International Maritime Scientific Council
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Certified Validated Telemetry</span>
          </span>
        </div>

        {/* 4 CORE AUDIT KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
            <div className="text-xs text-[#718995] mb-1">Nautical Patrol Miles</div>
            <div className="text-2xl font-bold text-[#087E8B]">18,420 nm</div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14% vs previous cycle</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
            <div className="text-xs text-[#718995] mb-1">Ghost Nets Salvaged</div>
            <div className="text-2xl font-bold text-[#087E8B]">34.8 Tons</div>
            <div className="text-[11px] text-emerald-600 mt-1">100% recycled into maritime fiber</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
            <div className="text-xs text-[#718995] mb-1">Staghorn Corals Outplanted</div>
            <div className="text-2xl font-bold text-[#087E8B]">4,250 Frags</div>
            <div className="text-[11px] text-emerald-600 mt-1">88% 6-month survival rate</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F0FAFA] border border-[#D5E6E9]">
            <div className="text-xs text-[#718995] mb-1">Sanctuary Incursions Intercepted</div>
            <div className="text-2xl font-bold text-[#06283D]">19 Vessels</div>
            <div className="text-[11px] text-amber-600 mt-1">Safely escorted outside boundaries</div>
          </div>
        </div>

        {/* IUCN BREAKDOWN & THREAT DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* IUCN STATUS DISTRIBUTION */}
          <div className="p-5 rounded-xl border border-[#E5F0F0] bg-white">
            <h3 className="text-sm font-bold text-[#06283D] mb-3 flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#087E8B]" />
              <span>IUCN Red List Breakdown of Cataloged Species</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-red-600">Critically Endangered (CR)</span>
                  <span className="font-bold text-[#06283D]">{statusCounts.CR} Species ({Math.round((statusCounts.CR / speciesList.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.CR / speciesList.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-orange-600">Endangered (EN)</span>
                  <span className="font-bold text-[#06283D]">{statusCounts.EN} Species ({Math.round((statusCounts.EN / speciesList.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.EN / speciesList.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-600">Vulnerable (VU)</span>
                  <span className="font-bold text-[#06283D]">{statusCounts.VU} Species ({Math.round((statusCounts.VU / speciesList.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.VU / speciesList.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-600">Near Threatened (NT)</span>
                  <span className="font-bold text-[#06283D]">{statusCounts.NT} Species ({Math.round((statusCounts.NT / speciesList.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.NT / speciesList.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-600">Least Concern (LC)</span>
                  <span className="font-bold text-[#06283D]">{statusCounts.LC} Species ({Math.round((statusCounts.LC / speciesList.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.LC / speciesList.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GLOBAL THREAT DISTRIBUTION */}
          <div className="p-5 rounded-xl border border-[#E5F0F0] bg-white">
            <h3 className="text-sm font-bold text-[#06283D] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Anthropogenic Threat Matrix Impact</span>
            </h3>

            <div className="space-y-3">
              {threatBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#183B4E]">{item.name}</span>
                    <span className="font-bold text-[#06283D]">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SANCTUARY HEALTH RATINGS */}
        <div>
          <h3 className="text-sm font-bold text-[#06283D] mb-3 flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#20C9C3]" />
            <span>Active Protected Sanctuary Status Summary</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E5F0F0] rounded-xl overflow-hidden">
              <thead className="bg-[#F0FAFA] text-[#06283D] font-bold">
                <tr>
                  <th className="p-3">Sanctuary Name</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Patrols</th>
                  <th className="p-3">Water Temp</th>
                  <th className="p-3">Coral / Benthos Condition</th>
                  <th className="p-3">Alert Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5F0F0]">
                {SANCTUARY_LOCATIONS.map((sanct) => (
                  <tr key={sanct.id} className="hover:bg-[#F0FAFA]/50 transition-colors">
                    <td className="p-3 font-semibold text-[#087E8B]">
                      {sanct.icon} {sanct.name}
                    </td>
                    <td className="p-3 text-[#718995]">{sanct.protectionLevel}</td>
                    <td className="p-3 font-mono font-bold text-[#06283D]">
                      {sanct.activePatrols} vessels
                    </td>
                    <td className="p-3 text-[#183B4E]">{sanct.waterTemp.split('(')[0]}</td>
                    <td className="p-3 text-[#183B4E]">{sanct.coralHealth}</td>
                    <td className="p-3">
                      <span
                        className={`status-badge ${
                          sanct.alertType === 'warning' ? 'status-cr' : 'status-lc'
                        }`}
                      >
                        {sanct.alertType === 'warning' ? 'Thermal Alert' : 'Nominal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
