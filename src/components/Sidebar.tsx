import React from 'react';
import {
  LayoutDashboard,
  Search,
  Camera,
  Star,
  Fish,
  Waves,
  BarChart3,
  Info,
  LogOut,
  MapPin,
  Compass
} from 'lucide-react';
import { UserProfile } from './LoginView';

export type TabKey = 'dashboard' | 'species' | 'observations' | 'habitats' | 'map' | 'reports';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  observationsCount: number;
  speciesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  observationsCount,
  speciesCount
}) => {
  const navItems = [
    {
      key: 'dashboard' as TabKey,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      key: 'map' as TabKey,
      label: 'Marine Observation Map',
      icon: <MapPin className="w-4 h-4 shrink-0" />
    },
    {
      key: 'observations' as TabKey,
      label: 'Recent Observations',
      icon: <Waves className="w-4 h-4 shrink-0" />
    },
    {
      key: 'species' as TabKey,
      label: 'Marine Species',
      icon: <Fish className="w-4 h-4 shrink-0" />
    },
    {
      key: 'habitats' as TabKey,
      label: 'Habitat Explorer',
      icon: <Compass className="w-4 h-4 shrink-0" />
    },
    {
      key: 'reports' as TabKey,
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <aside className="sidebar !bg-[#062436] !w-[220px] flex flex-col justify-between select-none">
      <div>
        {/* LOGO & BRANDING */}
        <div className="flex items-center gap-2.5 mb-6 px-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#087E8B] to-[#20C9C3] flex items-center justify-center text-white shadow-sm shrink-0">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight mb-0 leading-tight">
              BlueWatch
            </h2>
            <div className="text-[9px] text-[#20C9C3] tracking-wide font-medium">
              Global Sanctuary Patrol
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTab(item.key);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0E8388] to-[#14B8A6] text-white shadow-sm shadow-teal-500/20 font-semibold'
                    : 'text-[#9BB7C7] hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>

                {item.key === 'observations' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-[#38BDF8]'}`}>
                    {observationsCount}
                  </span>
                )}

                {item.key === 'species' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-[#67E8F9]'}`}>
                    {speciesCount || 120}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* FOOTER & LOGOUT */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-center mb-2">
          <div className="text-[10px] font-medium text-[#B8F3F0]">
            Healthy Oceans,
          </div>
          <div className="text-[10px] font-semibold text-white flex items-center justify-center gap-1">
            <span>A Healthier Planet</span>
            <span>🌊</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs text-[#9BB7C7] hover:text-white hover:bg-white/10 rounded-lg transition-colors !bg-transparent !shadow-none"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
