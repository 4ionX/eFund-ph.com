export const capitalizeFirstLetterOfWords = (inputString: string): string => {
  return inputString
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
