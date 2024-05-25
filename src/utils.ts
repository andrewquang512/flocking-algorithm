// eslint-disable-next-line import/prefer-default-export
export const getRandomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
