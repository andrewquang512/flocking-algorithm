import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { ReactElement, RefObject, useRef } from 'react';
import { Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import {
  BOID_AMOUNT,
  MAX_X,
  MAX_Y,
  MIN_X,
  MIN_Y,
  SPEED,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from './constants';
import Boid from './boidObject';
import { getRandomInRange } from './utils';

export default function BoidManager() {
  const generateBoids = () => {
    const boidList: ReactElement<typeof Boid>[] = [...Array(BOID_AMOUNT)].map(
      (each) => {
        const positionX = getRandomInRange(MIN_X, MAX_X);
        const positionY = getRandomInRange(MIN_Y, MAX_Y);
        return <Boid key={each} positionX={positionX} positionY={positionY} />;
      },
    );
    console.log('boidList-length', boidList.length);
    return boidList;
  };
  return <>{generateBoids()}</>;
}
