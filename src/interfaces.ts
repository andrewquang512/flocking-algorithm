import { Vector3 } from 'three';

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
}

export type VelocityHandle = {
  updateVelocity: (newVelocity: Vector3) => void;
  getVelocity: () => Vector3;
};
