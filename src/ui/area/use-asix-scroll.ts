import { useStore } from "effector-react";
import { useEffect, useRef } from "react";
import { useReactFlow } from "reactflow";
import { $currentSnake } from "../../game";
import { shakeHead } from "../../snake-helpers";
import { getGlobalPositionByIndex } from "../../graph";

export const useAsixScroll = () => {
  const timerId = useRef<undefined | NodeJS.Timer>(undefined);

  const flow = useReactFlow();
  const snake = useStore($currentSnake);

  const direction = snake?.direction;
  const isCrashed = snake?.isCrash;
  const head = shakeHead(snake)[0];

  const [x, y] = getGlobalPositionByIndex(head);

  useEffect(() => {
    // положение холста относительно направления

    if (!isCrashed) {
      timerId.current = setInterval(() => {
        const viewport = flow.getViewport();

        flow.setViewport({
          ...viewport,
          x: viewport.x - (viewport.x + x - window.innerWidth / 2) / 10,
          y: viewport.y - (viewport.y + y - window.innerHeight / 2) / 10,
        });
      }, 1000 / 60);
    }

    return () => {
      clearInterval(timerId.current);
    };
  }, [direction, flow, x, y, isCrashed]);
};
