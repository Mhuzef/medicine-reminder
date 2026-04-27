import React, { useState } from 'react';
import { PlusCircle, Plus, X } from 'lucide-react';

export default function AddMedication({ database, onSuccess }) {
  const { addMedication } = database;
  
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [guidance, setGuidance] = useState('');
  const [timeSlots, setTimeSlots] = useState(['08:00']);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, '12:00']);
  };

  const handleRemoveTimeSlot = (index) => {
    const newSlots = [...timeSlots];
    newSlots.splice(index, 1);
    setTimeSlots(newSlots);
  };

  const handleTimeChange = (index, value) => {
    const newSlots = [...timeSlots];
    newSlots[index] = value;
    setTimeSlots(newSlots);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || timeSlots.length === 0) return;
    
    // Sort timeslots to ensure chronological order on the dashboard
    const sortedTimeSlots = [...timeSlots].sort((a, b) => a.localeCompare(b));
    
    addMedication(name, dose, frequency, guidance, sortedTimeSlots);
    
    // Reset form and potentially navigate back
    setName('');
    setDose('');
    setFrequency('Once daily');
    setGuidance('');
    setTimeSlots(['08:00']);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 flex items-center gap-2">
        <PlusCircle className="text-medical-blue" />
        Add New Medication
      </h2>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Medication Name *</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., Amoxicillin" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Dose (Optional)</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g., 500mg or 2 tablets" 
            value={dose}
            onChange={(e) => setDose(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Frequency</label>
          <select 
            className="form-control" 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">Three times daily</option>
            <option value="As needed">As needed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label flex justify-between items-center">
            <span>Scheduled Times *</span>
            <button type="button" onClick={handleAddTimeSlot} className="text-medical-blue flex items-center gap-1 text-sm font-semibold" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <Plus size={16} /> Add Time
            </button>
          </label>
          
          <div className="flex" style={{flexDirection: 'column', gap: '0.5rem'}}>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="time" 
                  className="form-control" 
                  value={slot}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                />
                {timeSlots.length > 1 && (
                  <button type="button" onClick={() => handleRemoveTimeSlot(index)} className="btn-outline text-danger" style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--danger-red-light)'}}>
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Medical Guidance / Notes (Optional)</label>
          <textarea 
            className="form-control" 
            rows="2" 
            placeholder="e.g., Take with food, avoid dairy..."
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100" style={{width: '100%', marginTop: '1rem'}}>
          Save Medication
        </button>
      </form>
    </div>
  );
}
