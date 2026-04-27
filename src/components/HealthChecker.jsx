import React, { useState } from 'react';
import { Activity, Smile, Zap, MessageSquare } from 'lucide-react';

export default function HealthChecker({ database }) {
  const { healthLogs, addHealthLog } = database;
  
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [symptoms, setSymptoms] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const hasLoggedToday = healthLogs.some(log => log.date === today);

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealthLog(mood, energy, symptoms);
  };

  const renderEmojiScale = (value, setter) => {
    const emojis = ['😫', '🙁', '😐', '🙂', '😁'];
    return (
      <div className="flex justify-between mt-2 mb-4">
        {emojis.map((emoji, index) => {
          const score = index + 1;
          const isSelected = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => setter(score)}
              style={{
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: isSelected ? 1 : 0.4,
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s ease',
                filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none'
              }}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    );
  };

  if (hasLoggedToday) {
    return (
      <div className="card text-center animate-fade-in">
        <div className="flex justify-center mb-4 text-success-green">
          <Activity size={48} />
        </div>
        <h3>Great job!</h3>
        <p className="text-muted">You've already completed your health check-in for today. Check your trends to see your progress.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 flex items-center gap-2">
        <Activity className="text-medical-blue" />
        Daily Health Check
      </h2>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Smile size={18} className="text-medical-blue"/> How is your mood today?
          </label>
          {renderEmojiScale(mood, setMood)}
        </div>

        <div className="form-group border-t pt-4" style={{borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
          <label className="form-label flex items-center gap-2">
            <Zap size={18} className="text-warning-yellow"/> What is your energy level?
          </label>
          {renderEmojiScale(energy, setEnergy)}
        </div>

        <div className="form-group border-t pt-4" style={{borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
          <label className="form-label flex items-center gap-2">
            <MessageSquare size={18} className="text-muted"/> Any physical symptoms?
          </label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="e.g., Headache, nausea, fatigue (Optional)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
          Save Health Log
        </button>
      </form>
    </div>
  );
}
