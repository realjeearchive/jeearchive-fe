// src/theme/nivoTheme.ts
export const dashboardNivoTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: 'var(--dashboard-secondary-text-color)',
  },
  axis: {
    domain: {
      line: {
        stroke: 'var(--dashboard-dividerline-color)',
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: 'var(--dashboard-dividerline-color)',
        strokeWidth: 1,
      },
      text: {
        fill: 'var(--dashboard-secondary-text-color)',
      },
    },
    legend: {
      text: {
        fill: 'var(--dashboard-secondary-text-color)',
      },
    },
  },
  grid: {
    line: {
      stroke: 'rgba(101, 97, 96, 0.3)',
      strokeWidth: 1,
      strokeDasharray: '3 6',
    },
  },
  legends: {
    text: {
      fill: 'var(--dashboard-secondary-text-color)',
    },
  },
  tooltip: {
    container: {
      background: 'var(--dashboard-sidebar-background-color)',
      color: 'var(--dashboard-primary-text-color)',
      fontSize: 12,
      borderRadius: 8,
      border: '1px solid var(--dashboard-sidebar-border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
    },
  },
} as const;
