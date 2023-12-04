import { createService } from "@rxfx/service";

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

controlsService.state.subscribe(console.log);
