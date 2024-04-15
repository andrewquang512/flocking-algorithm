import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import React, { RefObject, useRef } from 'react';
import { Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { OBJECT_SIZE, SPEED, WINDOW_HEIGHT, WINDOW_WIDTH } from './constants';

// export default function Boid() {
//   const boid = React.useRef<MeshProps>();
//
//   const isCollision = (vector: Vector3) => {
//     console.log(vector);
//   };
//
//   useFrame((frameMetadata) => {
//     console.log(SCENE_WIDTH);
//     console.log(SCENE_HEIGHT);
//     if (boid.current?.position) {
//       // Get the current position
//       console.log(frameMetadata);
//       console.log(boid.current);
//       const currentPosition = boid.current.position as Vector3;
//
//       isCollision(currentPosition);
//       // Define the speed and direction of movement
//       const speed = 0.01; // Adjust as needed
//       const direction = new Vector3(1, 1, 0); // Move along the x-axis
//
//       // Calculate the new position
//       const newPosition = currentPosition.add(direction.multiplyScalar(speed));
//
//       // Update the position
//       currentPosition.copy(newPosition);
//     }
//   });
//
//   return (
//     <mesh ref={boid as RefObject<any>}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshBasicMaterial color="royalblue" />
//     </mesh>
//   );
// }

export default function Boid() {
  const objectRef = useRef<MeshProps>();

  // Animation and collision detection
  useFrame(({ clock, camera }) => {
    console.log('WINDOW_WIDTH:', WINDOW_WIDTH);
    console.log('WINDOW_HEIGHT:', WINDOW_HEIGHT);
    const elapsedTime = clock.getElapsedTime();

    if (objectRef.current?.position) {
      const currentPosition = objectRef.current.position as Vector3;
      const speed = 10; // Adjust as needed
      const direction = new Vector3(1, 1, 0); // Move along the x-axis

      //       // Calculate the new position
      //       const newPosition = currentPosition.add(direction.multiplyScalar(speed));
      //
      //       // Update the position
      //       currentPosition.copy(newPosition);
      //       const newX =
      //         Math.sin(elapsedTime * SPEED) * (WINDOW_WIDTH / 2 - OBJECT_SIZE / 2);
      //       const newY =
      //         Math.cos(elapsedTime * SPEED) * (WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2);
      //
      //       // Check for collisions with view sides
      //       if (
      //         newX < -WINDOW_WIDTH / 2 + OBJECT_SIZE / 2 ||
      //         newX > WINDOW_WIDTH / 2 - OBJECT_SIZE / 2
      //       ) {
      //         // Reverse direction if collision with left or right side
      //         currentPosition.x *= -1;
      //       }
      //       if (
      //         newY < -WINDOW_HEIGHT / 2 + OBJECT_SIZE / 2 ||
      //         newY > WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2
      //       ) {
      //         // Reverse direction if collision with top or bottom side
      //         currentPosition.y *= -1;
      //       }
      //
      //       // Update object position
      //       // currentPosition.x = newX;
      //       // currentPosition.y = newY;
      currentPosition.x = WINDOW_WIDTH / 2 - OBJECT_SIZE / 2;
      currentPosition.y = WINDOW_HEIGHT / 2 - OBJECT_SIZE / 2;
      //       // console.log(newX);
      //       // console.log(newY);
    }
  });

  return (
    <mesh ref={objectRef as RefObject<any>}>
      <boxGeometry args={[OBJECT_SIZE, OBJECT_SIZE, OBJECT_SIZE]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
}
