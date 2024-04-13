import React from 'react';
import { Canvas } from '@react-three/fiber';
import Boid from './boid';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants';

function App() {
  return (
    <Canvas
      orthographic
      style={{
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
      }}
      camera={{ zoom: 50, position: [0, 0, 100], near: 0.1, far: 1000 }}
    >
      <Boid />
    </Canvas>
  );
}

export default App;
