import React from 'react';
import { View, StyleSheet } from 'react-native';
import Matter from 'matter-js';

interface EnemyProps {
  body: Matter.Body;
  size: {
    width: number;
    height: number;
  };
}

const Enemy: React.FC<EnemyProps> = (props) => {
  const width = props.size.width;
  const height = props.size.height;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      <View style={[styles.wing, styles.leftWing]} />
      <View style={styles.body} />
      <View style={[styles.wing, styles.rightWing]} />
      <View style={styles.cockpit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  body: {
    width: 16,
    height: 30,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  wing: {
    position: 'absolute',
    width: 16,
    height: 12,
    backgroundColor: '#c0392b',
    top: 15,
  },
  leftWing: {
    left: 0,
    transform: [{ skewY: '30deg' }],
  },
  rightWing: {
    right: 0,
    transform: [{ skewY: '-30deg' }],
  },
  cockpit: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    top: 5,
  },
});

export default Enemy;

export const createEnemy = (world: Matter.World, pos: { x: number; y: number }, size: { width: number; height: number }) => {
  const initialEnemy = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label: 'enemy',
      frictionAir: 0,
    }
  );

  Matter.World.add(world, [initialEnemy]);

  return {
    body: initialEnemy,
    size: size,
    renderer: Enemy,
  };
}; 