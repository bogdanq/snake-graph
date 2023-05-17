import {
  createStore,
  createEvent,
  combine,
  sample,
  attach,
  StoreValue,
  Effect,
} from "effector";
import { CONSTANTS } from "../../constants";
import { DIRECTIONS } from "../../types";
import { getAISnakePosition, keyboardControl } from "../controll";
import {
  Graph,
  breadthFirstSearch,
  graphController,
  randomId,
} from "../../graph";
import {
  generateRandomFoodByCount,
  generateRandomFunnelByCount,
} from "../../render";
import { ComputedSnake, Food, Funnel, Snake } from "../type";
import { getColorsForSnake } from "../utils";
import {
  markFoodOnGraph,
  markFunnelOnGraph,
  markSnakeOnGraph,
} from "../../graph/update-graph";

export const $fps = createStore(CONSTANTS.FPS);

export const updateSnake = createEvent<Snake[]>();

export const $algoritms = createStore<
  Array<{
    id: string;
    alg: typeof breadthFirstSearch;
    name: string;
  }>
>([
  {
    id: "breadth",
    alg: breadthFirstSearch,
    name: "Breadth first search",
  },
]);

export const $snakes = createStore<Snake[]>([
  {
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: CONSTANTS.SNAKE_LENGT }).map((_, i) => [
      i + 1000,
      randomId(),
    ]),
    updater: (snake: Snake) => {
      return keyboardControl(snake);
    },
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(false),
    isAi: false,
  },
  {
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: 10 }).map((_, i) => [i + 30, randomId()]),
    updater: (p1, p2, p3, p4) => {
      // console.time("getAISnakePosition");
      const res = getAISnakePosition(p1, p2, p3, p4);
      // console.timeEnd("getAISnakePosition");

      return res;
    },
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(),
    isAi: true,
  },
]).on(
  updateSnake,
  // TODO игроков удалять, ботов оставлять мертвыми
  // (state, snakes) => snakes
  (state, snakes) =>
    state.map((s) => {
      const nextSnake = snakes.find((snake) => snake.id === s.id);

      return nextSnake ? nextSnake : s;
    })
);

export const $computedSnakes = $snakes.map<ComputedSnake[]>((snakes) => {
  return snakes.map((snake) => {
    if (snake.isAi) {
      return { snake, algorithm: breadthFirstSearch };
    }

    return { snake };
  });
});

export const updateFood = createEvent<Food[]>();

export const $food = createStore<Food[]>(
  generateRandomFoodByCount(CONSTANTS.START_FOOD_COUNT)
).on(updateFood, (prev, next) => {
  return next;
});

export const $currentSnake = $snakes.map(
  (snakes) => snakes.find((snake) => !snake.isAi) as Snake
);

export const $funnel = createStore<Funnel[]>(
  generateRandomFunnelByCount(CONSTANTS.FUNNEL_LENGT)
);

export const $graph = createStore(graphController.createGraph());

const $entities = combine({
  food: $food,
  snakes: $snakes,
  funnel: $funnel,
});

type Entities = StoreValue<typeof $entities>;

const updateGraphFx: Effect<Entities, Graph> = attach({
  source: $graph,
  effect: (gr, entities: Entities) => {
    const graph = graphController.extend(gr);

    markSnakeOnGraph(entities.snakes);
    markFunnelOnGraph(entities.funnel);
    markFoodOnGraph(entities.food);

    return graph;
  },
});

sample({
  clock: $entities,
  target: updateGraphFx,
});

$graph.on(updateGraphFx.doneData, (_, next) => {
  return next;
});
