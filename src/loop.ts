import {
  createStore,
  createEvent,
  createEffect,
  attach,
  guard,
  merge,
  sample,
  combine,
  StoreValue,
} from "effector";
import { $fps, LoopStore, startGame } from "./game";

const tickFx = createEffect<number, void>().use(
  (fps) =>
    new Promise((rs) => {
      setTimeout(rs, 1000 / fps);
    })
);

export function createTick({
  $state,
  run,
  runLogic,
}: {
  $state: LoopStore;
  run: (nextState: { state: StoreValue<LoopStore> }) => void;
  runLogic: (nextState: { state: StoreValue<LoopStore> }) => void;
}) {
  const $tick = createStore(0);
  const render = createEvent();
  const start = createEvent();

  const $combinedState = combine($tick, $state, (tick, state) => ({
    tick,
    state,
  }));

  const nextTickFx = attach({
    effect: tickFx,
    source: $fps,
    mapParams: (_, fps) => fps,
  });

  const triggerTick = guard({
    clock: merge([nextTickFx.done, startGame]),
    filter: $state.map(({ gameStatus }) => gameStatus === "RUNING"),
  });

  const triggerRender = guard({
    clock: $state,
    filter: $state.map(({ gameStatus }) => gameStatus === "PENDING"),
  });

  sample({
    clock: merge([start, triggerTick]),
    target: nextTickFx,
  });

  $tick.on(nextTickFx.done, (previous) => previous + 1);

  sample({ source: $combinedState, clock: nextTickFx }).watch((s) => {
    runLogic(s);
  });

  sample({ source: $combinedState, clock: render }).watch(run);

  sample({
    clock: [triggerRender, nextTickFx.done],
    target: render,
  });

  return {
    $tick,
    start,
  };
}
