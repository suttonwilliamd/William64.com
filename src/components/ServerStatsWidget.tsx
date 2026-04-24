import { useState, useEffect } from "react";

export default function ServerStatsWidget() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/server-stats");
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="server-stats-widget" style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: 'monospace',
      }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Loading server stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="server-stats-widget" style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: 'monospace',
      }}>
        <div style={{ color: '#ef4444', fontSize: '14px' }}>Failed to load stats</div>
      </div>
    );
  }

  return (
    <div className="server-stats-widget" style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      padding: '16px',
      fontFamily: 'monospace',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Server Stats
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>UPTIME</div>
          <div style={{ fontSize: '14px', color: '#22c55e' }}>{stats.uptime}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>CPU</div>
          <div style={{ fontSize: '14px' }}>{stats.cpu.cores} cores</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>RAM</div>
          <div style={{ fontSize: '14px' }}>{stats.memory.percent}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>LOAD</div>
          <div style={{ fontSize: '14px' }}>{stats.load_average[0]}</div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>RAM</div>
          <div style={{ fontSize: '12px' }}>{stats.memory.used} / {stats.memory.total}</div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>DISK</div>
          <div style={{ fontSize: '12px' }}>{stats.disk.used} / {stats.disk.total} ({stats.disk.percent})</div>
        </div>
      </div>
    </div>
  );
}