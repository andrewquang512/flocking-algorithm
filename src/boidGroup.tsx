import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { ReactElement, RefObject, createRef, useRef } from 'react';
import { Color, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
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
import { getRandomColor, getRandomEnumValue, getRandomInRange } from './utils';
import { Position, Velocity, VelocityHandle } from './interfaces';

export default function BoidGroup() {
  const objectRef = useRef<MeshProps>();
  const boidRefs = useRef<Array<RefObject<VelocityHandle>>>([]);

  const generateBoids = () => {
    const boidList: ReactElement<typeof Boid>[] = [
      ...Array(BOID_AMOUNT_PER_GROUP),
    ].map((each) => {
      const positionX = getRandomInRange(MIN_X, MAX_X);
      const positionY = getRandomInRange(MIN_Y, MAX_Y);
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
          color={new Color(getRandomColor())}
          velocity={{ velocityX, velocityY }}
          position={{ positionX, positionY }}
        />
      );
    });
    return boidList;
  };

  /**
   * 	PROCEDURE rule1(boid bJ)

        Vector pcJ

        FOR EACH BOID b
          IF b != bJ THEN
            pcJ = pcJ + b.position
          END IF
        END

        pcJ = pcJ / N-1

        RETURN (pcJ - bJ.position) / 100

      END PROCEDURE
   */
  const cohesionRule = (currnetBoid: Mesh): Position => {
    const positionCenter: Position = {
      positionX: 0,
      positionY: 0,
    };

    if (!objectRef.current) return positionCenter;

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid) => {
      if (eachBoid.uuid === currnetBoid.uuid) return;

      positionCenter.positionX += eachBoid.position.x;
      positionCenter.positionY += eachBoid.position.y;
    });

    positionCenter.positionX /= children.length - 1;
    positionCenter.positionY /= children.length - 1;

    positionCenter.positionX =
      (positionCenter.positionX - currnetBoid.position.x) *
      COHESION_COEFFICIENT;
    positionCenter.positionY =
      (positionCenter.positionY - currnetBoid.position.y) *
      COHESION_COEFFICIENT;

    return positionCenter;
  };

  /**
   * 	PROCEDURE rule2(boid bJ)
        Vector c = 0;

        FOR EACH BOID b
          IF b != bJ THEN
            IF |b.position - bJ.position| < 100 THEN
              c = c - (b.position - bJ.position)
            END IF
          END IF
        END

        RETURN c

      END PROCEDURE
   */
  const separationRule = (currentBoid: Mesh): Position => {
    const positionMove: Position = {
      positionX: 0,
      positionY: 0,
    };

    if (!objectRef.current) return positionMove;

    const children = objectRef.current.children as Array<Mesh>;

    children.forEach((eachBoid) => {
      if (eachBoid.uuid === currentBoid.uuid) return;

      console.log('eachBoid.position', eachBoid.position);
      console.log('currentBoid.position', currentBoid.position);

      const differenceDistanceX = eachBoid.position.x - currentBoid.position.x;
      const differenceDistanceY = eachBoid.position.y - currentBoid.position.y;
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

  /**
   * 	PROCEDURE move_all_boids_to_new_positions()

        Vector v1, v2, v3
        Boid b

        FOR EACH BOID b
          v1 = rule1(b)
          v2 = rule2(b)
          v3 = rule3(b)

          b.velocity = b.velocity + v1 + v2 + v3
          b.position = b.position + b.velocity
        END

      END PROCEDURE
   */
  setInterval(() => {
    console.log('useFrame-BoidGroup');
    if (!objectRef.current) return;

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
      boidRef.current.updateVelocity(cohesionRuleVector);
    });
  }, 100);

  return <mesh ref={objectRef as RefObject<any>}>{generateBoids()}</mesh>;
}
