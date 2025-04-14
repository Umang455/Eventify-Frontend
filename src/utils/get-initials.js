export const getInitials = (name = '') => {
  const names = name.trim().split(' ');
  return names.map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};
