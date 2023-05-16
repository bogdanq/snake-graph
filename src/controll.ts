import { getTargetIndex } from "./graph";

type EventListener = (
  event: MouseEvent,
  state?: { [key: string]: any },
  lastIndex?: number | null
) => void;

type EventListenerKey = (
  event: KeyboardEvent,
  state?: { [key: string]: any },
  lastIndex?: number | null
) => void;

type Listener = {
  type: "mouseup" | "mousedown" | "click" | "mousemove";
  eventListener: EventListener;
};

type ListenerKey = {
  type: "keydown";
  eventListener: EventListenerKey;
};

// TODO фикс типов
class Controll {
  private isMouseDown: boolean = false;
  private isMouseMove: boolean = false;
  private listeners: Array<Listener | ListenerKey> = [];
  private state: {} = {};
  private lastIndex: null | number = null;
  private disabledListeners: Array<Listener | ListenerKey> = [];

  init() {
    this.registerClickEventToCanvas();
    this.state = {};
    return this;
  }

  registerClickEventToCanvas() {
    document.addEventListener("mousedown", (event: MouseEvent) => {
      this.listeners
        .filter((userEvent) => userEvent.type === "mousedown")
        // @ts-ignore
        .forEach((userEvent) => userEvent.eventListener(event));

      this.isMouseDown = true;
      this.isMouseMove = false;
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.listeners
        .filter((userEvent) => userEvent.type === "keydown")
        // @ts-ignore
        .forEach((userEvent) => userEvent.eventListener(event, this.state));
    });

    document.addEventListener("mouseup", (event: MouseEvent) => {
      this.isMouseDown = false;
      this.listeners
        .filter((userEvent) => userEvent.type === "mouseup")
        // @ts-ignore
        .forEach((userEvent) => userEvent.eventListener(event, this.state));
    });

    document.addEventListener("click", (event: MouseEvent) => {
      this.listeners
        .filter((userEvent) => userEvent.type === "click")
        .forEach((userEvent) => {
          if (!this.isMouseMove) {
            // @ts-ignore
            userEvent.eventListener(event, this.state);
          }
        });
    });

    document.addEventListener("mousemove", (event: MouseEvent) => {
      const index = getTargetIndex(event);

      if (this.isMouseDown && index !== this.lastIndex) {
        this.lastIndex = index;
        this.isMouseMove = true;
        this.listeners
          .filter((userEvent) => userEvent.type === "mousemove")
          .forEach((userEvent) =>
            // @ts-ignore
            userEvent.eventListener(event, this.state, this.lastIndex)
          );
      }
    });
  }

  disabledListener() {
    this.clear();
  }

  includeListener() {
    this.listeners = this.disabledListeners;
  }

  addMouseDownEvent<T extends EventListener>(eventListener: T) {
    this.listeners.push({ type: "mousedown", eventListener });
  }

  addMouseUpEvent<T extends EventListener>(eventListener: T) {
    this.listeners.push({ type: "mouseup", eventListener });
  }

  addMouseMoveEvent<T extends EventListener>(eventListener: T) {
    this.listeners.push({ type: "mousemove", eventListener });
  }

  addMouseClickEvent<T extends EventListener>(eventListener: T) {
    this.listeners.push({ type: "click", eventListener });
  }

  addKeydownEvent<T extends EventListenerKey>(eventListener: T) {
    this.listeners.push({ type: "keydown", eventListener });
  }

  setState(state: Controll["state"]) {
    this.state = state;

    return this;
  }

  clear() {
    if (this.listeners.length > 0) {
      this.disabledListeners = this.listeners;
      this.isMouseDown = false;
      this.isMouseMove = false;
      this.listeners = [];
      this.lastIndex = null;
    }
  }
}

export const eventControl = new Controll();
