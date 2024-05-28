import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { ReactElement, RefObject, useRef } from 'react';
import { Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import {
  BOID_GROUP_AMOUNT,
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
import BoidGroup from './boidGroup';

export default function BoidManager() {
  const generateBoidGroups = () => {
    const boidList: ReactElement<typeof Boid>[] = [
      ...Array(BOID_GROUP_AMOUNT),
    ].map((each) => {
      return <BoidGroup key={each} />;
    });
    return boidList;
  };
  return <>{generateBoidGroups()}</>;
}
