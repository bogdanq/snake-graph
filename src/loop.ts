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
import { $fps, LoopStore } from "./game";

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
    clock: merge([nextTickFx.done]),
    filter: () => true,
  });

  sample({
    clock: [start, triggerTick],
    target: nextTickFx,
  });

  $tick.on(nextTickFx.done, (previous) => previous + 1);

  sample({ source: $combinedState, clock: nextTickFx }).watch((s) => {
    // console.time("s");
    runLogic(s);
    // console.timeEnd("s");
  });

  sample({ source: $combinedState, clock: render }).watch(run);

  sample({
    clock: [nextTickFx.done],
    target: render,
  });

  return {
    $tick,
    start,
  };
}
