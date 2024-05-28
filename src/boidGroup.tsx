import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { ReactElement, RefObject, createRef, useRef } from 'react';
import { Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import {
  BOID_AMOUNT_PER_GROUP,
  COHESION_COEFFICIENT,
  DISTANCE_COEFFICIENT,
  MAX_X,
  MAX_Y,
  MIN_X,
  MIN_Y,
  SPEED,
  SpeedLevel,
  VELOCITY_COEFFICIENT,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from './constants';
import Boid from './boidObject';
import { getRandomEnumValue, getRandomInRange } from './utils';
import { Position, Velocity, VelocityHandle } from './interfaces';

export default function BoidGroup() {
  const objectRef = useRef<MeshProps>();
  const boidRefs = useRef<Array<RefObject<VelocityHandle>>>([]);

  const generateBoids = () => {
    const boidList: ReactElement<typeof Boid>[] = [
      ...Array(BOID_AMOUNT_PER_GROUP),
    ].map((each) => {
      const positionX = getRandomInRange(10, 20);
      const positionY = getRandomInRange(10, 20);
      const velocityX = getRandomEnumValue(SpeedLevel) * SPEED;
      const velocityY =
        getRandomEnumValue(SpeedLevel, !velocityX ? [SpeedLevel.STOP] : []) *
        SPEED;

      const boidRef = createRef<VelocityHandle>();
      boidRefs.current.push(boidRef);
      return (
        <Boid
          key={each}
          ref={boidRef}
          velocity={{ velocityX, velocityY }}
          position={{ positionX, positionY }}
        />
      );
    });
    return boidList;
  };

  const cohesionRule = (boid: Mesh): Position => {
    const positionCenter: Position = {
      positionX: 0,
      positionY: 0,
    };

    if (!objectRef.current) return positionCenter;

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid) => {
      if (eachBoid.uuid === boid.uuid) return;

      positionCenter.positionX += eachBoid.position.x;
      positionCenter.positionY += eachBoid.position.y;
    });

    positionCenter.positionX /= children.length - 1;
    positionCenter.positionY /= children.length - 1;

    positionCenter.positionX =
      (positionCenter.positionX - boid.position.x) * COHESION_COEFFICIENT;
    positionCenter.positionY =
      (positionCenter.positionY - boid.position.y) * COHESION_COEFFICIENT;

    return positionCenter;
  };

  const separationRule = (boid: Mesh): Position => {
    const positionMove: Position = {
      positionX: 0,
      positionY: 0,
    };

    if (!objectRef.current) return positionMove;

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid) => {
      if (eachBoid.uuid === boid.uuid) return;

      const differenceDistanceX = eachBoid.position.x - boid.position.x;
      const differenceDistanceY = eachBoid.position.y - boid.position.y;
      console.log('differenceDistanceX', differenceDistanceX);
      console.log('differenceDistanceY', differenceDistanceY);
      const differenceDistance = Math.abs(
        differenceDistanceX + differenceDistanceY,
      );
      if (differenceDistance < DISTANCE_COEFFICIENT) {
        positionMove.positionX -= differenceDistanceX;
        positionMove.positionY -= differenceDistanceY;
      }
    });

    return positionMove;
  };

  const alignmentRule = (boid: Mesh): Velocity => {
    const velocityMove: Velocity = {
      velocityX: 0,
      velocityY: 0,
    };
    let currentBoidRef: RefObject<VelocityHandle> = createRef();
    if (!objectRef.current) return velocityMove;

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid, index) => {
      if (eachBoid.uuid === boid.uuid) {
        currentBoidRef = boidRefs.current[index] as RefObject<VelocityHandle>;
        return;
      }

      const boidRef = boidRefs.current[index];
      if (!boidRef.current) return;

      const boidRefVelocity = boidRef.current?.getVelocity();
      velocityMove.velocityX += boidRefVelocity.x;
      velocityMove.velocityY += boidRefVelocity.y;
    });

    velocityMove.velocityX /= children.length - 1;
    velocityMove.velocityY /= children.length - 1;

    if (!currentBoidRef.current) return velocityMove;

    const currentBoidRefVelocity = currentBoidRef.current?.getVelocity();
    velocityMove.velocityX =
      (velocityMove.velocityX - currentBoidRefVelocity.x) *
      VELOCITY_COEFFICIENT;
    velocityMove.velocityY =
      (velocityMove.velocityY - currentBoidRefVelocity.y) *
      VELOCITY_COEFFICIENT;

    return velocityMove;
  };

  useFrame(({ clock, camera }) => {
    console.log('useFrame-BoidGroup');
    if (!objectRef.current) return;

    const elapsedTime = clock.getElapsedTime();

    console.log('elapsedTime:', elapsedTime);

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid, index) => {
      const cohesionRuleVelocity = cohesionRule(eachBoid);
      const separationRuleVelocity = separationRule(eachBoid);
      const alignmentRuleVelocity = alignmentRule(eachBoid);

      // Access the Boid component's method through the ref
      console.log('boidRefs:', boidRefs);
      const boidRef = boidRefs.current[index];
      console.log('boidRef:', boidRef);
      if (!boidRef.current) return;

      const cohesionRuleVector = new Vector3(
        cohesionRuleVelocity.positionX,
        cohesionRuleVelocity.positionY,
        0,
      );
      const separationRuleVector = new Vector3(
        separationRuleVelocity.positionX,
        separationRuleVelocity.positionY,
        0,
      );
      const alignmentRuleVector = new Vector3(
        alignmentRuleVelocity.velocityX,
        alignmentRuleVelocity.velocityY,
        0,
      );

      console.log('cohesionRuleVector', cohesionRuleVector);
      console.log('separationRuleVector', separationRuleVector);
      console.log('alignmentRuleVector', alignmentRuleVector);
      boidRef.current.updateVelocity(
        cohesionRuleVector.add(separationRuleVector).add(alignmentRuleVector),
      );
    });
  });

  return <mesh ref={objectRef as RefObject<any>}>{generateBoids()}</mesh>;
}
