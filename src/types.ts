export enum KEYS {
  LEFT_ARROW = 65,
  RIGHT_ARROW = 68,
  TOP_ARROW = 87,
  DOWN_ARROW = 83,

  LEFT_ARROW_PAD = 37,
  RIGHT_ARROW_PAD = 39,
  TOP_ARROW_PAD = 38,
  DOWN_ARROW_PAD = 40
}

export enum DIRECTIONS {
  LEFT = KEYS.LEFT_ARROW,
  RIGHT = KEYS.RIGHT_ARROW,
  TOP = KEYS.TOP_ARROW,
  DOWN = KEYS.DOWN_ARROW
}

export type Coords = [number, number];
