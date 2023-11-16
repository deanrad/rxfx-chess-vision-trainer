import { createEvent } from "@rxfx/service";

export const NOTATION_HIDE = createEvent<boolean>("NOTATION_HIDE");
export const BLINDFOLD_ON = createEvent<boolean>("BLINDFOLD_ON");
export const ORIENTATION_BLACK = createEvent<boolean>("ORIENTATION_BLACK");
export const NB_ONLY = createEvent<boolean>("NB_ONLY");
