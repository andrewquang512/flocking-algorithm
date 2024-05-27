export const WINDOW_WIDTH = window.innerWidth;
export const WINDOW_HEIGHT = window.innerHeight;
export const Z_INDEX = 1;
export const OBJECT_SIZE = 10;
// export const OBJECT_SIZE = WINDOW_WIDTH / 135;
export const SPEED = 10;
export const BOID_AMOUNT = 1;
export const MAX_X = WINDOW_WIDTH / 2 - OBJECT_SIZE / 2;
export const MIN_X = -MAX_X;
export const MAX_Y = WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2;
export const MIN_Y = -MAX_Y;
export enum SpeedLevel {
  BACK = -1,
  STOP = 0,
  MOVE = 1,
}
