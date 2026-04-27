import React, { useState } from 'react';
import { differenceInHours, parseISO } from 'date-fns';
import { Check, X, AlertTriangle, Pill } from 'lucide-react';

export default function Dashboard({ database }) {
  const { medications, history, logDose } = database;
  
  const [doubleDoseAlert, setDoubleDoseAlert] = useState(null);
  const [skipReasonModal, setSkipReasonModal] = useState(null); // { medId }
  const [skipReasonText, setSkipReasonText] = useState('');

  // Generate today's schedule based on timeSlots
  const todaysSchedule = [];
  medications.forEach(med => {
    med.timeSlots.forEach(time => {
      todaysSchedule.push({ ...med, scheduledTime: time });
    });
  });
  
  // Sort by time
  todaysSchedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const handleTakeDose = (medId, timeSlot) => {
    // Check Double Dose
    const recentDoses = history.filter(h => h.medId === medId && h.status === 'taken');
    if (recentDoses.length > 0) {
      const lastDoseTime = parseISO(recentDoses[0].timestamp); // history is sorted desc
      const hoursSince = differenceInHours(new Date(), lastDoseTime);
      
      if (hoursSince < 4) {
        setDoubleDoseAlert({ medId, timeSlot, lastDoseTime });
        return;
      }
    }
    
    logDose(medId, 'taken');
    setTimeout(() => window.location.reload(), 500);
  };

  const confirmTakeDose = () => {
    if (doubleDoseAlert) {
      logDose(doubleDoseAlert.medId, 'taken');
      setDoubleDoseAlert(null);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleSkipDose = (medId) => {
    setSkipReasonModal({ medId });
  };

  const submitSkipReason = () => {
    if (skipReasonModal && skipReasonText) {
      logDose(skipReasonModal.medId, 'skipped', skipReasonText);
      setSkipReasonModal(null);
      setSkipReasonText('');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  // Helper to check if a specific time slot was handled today
  // For simplicity, we just check if there's any taken/skipped today for this med.
  // In a robust app, we'd match exact time slots.
  const today = new Date().toISOString().split('T')[0];
  const hasLoggedToday = (medId) => {
    return history.some(h => h.medId === medId && h.date === today);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 flex items-center gap-2">
        <Pill className="text-medical-blue" />
        Today's Schedule
      </h2>

      <div className="timeline">
        {todaysSchedule.map((item, idx) => {
          const logged = hasLoggedToday(item.id);
          const loggedStatus = logged ? history.find(h => h.medId === item.id && h.date === today)?.status : null;
          
          return (
            <div key={`${item.id}-${item.scheduledTime}-${idx}`} className="timeline-item">
              <div className={`timeline-dot ${loggedStatus === 'taken' ? 'completed' : loggedStatus === 'skipped' ? 'missed' : ''}`}></div>
              <div className="card">
                <div className="flex justify-between items-center mb-2">
                  <h3 style={{ margin: 0 }}>{item.name} <span className="text-muted text-sm font-normal">({item.dose})</span></h3>
                  <span className="badge badge-blue">{item.scheduledTime}</span>
                </div>
                <p className="text-sm text-muted mb-4">{item.guidance}</p>
                
                {!logged ? (
                  <div className="flex gap-2">
                    <button className="btn btn-success flex-1" onClick={() => handleTakeDose(item.id, item.scheduledTime)}>
                      <Check size={16} /> Taken
                    </button>
                    <button className="btn btn-danger flex-1" onClick={() => handleSkipDose(item.id)}>
                      <X size={16} /> Skipped
                    </button>
                  </div>
                ) : (
                  <div className={`text-sm font-semibold flex items-center gap-2 ${loggedStatus === 'taken' ? 'text-success-green' : 'text-danger'}`}>
                    {loggedStatus === 'taken' ? <Check size={16} /> : <X size={16} />}
                    {loggedStatus === 'taken' ? 'Logged as Taken' : 'Logged as Skipped'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Double Dose Alert Modal */}
      {doubleDoseAlert && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3 className="flex items-center gap-2 text-danger">
                <AlertTriangle /> Double Dose Warning
              </h3>
            </div>
            <p className="mb-4">
              You logged a dose of this medication less than 4 hours ago. Are you sure you want to log another dose right now?
            </p>
            <div className="flex gap-2">
              <button className="btn btn-outline flex-1" onClick={() => setDoubleDoseAlert(null)}>Cancel</button>
              <button className="btn btn-danger flex-1" onClick={confirmTakeDose}>Log Anyway</button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Reason Modal */}
      {skipReasonModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3>Reason for Skipping</h3>
              <button className="btn-outline" style={{border: 'none', padding: '0.25rem'}} onClick={() => setSkipReasonModal(null)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Why are you skipping this dose?</label>
              <select 
                className="form-control" 
                value={skipReasonText} 
                onChange={(e) => setSkipReasonText(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="Forgot">I forgot</option>
                <option value="Side effects">Experiencing side effects</option>
                <option value="Ran out">Ran out of medication</option>
                <option value="Felt better">Felt better, didn't need it</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button className="btn btn-primary w-100" style={{width: '100%'}} onClick={submitSkipReason} disabled={!skipReasonText}>
              Save Reason
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
