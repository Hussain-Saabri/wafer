export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name: string): string => {
  if (!name) return "";

  const words = name.trim().split(/\s+/); 
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    const word = words[i];
    if (word && word[0]) {
      initials += word[0];
    }
  }

  return initials.toUpperCase();
};
