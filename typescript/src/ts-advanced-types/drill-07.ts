export {};

type Events = "click" | "hover" | "focus";

type EventHandlerNames = `on${Capitalize<Events>}`;

const clickHandler: EventHandlerNames = "onClick";
const hoverHandler: EventHandlerNames = "onHover";
const focusHandler: EventHandlerNames = "onFocus";
