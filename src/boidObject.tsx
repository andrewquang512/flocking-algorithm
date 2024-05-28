import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
import { BoidProps, Position, Velocity, VelocityHandle } from './interfaces';

function Boid({ position, velocity }: BoidProps, ref: any) {
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const objectRef = useRef<MeshProps>();
  const { positionX, positionY } = position;
  const [vectorVelocity, setVectorVelocity] = useState(() => {
    return new Vector3(velocity.velocityX, velocity.velocityY, 0);
  });

  useImperativeHandle(ref, () => {
    return {
      updateVelocity: (newVelocity: Vector3) => {
        console.log('vectorVelocity', vectorVelocity);
        console.log('newVelocity', newVelocity);
        setVectorVelocity(vectorVelocity.add(newVelocity));
      },
      getVelocity: () => {
        return vectorVelocity;
      },
    };
  });

  useFrame(({ clock, camera }) => {
    console.log('useFrame-Boid');
    if (!objectRef.current) return;

    const currentPosition = objectRef.current.position as Vector3;
    // console.log('angle:', angle);
    // console.log('currentPosition:', currentPosition);

    // Calculate and update the new position
    currentPosition.add(vectorVelocity);
    // console.log('newPosition:', currentPosition);
    // Check for collisions with view sides
    // if (currentPosition.x > MAX_X || currentPosition.x < MIN_X) {
    //   // Reverse direction if collision with left or right side
    //   setVectorVelocity(
    //     new Vector3(-vectorVelocity.x, vectorVelocity.y, vectorVelocity.z),
    //   );
    // }
    // if (currentPosition.y > MAX_Y || currentPosition.y < MIN_Y) {
    //   // Reverse direction if collision with top or bottom side
    //   setVectorVelocity(
    //     new Vector3(vectorVelocity.x, -vectorVelocity.y, vectorVelocity.z),
    //   );
    // }

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

export default forwardRef<VelocityHandle, BoidProps>(Boid);
