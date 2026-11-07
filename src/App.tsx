/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginView, UserProfile } from './components/LoginView';
import { Sidebar, TabKey } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SpeciesDirectoryView } from './components/SpeciesDirectoryView';
import { ObservationsView } from './components/ObservationsView';
import { HabitatExplorerView } from './components/HabitatExplorerView';
import { MarineMapExplorerView } from './components/MarineMapExplorerView';
import { ReportsView } from './components/ReportsView';
import { Toast } from './components/Toast';
import { INITIAL_SPECIES, Species } from './data/species';
import { SANCTUARY_LOCATIONS } from './data/mapLocations';
import {
  Observation,
  getStoredObservations,
  saveStoredObservations
} from './data/observations';

const USER_STORAGE_KEY = 'bluewatch_user_session';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [observations, setObservations] = useState<Observation[]>(() => getStoredObservations());
  const [speciesList] = useState<Species[]>(INITIAL_SPECIES);
  const [selectedSpeciesModal, setSelectedSpeciesModal] = useState<Species | null>(null);
  const [prefilledSpecies, setPrefilledSpecies] = useState<string>('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'info'>('success');
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${user.name}! Logged in as ${user.role}.`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of Marine Watch sanctuary network.', 'info');
  };

  const handleAddObservation = (newObsData: Omit<Observation, 'id' | 'createdAt' | 'verified'>) => {
    const newObs: Observation = {
      ...newObsData,
      id: `obs-${Date.now().toString().slice(-4)}`,
      verified: true,
      createdAt: Date.now()
    };

    const updated = [newObs, ...observations];
    setObservations(updated);
    saveStoredObservations(updated);
    showToast(`Field observation for ${newObs.speciesName} logged & verified!`, 'success');
  };

  const handleDeleteObservation = (id: string) => {
    const target = observations.find((o) => o.id === id);
    const updated = observations.filter((o) => o.id !== id);
    setObservations(updated);
    saveStoredObservations(updated);
    showToast(`Observation record ${target ? `for ${target.speciesName}` : ''} removed.`, 'warning');
  };

  const handleLogObservationForSpecies = (speciesName: string) => {
    setPrefilledSpecies(speciesName);
    setActiveTab('observations');
    showToast(`Recording field sighting for ${speciesName}`, 'info');
  };

  const handleLogObservationForLocation = (locationName: string) => {
    setActiveTab('observations');
    showToast(`Logging new telemetry record for ${locationName}`, 'info');
  };

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return (
      <>
        <LoginView onLogin={handleLogin} />
        <Toast message={toastMessage} type={toastType} />
      </>
    );
  }

  return (
    <div id="main-website">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        observationsCount={observations.length}
        speciesCount={speciesList.length}
      />

      <main className="content">
        {activeTab === 'dashboard' && (
          <DashboardView
            observations={observations}
            speciesList={speciesList}
            sanctuaries={SANCTUARY_LOCATIONS}
            onNavigate={setActiveTab}
            onSelectSpecies={(sp) => {
              setSelectedSpeciesModal(sp);
              setActiveTab('species');
            }}
            onAddObservation={handleAddObservation}
            currentUser={currentUser}
            onTriggerToast={(msg) => showToast(msg, 'success')}
          />
        )}

        {activeTab === 'species' && (
          <SpeciesDirectoryView
            speciesList={speciesList}
            onLogObservationForSpecies={handleLogObservationForSpecies}
            selectedSpeciesModal={selectedSpeciesModal}
            setSelectedSpeciesModal={setSelectedSpeciesModal}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationsView
            observations={observations}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            currentUser={currentUser}
            speciesList={speciesList}
            prefilledSpecies={prefilledSpecies}
            onClearPrefilledSpecies={() => setPrefilledSpecies('')}
          />
        )}

        {activeTab === 'habitats' && <HabitatExplorerView />}

        {activeTab === 'map' && (
          <MarineMapExplorerView
            onLogObservationForLocation={handleLogObservationForLocation}
            observations={observations}
            speciesList={speciesList}
            currentUser={currentUser}
            onAddObservation={handleAddObservation}
            onTriggerToast={(msg) => showToast(msg, 'success')}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            observations={observations}
            speciesList={speciesList}
            onTriggerToast={(msg) => showToast(msg, 'success')}
          />
        )}
      </main>

      <Toast message={toastMessage} type={toastType} />
    </div>
  );
}
