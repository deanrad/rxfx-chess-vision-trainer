import { createEvent } from "@rxfx/service";

export const NOTATION_TOGGLE = createEvent<boolean>("control/notation");
export const BLINDFOLD_TOGGLE = createEvent<boolean>("control/blindfold");
export const ORIENTATION_TOGGLE = createEvent<boolean>("control/orientation");
