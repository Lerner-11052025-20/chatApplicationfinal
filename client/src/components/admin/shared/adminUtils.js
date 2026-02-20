export const GRADIENTS = [
  ['#3b82f6', '#6366f1'],
  ['#8b5cf6', '#ec4899'],
  ['#10b981', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#06b6d4', '#3b82f6'],
  ['#6366f1', '#8b5cf6'],
];

export const getGrad = (name) => GRADIENTS[(name?.charCodeAt(0) || 0) % GRADIENTS.length];

export const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch (e) {
    return '';
  }
};

export default {
  GRADIENTS,
  getGrad,
  formatDate,
};
