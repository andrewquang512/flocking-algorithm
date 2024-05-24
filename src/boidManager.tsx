import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { ReactElement, RefObject, useRef } from 'react';
import { Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import {
  BOID_AMOUNT,
  OBJECT_SIZE,
  SPEED,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from './constants';
import Boid from './boidObject';

export default function BoidManager() {
  const generateBoids = () => {
    const boidList: ReactElement<typeof Boid>[] = [...Array(BOID_AMOUNT)].map(
      (each) => {
        return <Boid key={each} />;
      },
    );
    console.log('boidList-length', boidList.length);
    return boidList;
  };
  return <>{generateBoids()}</>;
}
