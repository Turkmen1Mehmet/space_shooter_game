import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
const Matter = require('matter-js');

const { width, height } = Dimensions.get('window');

const Game: React.FC = () => {
  const [engine] = useState(Matter.Engine.create({ enableSleeping: false }));
  const [world] = useState(engine.world);

  useEffect(() => {
    Matter.World.add(world, [
      // Sınırlar
      Matter.Bodies.rectangle(width / 2, 0, width, 1, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height, width, 1, { isStatic: true }),
      Matter.Bodies.rectangle(0, height / 2, 1, height, { isStatic: true }),
      Matter.Bodies.rectangle(width, height / 2, 1, height, { isStatic: true })
    ]);

    return () => {
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [engine, world]);

  const Physics = (entities: any, { time }: { time: { delta: number } }) => {
    Matter.Engine.update(engine, time.delta);
    return entities;
  };

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.gameContainer}
        systems={[Physics]}
        entities={{}}
        running={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    flex: 1,
  },
});

export default Game; 