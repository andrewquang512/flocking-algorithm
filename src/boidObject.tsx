import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { RefObject, useRef, useState } from 'react';
import { Mesh, MeshBasicMaterial, RingGeometry, Vector2, Vector3 } from 'three';
import {
  MAX_X,
  MAX_Y,
  MIN_X,
  MIN_Y,
  OBJECT_SIZE,
  SPEED,
  SpeedLevel,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  Z_INDEX,
} from './constants';
import { getRandomEnumValue, getRandomInList } from './utils';

interface Position {
  positionX: number;
  positionY: number;
}
export default function Boid(position: Position) {
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const objectRef = useRef<MeshProps>();
  const { positionX, positionY } = position;
  const [velocity, setVelocity] = useState(() => {
    const velocityX = getRandomEnumValue(SpeedLevel) * SPEED;
    const velocityY =
      getRandomEnumValue(SpeedLevel, !velocityX ? [SpeedLevel.STOP] : []) *
      SPEED;
    return new Vector3(velocityX, velocityY, 0);
  });
  // Animation and collision detection
  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    console.log('WINDOW_WIDTH:', WINDOW_WIDTH);
    console.log('WINDOW_HEIGHT:', WINDOW_HEIGHT);
    console.log('elapsedTime:', elapsedTime);

    if (objectRef.current?.position) {
      const currentPosition = objectRef.current.position as Vector3;
      console.log('angle:', angle);
      //   const direction = new Vector3(1, 1, 0); // Move along the x-axis
      console.log('currentPosition:', currentPosition);

      // Calculate and update the new position
      currentPosition.add(velocity);
      console.log('newPosition:', currentPosition);
      // Check for collisions with view sides
      if (currentPosition.x > MAX_X || currentPosition.x < MIN_X) {
        // Reverse direction if collision with left or right side
        setVelocity(new Vector3(-velocity.x, velocity.y, velocity.z));
      }
      if (currentPosition.y > MAX_Y || currentPosition.y < MIN_Y) {
        // Reverse direction if collision with top or bottom side
        setVelocity(new Vector3(velocity.x, -velocity.y, velocity.z));
      }

      // const newX = Math.sin(angle * SPEED) + currentPosition.x;
      // const newX = isReverseX
      //   ? currentPosition.x - SPEED
      //   : SPEED + currentPosition.x;
      // const newY = isReverseY
      //   ? currentPosition.y - SPEED
      //   : SPEED + currentPosition.y;
      // const newX = elapsedTime * SPEED * (WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2);
      // const newY =
      //   Math.cos(elapsedTime * SPEED) * (WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2);

      // Update object position
      // currentPosition.x = WINDOW_WIDTH / 2 - OBJECT_SIZE / 2;
      // currentPosition.y = WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2;
    }
  });

  return (
    <mesh
      ref={objectRef as RefObject<any>}
      position={[positionX, positionY, -Z_INDEX]}
    >
      <boxGeometry args={[OBJECT_SIZE, OBJECT_SIZE, Z_INDEX]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
}
