
export interface PitchData {
  pitch: number;
  clarity: number;
}

export interface GameTarget {
  id: string;
  x: number;
  y: number;
  type: 'star' | 'bubble';
  collected: boolean;
}
