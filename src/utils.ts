// eslint-disable-next-line import/prefer-default-export
export const getRandomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomInList = (list: Array<any>) => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

export const getRandomEnumValue = <T extends Object>(
  anEnum: T,
  excludeKeys: Array<T[keyof T]> = [],
): T[keyof T] => {
  // save enums inside array
  let enumValues = Object.keys(anEnum)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];

  excludeKeys.forEach((excludeKey) => {
    enumValues = enumValues.filter((each) => each !== excludeKey);
  });
  // Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // get the random enum value

  return enumValues[randomIndex];
};
