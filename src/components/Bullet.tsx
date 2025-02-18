import React from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

interface BulletProps {
  body: Matter.Body;
  size: {
    width: number;
    height: number;
  };
}

const Bullet: React.FC<BulletProps> = ({ body, size }) => {
  const { position } = body;
  
  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - size.width / 2,
        top: position.y - size.height / 2,
        width: size.width,
        height: size.height,
        backgroundColor: '#fff',
        borderRadius: size.width / 2,
      }}
    />
  );
};

export const createBullet = (world: Matter.World, position: { x: number; y: number }) => {
  const size = { width: 8, height: 8 };
  
  const bullet = Matter.Bodies.circle(
    position.x,
    position.y,
    size.width / 2,
    {
      label: 'Bullet',
      isSensor: true,
      friction: 0,
      frictionAir: 0,
      restitution: 0,
    }
  );

  Matter.World.add(world, bullet);

  return {
    body: bullet,
    size,
    renderer: Bullet,
  };
};

export default Bullet; 