import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { createPlayer } from './src/components/Player';
import { Physics, MovePlayer, SpawnEnemies, MoveEnemies, CheckCollisions, MoveBullets } from './src/systems/GameSystems';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [score, setScore] = useState(0);
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  const entities = {
    physics: { engine, world },
    player: createPlayer(world, { x: width / 2, y: height - 100 }, { width: 50, height: 50 }),
  };

  useEffect(() => {
    if (gameEngine) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isGameOver) {
          gameEngine.dispatch({ type: 'keyboard', payload: event });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [gameEngine, isGameOver]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puan: {score}</Text>
      {isGameOver && <Text style={styles.gameOver}>Oyun Bitti!</Text>}
      <GameEngine
        ref={(ref) => { setGameEngine(ref); }}
        style={styles.gameContainer}
        systems={[Physics, MovePlayer, SpawnEnemies, MoveEnemies, MoveBullets, CheckCollisions]}
        entities={entities}
        onEvent={(e: any) => {
          switch (e.type) {
            case 'score':
              setScore(prev => prev + 10);
              break;
            case 'game-over':
              setIsGameOver(true);
              if (gameEngine) {
                gameEngine.stop();
              }
              break;
          }
        }}
      />
      <View style={styles.controls}>
        <Text style={styles.controlText}>← → veya A D tuşları ile hareket et</Text>
        <Text style={styles.controlText}>SPACE tuşu ile ateş et</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    flex: 1,
  },
  score: {
    position: 'absolute',
    top: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#e74c3c',
    zIndex: 2,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
}); 