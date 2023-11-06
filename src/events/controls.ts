import { createEvent } from "@rxfx/service";

export const NOTATION_HIDE = createEvent<boolean>("control/notation");
export const BLINDFOLD_ON = createEvent<boolean>("control/blindfold");
export const ORIENTATION_BLACK = createEvent<boolean>("control/orientation");
export const NB_ONLY = createEvent<boolean>("control/nb");
