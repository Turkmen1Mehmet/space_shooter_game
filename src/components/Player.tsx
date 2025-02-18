import React from 'react';
import { View, StyleSheet } from 'react-native';
import Matter from 'matter-js';

interface PlayerProps {
  body: Matter.Body;
  size: {
    width: number;
    height: number;
  };
}

const Player: React.FC<PlayerProps> = (props) => {
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
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  body: {
    width: 20,
    height: 40,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  wing: {
    position: 'absolute',
    width: 20,
    height: 15,
    backgroundColor: '#2980b9',
    top: 20,
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
    width: 15,
    height: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    top: 5,
  },
});

export default Player;

export const createPlayer = (world: Matter.World, pos: { x: number; y: number }, size: { width: number; height: number }) => {
  const initialPlayer = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label: 'player',
      frictionAir: 0,
      isStatic: true, // Oyuncuyu sabit pozisyonda tut
    }
  );

  Matter.World.add(world, [initialPlayer]);

  return {
    body: initialPlayer,
    size: size,
    renderer: Player,
  };
}; 