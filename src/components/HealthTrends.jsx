import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function HealthTrends({ database }) {
  const { healthLogs } = database;

  // Need at least a few data points to show a meaningful graph
  if (healthLogs.length === 0) {
    return (
      <div className="animate-fade-in">
        <h2 className="mb-4 flex items-center gap-2">
          <TrendingUp className="text-medical-blue" />
          Health Trends
        </h2>
        <div className="card text-center text-muted">
          <p>No health data logged yet. Complete your daily check-in to see trends!</p>
        </div>
      </div>
    );
  }

  // Sort logs oldest to newest for the graph
  const sortedLogs = [...healthLogs].sort((a, b) => a.date.localeCompare(b.date)).slice(-7); // Last 7 days

  const maxScore = 5;
  const graphHeight = 150;
  const graphWidth = 300;
  
  // Map points to SVG coordinates
  const getPoints = (type) => {
    return sortedLogs.map((log, index) => {
      const x = (index / (Math.max(sortedLogs.length - 1, 1))) * graphWidth;
      const val = type === 'mood' ? log.moodScore : log.energyScore;
      const y = graphHeight - ((val / maxScore) * graphHeight);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 flex items-center gap-2">
        <TrendingUp className="text-medical-blue" />
        Health Trends
      </h2>

      <div className="card">
        <h3 className="mb-4 text-center">Last 7 Days</h3>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: `${graphWidth}px`, height: `${graphHeight}px`, margin: '0 auto 2rem auto' }}>
          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: '-20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>5</span>
            <span>3</span>
            <span>1</span>
          </div>

          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid lines */}
            <line x1="0" y1="0" x2={graphWidth} y2="0" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4" />
            <line x1="0" y1={graphHeight/2} x2={graphWidth} y2={graphHeight/2} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4" />
            <line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="var(--border-color)" strokeWidth="1" />

            {/* Lines */}
            {sortedLogs.length > 1 && (
              <>
                <polyline points={getPoints('mood')} fill="none" stroke="var(--medical-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={getPoints('energy')} fill="none" stroke="var(--warning-yellow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}

            {/* Data points */}
            {sortedLogs.map((log, index) => {
              const x = (index / (Math.max(sortedLogs.length - 1, 1))) * graphWidth;
              const yMood = graphHeight - ((log.moodScore / maxScore) * graphHeight);
              const yEnergy = graphHeight - ((log.energyScore / maxScore) * graphHeight);
              
              return (
                <g key={index}>
                  <circle cx={x} cy={yMood} r="4" fill="var(--white)" stroke="var(--medical-blue)" strokeWidth="2" />
                  <circle cx={x} cy={yEnergy} r="4" fill="var(--white)" stroke="var(--warning-yellow)" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
            {sortedLogs.map((log, i) => (
              <span key={i}>{new Date(log.date).getDate()}/{new Date(log.date).getMonth() + 1}</span>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--medical-blue)' }}></div>
            Mood
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning-yellow)' }}></div>
            Energy
          </div>
        </div>
      </div>
    </div>
  );
}
