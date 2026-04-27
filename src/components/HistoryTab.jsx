import React from 'react';
import { History, CheckCircle, XCircle } from 'lucide-react';

export default function HistoryTab({ database }) {
  const { history, medications } = database;

  // Group history by date
  const groupedHistory = history.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => b.localeCompare(a));

  const getMedName = (medId) => {
    const med = medications.find(m => m.id === medId);
    return med ? med.name : 'Unknown Medication';
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 flex items-center gap-2">
        <History className="text-medical-blue" />
        Adherence Log
      </h2>

      {sortedDates.length === 0 ? (
        <div className="card text-center text-muted">
          <p>No history available yet.</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="mb-4">
            <h4 className="text-muted text-sm uppercase tracking-wide mb-2" style={{letterSpacing: '0.05em'}}>
              {formatDate(date)}
            </h4>
            <div className="card" style={{padding: '0.5rem 1rem'}}>
              {groupedHistory[date].map(log => (
                <div key={log.id} className="flex justify-between items-center py-3 border-b last:border-0" style={{borderBottom: '1px solid var(--border-color)'}}>
                  <div className="flex items-center gap-3">
                    {log.status === 'taken' ? (
                      <CheckCircle className="text-success-green" size={20} />
                    ) : (
                      <XCircle className="text-danger" size={20} />
                    )}
                    <div>
                      <h4 style={{margin: 0, fontSize: '1rem'}}>{getMedName(log.medId)}</h4>
                      <p className="text-xs text-muted" style={{margin: 0}}>
                        {log.status === 'taken' ? 'Taken at' : 'Skipped at'} {formatTime(log.timestamp)}
                        {log.reason && ` • Reason: ${log.reason}`}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${log.status === 'taken' ? 'badge-green' : 'badge-red'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
