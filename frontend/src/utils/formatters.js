export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatConfidence(score) {
  if (score === null || score === undefined) return 'N/A';
  return `${Math.round(score * 100)}%`;
}
