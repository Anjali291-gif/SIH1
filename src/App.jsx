import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Background3D } from './components/Background3D';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AlertBanner } from './components/AlertBanner';
import { GuidedTourBar } from './components/GuidedTourBar';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { AIAnalysis } from './pages/AIAnalysis';
import { DigitalTwin } from './pages/DigitalTwin';
import { Analytics } from './pages/Analytics';
import { Maintenance } from './pages/Maintenance';
import { Simulation } from './pages/Simulation';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

const MainLayout = () => {
  const { activeTab } = useTelemetry();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <Dashboard />;
      case 'live':
        return <LiveMonitoring />;
      case 'ai':
        return <AIAnalysis />;
      case 'twin':
        return <DigitalTwin />;
      case 'analytics':
        return <Analytics />;
      case 'maintenance':
        return <Maintenance />;
      case 'simulation':
        return <Simulation />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'login':
        return <Login />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-navy-950 text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-navy-950">
      {/* 1st Uploaded Image 3D Transparent Background */}
      <Background3D />

      {/* Main Header Bar */}
      <Header />

      {/* Floating Guided Tour Narration & Progress HUD */}
      <GuidedTourBar />

      {/* App Layout: Sidebar + Dynamic Main View */}
      {activeTab === 'home' || activeTab === 'login' ? (
        <main className="relative z-10 flex-1 p-4 lg:p-8">
          {renderActivePage()}
        </main>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {renderActivePage()}
          </main>
        </div>
      )}

      {/* Floating Real-Time Audio/Visual Alert Popup Banner */}
      <AlertBanner />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <MainLayout />
      </TelemetryProvider>
    </AuthProvider>
  );
}
