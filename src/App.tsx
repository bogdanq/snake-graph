import "./styles.css";
import { useEffect } from "react";
import { combine, StoreValue } from "effector";
import { createTick } from "./loop";
import {
  $food,
  $funnel,
  $graph,
  $snakes,
  Food,
  Snake,
  updateFood,
  updateSnake,
} from "./game";
import { eventControl } from "./controll";
import {
  handleCrashed,
  handleEatFood,
  handleSetDirection,
  handleSetPosition,
} from "./snake-helpers";
import { svgRender } from "./render";
import { Coords } from "./types";
import { Area } from "./ui";
import {
  geIndexByPosition,
  getPositionByIndex,
  graphController,
  randomId,
  randomPosition,
} from "./graph";

const $state = combine({
  snakes: $snakes,
  food: $food,
  graph: $graph,
  funnel: $funnel,
});

const main = () => {
  const render = ({ state }: { state: StoreValue<typeof $state> }) => {
    svgRender.drowFood(state.food);
    svgRender.drowSnake(state);

    svgRender.drowFunnel(state);
  };

  createTick({
    $state,
    runLogic: (nextState) => {
      let nextSnakes: Array<Snake> = [];
      let nextFood: Array<Food> = nextState.state.food;

      const eatFood = (nextPosition: number, nextSnake: Snake) => {
        nextFood = [
          ...nextState.state.food,
          [randomPosition(), randomId()],
        ].filter(([position]) => {
          return geIndexByPosition(position as Coords) !== nextPosition;
        }) as [Coords, string][];

        return handleEatFood(
          handleSetPosition(nextSnake, nextPosition),
          nextPosition
        );
      };

      nextState.state.snakes
        .filter((snake: Snake) => !snake.isCrash)
        .forEach((snake: Snake) => {
          const { nextDirection, nextPosition } = snake.updater(snake);

          let nextSnake = snake;

          const nextVertex = nextState.state.graph.graph[nextPosition];
          const type = nextVertex && nextVertex.type;

          switch (type) {
            case "FOOD":
              nextSnake = eatFood(nextPosition, nextSnake);
              break;

            case "SNAKE":
              const foods = snake.body.map(([position]) => [
                getPositionByIndex(position),
                randomId(),
              ]) as [Coords, string][];

              nextFood.push(...foods);

              nextSnake = handleCrashed(snake);

              break;

            case "FUNNEL":
              nextSnake = handleSetPosition(
                snake,
                nextVertex.siblings?.[0] || 0
              );
              break;

            default:
              nextSnake = handleSetDirection(
                handleSetPosition(nextSnake, nextPosition),
                nextDirection
              );
              break;
          }

          graphController.updateVertex([
            {
              type: "EMPTY",
              value: snake.id,
              index: snake.body[0][0],
            },
          ]);

          nextSnakes.push(nextSnake);
        });

      updateSnake(nextSnakes);
      updateFood(nextFood);
    },
    run: (nextState) => {
      render(nextState);
    },
  }).start();
};

export default function App() {
  useEffect(() => {
    main();
    eventControl.init();
  }, []);

  return <Area />;
}
