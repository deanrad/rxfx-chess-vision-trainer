import { createService, defaultBus, matchesAny } from "@rxfx/service";
import {
  BLINDFOLD_ON,
  NOTATION_HIDE,
  NB_ONLY,
  ORIENTATION_BLACK,
} from "@src/events/controls";

const initialSettings = {
  NOTATION_HIDE: false,
  BLINDFOLD_ON: false,
  ORIENTATION_BLACK: false,
  NB_ONLY: false,
};
type SETTING = keyof typeof initialSettings;

export const controlsService = createService<
  Partial<Record<SETTING, boolean>>,
  void,
  Error,
  Record<SETTING, boolean>
>(
  "controls",
  () => {},
  (ACs) =>
    (current = initialSettings, event) => {
      if (ACs.request.match(event)) {
        return { ...current, ...event.payload };
      }
      return current;
    }
);

// controlsService.request({ NOTATION_HIDE: false });

controlsService.state.subscribe(console.log);

defaultBus.listen(
  matchesAny(NOTATION_HIDE, BLINDFOLD_ON, ORIENTATION_BLACK, NB_ONLY),
  (event) => {
    controlsService.request({ [event.type]: event.payload });
  }
);
