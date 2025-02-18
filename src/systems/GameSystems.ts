import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import { createEnemy } from '../components/Enemy';
import { createBullet } from '../components/Bullet';

const { width, height } = Dimensions.get('window');

interface GameEntity {
  body: Matter.Body;
  size: {
    width: number;
    height: number;
  };
  renderer?: React.FC<any>;
  type?: string;
  lastShootTime?: number;
  engine?: Matter.Engine;
  world?: Matter.World;
}

interface Entities {
  [key: string]: GameEntity;
}

interface KeyEvent {
  payload: {
    key: string;
  };
}

export const Physics = (entities: Entities, { time }: { time: { delta: number } }) => {
  const { engine } = entities.physics as any;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export const MovePlayer = (entities: Entities, { events = [] }: { events?: { type: string; payload: KeyboardEvent }[] }) => {
  const player = entities.player.body;
  const moveSpeed = 30;

  if (events.length) {
    events.forEach(event => {
      if (event.type === 'keyboard') {
        const key = event.payload.key;
        
        switch(key) {
          case 'ArrowLeft':
          case 'a':
            Matter.Body.setPosition(player, {
              x: Math.max(25, player.position.x - moveSpeed),
              y: player.position.y
            });
            break;
          
          case 'ArrowRight':
          case 'd':
            Matter.Body.setPosition(player, {
              x: Math.min(width - 25, player.position.x + moveSpeed),
              y: player.position.y
            });
            break;
          
          case ' ':
            const currentTime = Date.now();
            if (!entities.physics.lastShootTime || currentTime - entities.physics.lastShootTime > 250) {
              const bulletId = `bullet${currentTime}`;
              entities[bulletId] = createBullet(
                (entities.physics as any).world,
                {
                  x: player.position.x,
                  y: player.position.y - 30
                }
              );
              entities.physics.lastShootTime = currentTime;
            }
            break;
        }
      }
    });
  }

  return entities;
};

export const MoveBullets = (entities: Entities) => {
  Object.keys(entities).forEach((key) => {
    if (key.includes('bullet')) {
      const bullet = entities[key].body;
      Matter.Body.setVelocity(bullet, {
        x: 0,
        y: -10 // Yukarı doğru hareket
      });

      // Ekrandan çıkan mermileri temizle
      if (bullet.position.y < -50) {
        Matter.World.remove((entities.physics as any).world, bullet);
        delete entities[key];
      }
    }
  });
  return entities;
};

export const SpawnEnemies = (entities: Entities) => {
  if (Math.random() < 0.03) {  // Düşman oluşturma oranını artırdım
    const enemyId = `enemy${Date.now()}`;
    entities[enemyId] = createEnemy(
      (entities.physics as any).world,
      {
        x: Math.random() * (width - 50) + 25,
        y: -50,
      },
      { width: 40, height: 40 }
    );
  }
  return entities;
};

export const MoveEnemies = (entities: Entities) => {
  Object.keys(entities).forEach((key) => {
    if (key.includes('enemy')) {
      const enemy = entities[key].body;
      Matter.Body.setVelocity(enemy, {
        x: 0,
        y: 3  // Düşman hızını artırdım
      });

      if (enemy.position.y > height + 50) {
        Matter.World.remove((entities.physics as any).world, enemy);
        delete entities[key];
      }
    }
  });
  return entities;
};

export const CheckCollisions = (entities: Entities, { dispatch }: { dispatch: (event: any) => void }) => {
  const player = entities.player.body;

  Object.keys(entities).forEach((key) => {
    if (key.includes('enemy')) {
      const enemy = entities[key].body;

      // Mermi-düşman çarpışması
      Object.keys(entities).forEach((bulletKey) => {
        if (bulletKey.includes('bullet')) {
          const bullet = entities[bulletKey].body;
          const bulletCollision = Matter.Collision.collides(bullet, enemy);

          if (bulletCollision) {
            // Düşman ve mermiyi yok et
            Matter.World.remove((entities.physics as any).world, enemy);
            Matter.World.remove((entities.physics as any).world, bullet);
            delete entities[key];
            delete entities[bulletKey];
            
            // Puan artır
            dispatch({ type: 'score' });
          }
        }
      });

      // Oyuncu-düşman çarpışması
      const collision = Matter.Collision.collides(player, enemy);
      if (collision) {
        dispatch({ type: 'game-over' });
      }
    }
  });

  return entities;
}; 