import { createRequestMergeReducer, createService, skip } from "@rxfx/service";

const initialSettings = {
  NOTATION_HIDE: false,
  BLINDFOLD_ON: false,
  ORIENTATION_BLACK: false,
  NB_ONLY: false,
};

export const controlsService = createService<
  Partial<typeof initialSettings>,
  Partial<typeof initialSettings>,
  Error,
  typeof initialSettings
>("controls", () => {}, createRequestMergeReducer(initialSettings));

const LOCAL_STORAGE_KEY = "vision-controls";

// Load from local storage on startup
const savedControls = localStorage.getItem(LOCAL_STORAGE_KEY);
if (savedControls) {
  controlsService.request(JSON.parse(savedControls));
}

// Persist changes to local storage, skipping current, doing only future
controlsService.state.pipe(skip(1)).subscribe((controls) => {
  console.log(controls);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(controls));
});
