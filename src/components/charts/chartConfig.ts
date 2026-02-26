/**
 * Shared Recharts tooltip and cursor style constants.
 * Centralised here to avoid duplication across chart components.
 */
export const TOOLTIP_CONTENT_STYLE = {
  background: '#21262d',
  border: '1px solid #30363d',
  borderRadius: 6,
  color: '#e6edf3',
  fontSize: 12,
} as const;

export const TOOLTIP_CURSOR = { fill: 'rgba(88,166,255,0.08)' } as const;

export const AXIS_TICK_STYLE = { fill: '#8b949e', fontSize: 11 } as const;

export const LEGEND_WRAPPER_STYLE = { fontSize: 12, color: '#8b949e' } as const;
