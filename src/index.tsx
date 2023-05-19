import ReactDOM from "react-dom/client";

import "./styles.css";
import { useEffect } from "react";
import { combine, StoreValue } from "effector";
import { createTick } from "./loop";
import {
  $computedSnakes,
  $food,
  $funnel,
  $graph,
  shakeTail,
  Food,
  Snake,
  shakeHead,
  updateStores,
} from "./game";
import { eventControl } from "./controll";
import {
  handleCrashed,
  handleEatFood,
  handleSetDirection,
  handleSetPosition,
} from "./game";
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

import "./global.css";
import { markNextSnakeOnGraph } from "./graph/update-graph";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const $state = combine({
  snakes: $computedSnakes,
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

      const graph = graphController.extend(nextState.state.graph);

      const eatFood = (nextPosition: number, nextSnake: Snake) => {
        nextFood = [
          ...nextState.state.food,
          [randomPosition(), randomId()],
        ].filter(([position]) => {
          return geIndexByPosition(position as Coords) !== nextPosition;
        }) as [Coords, string][];

        graph.setValueByIndex(nextPosition, {
          type: "SNAKE",
        });

        return handleEatFood(
          handleSetPosition(nextSnake, nextPosition),
          nextPosition
        );
      };

      nextState.state.snakes
        .filter(({ snake }) => !snake.isCrash)
        .forEach(({ snake, algorithm }) => {
          const { nextDirection, nextPosition, path, processed } =
            snake.updater(snake, nextState.state.food, graph, algorithm);

          let nextSnake = snake;

          if (path?.length) {
            snake.path = path;
          }
          if (processed?.length) {
            snake.processed = processed;
          }

          const nextVertex = graph.getVertexByIndex(nextPosition);
          const type = nextVertex.type;

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

          graph.setValueByIndex(shakeTail(snake)[0], {
            id: shakeTail(snake)[1],
            type: "EMPTY",
          });
          graph.setValueByIndex(shakeHead(nextSnake)[0], {
            id: shakeHead(nextSnake)[1],
            type: "SNAKE",
          });

          // markNextSnakeOnGraph([shakeTail(snake)], shakeHead(nextSnake));

          nextSnakes.push(nextSnake);
        });

      updateStores({ snakes: nextSnakes, foods: nextFood });
    },
    run: (nextState) => {
      render(nextState);
    },
  }).start();
};

function App() {
  useEffect(() => {
    main();
    eventControl.init();
  }, []);

  return <Area />;
}

root.render(
  <>
    <App />
  </>
);
