// src/theme/nivoTheme.ts
export const dashboardNivoTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: 'var(--text-secondary)',
  },
  axis: {
    domain: {
      line: {
        stroke: 'var(--border-divider)',
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: 'var(--border-divider)',
        strokeWidth: 1,
      },
      text: {
        fill: 'var(--text-secondary)',
      },
    },
    legend: {
      text: {
        fill: 'var(--text-secondary)',
      },
    },
  },
  grid: {
    line: {
      stroke: 'var(--border-subtle)',
      strokeWidth: 1,
      strokeDasharray: '3 6',
    },
  },
  legends: {
    text: {
      fill: 'var(--text-secondary)',
    },
  },
  tooltip: {
    container: {
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      fontSize: 12,
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-lg)',
    },
  },
} as const;