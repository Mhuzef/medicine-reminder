import { useState, useEffect } from 'react';

// Initial Mock Data
const INITIAL_MEDICATIONS = [
  {
    id: 'med_1',
    name: 'Amoxicillin',
    dose: '500mg',
    frequency: 'Twice daily',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    guidance: 'Take with food to avoid stomach upset. Finish entire course.',
    timeSlots: ['08:00', '20:00']
  },
  {
    id: 'med_2',
    name: 'Atorvastatin',
    dose: '20mg',
    frequency: 'Once daily',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    guidance: 'Avoid grapefruit juice. Take in the evening.',
    timeSlots: ['21:00']
  }
];

export function useDatabase() {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('smart_med_medications');
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('smart_med_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [healthLogs, setHealthLogs] = useState(() => {
    const saved = localStorage.getItem('smart_med_health_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('smart_med_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('smart_med_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('smart_med_health_logs', JSON.stringify(healthLogs));
  }, [healthLogs]);

  // Actions
  const logDose = (medId, status, reason = '', timestamp = new Date().toISOString()) => {
    const newEntry = {
      id: `hist_${Date.now()}`,
      medId,
      status, // 'taken' | 'skipped'
      reason,
      timestamp,
      date: timestamp.split('T')[0] // YYYY-MM-DD
    };
    
    setHistory(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const addHealthLog = (moodScore, energyScore, symptoms) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a log for today, if so, update it
    const existingIndex = healthLogs.findIndex(log => log.date === today);
    
    const newLog = {
      date: today,
      moodScore,
      energyScore,
      symptoms,
      timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setHealthLogs(prev => {
        const updated = [...prev];
        updated[existingIndex] = newLog;
        return updated;
      });
    } else {
      setHealthLogs(prev => [newLog, ...prev]);
    }
  };

  const addMedication = (name, dose, frequency, guidance, timeSlots) => {
    const newMed = {
      id: `med_${Date.now()}`,
      name,
      dose,
      frequency,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 year for simplicity
      guidance,
      timeSlots
    };
    
    setMedications(prev => [...prev, newMed]);
  };

  return {
    medications,
    history,
    healthLogs,
    logDose,
    addHealthLog,
    addMedication,
    setMedications
  };
}
