export const seconds = (value: number) => value * 1000;
export const minutes = (value: number) => 60 * value * seconds(1);
export const hours = (value: number) => 60 * value * minutes(1);
export const days = (value: number) => 24 * value * hours(1);
export const weeks = (value: number) => 7 * value * days(1);
