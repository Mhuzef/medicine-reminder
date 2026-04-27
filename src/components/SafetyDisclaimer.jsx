import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SafetyDisclaimer() {
  return (
    <div className="glass-panel" style={{ padding: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <ShieldAlert size={16} style={{ color: 'var(--warning-yellow)', flexShrink: 0, marginTop: '2px' }} />
      <p style={{ margin: 0 }}>
        <strong>Disclaimer:</strong> This app is a tracking tool, not a medical device. Consult a doctor for clinical decisions. In case of a medical emergency, call your local emergency services immediately.
      </p>
    </div>
  );
}
