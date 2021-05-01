const commaStringToArray = (s: string): string[] => {
  return s.split(",").map((e) => e.trim());
};

export { commaStringToArray };
