declare module 'react-native-game-engine' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface GameEngineProps {
    systems: Function[];
    entities: { [key: string]: any };
    running?: boolean;
    style?: ViewStyle;
  }

  export class GameEngine extends Component<GameEngineProps> {}
} 