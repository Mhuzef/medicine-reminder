import React, { useState } from 'react';
import { Pill, Activity, History, TrendingUp, PlusCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import HealthChecker from './components/HealthChecker';
import HistoryTab from './components/HistoryTab';
import HealthTrends from './components/HealthTrends';
import AddMedication from './components/AddMedication';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import { useDatabase } from './hooks/useDatabase';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const database = useDatabase();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard database={database} />;
      case 'health':
        return <HealthChecker database={database} />;
      case 'history':
        return <HistoryTab database={database} />;
      case 'trends':
        return <HealthTrends database={database} />;
      case 'addMed':
        return <AddMedication database={database} onSuccess={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard database={database} />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="top-nav">
        <h1>Smart Med-Track</h1>
        <div className="badge badge-blue bg-white text-medical-blue">BETA</div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
        <SafetyDisclaimer />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Pill size={24} />
          <span>Schedule</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <Activity size={24} />
          <span>Health</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'addMed' ? 'active' : ''}`}
          onClick={() => setActiveTab('addMed')}
        >
          <PlusCircle size={24} />
          <span>Add</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={24} />
          <span>History</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <TrendingUp size={24} />
          <span>Trends</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
