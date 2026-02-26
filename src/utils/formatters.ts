export const formatNumber = (n: number): string =>
  n.toLocaleString('en-US');

export const formatPercent = (n: number): string =>
  `${n.toFixed(1)}%`;
