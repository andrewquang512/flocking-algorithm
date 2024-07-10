import { Color, Vector3 } from 'three';

export interface Position {
  positionX: number;
  positionY: number;
}

export interface Velocity {
  velocityX: number;
  velocityY: number;
}

export interface BoidProps {
  velocity: Velocity;
  position: Position;
  color: Color;
}

export type VelocityHandle = {
  updateVelocity: (newVelocity: Vector3) => void;
  getVelocity: () => Vector3;
};
