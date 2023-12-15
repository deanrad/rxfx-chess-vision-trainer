import { after, createBlockingService } from "@rxfx/service";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
import { DIFFICULTIES, controlsService } from "./controls";

const TICK_DURATION_MSEC = 100;

const elapsedSeconds = interval(TICK_DURATION_MSEC).pipe(
  map((i) => ((i + 1) * TICK_DURATION_MSEC) / 1000)
);

export const timerService = createBlockingService<void, number, Error, number>(
  "timer",
  () => elapsedSeconds,
  (ACs) =>
    (elapsed = 0, event) => {
      if (ACs.started.match(event)) {
        return 0;
      }
      if (ACs.next.match(event)) {
        return event.payload;
      }
      return elapsed;
    }
);

export type TimeLog = (typeof controlsService)["state"]["value"] & {
  piece: string;
  duration: number;
  difficulty: number;
  solvedAt: number;
};

const LOCAL_STORAGE_KEY = "timeLog";

const initialTimeLogs = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"
);

export const timeLogService = createBlockingService<
  TimeLog,
  void,
  Error,
  TimeLog[]
>(
  "timeLog",
  async () => {
    await after(Promise.resolve());
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(timeLogService.state.value)
    );
  },
  (ACs) =>
    (state = initialTimeLogs, event) => {
      if (ACs.request.match(event)) {
        return [...state, event.payload];
      }
      return state;
    }
);

timeLogService.state.subscribe((s) => {
  console.log("timeLogs", s);
});

export function saveTimeLog(
  seconds: number,
  controls: (typeof controlsService)["state"]["value"],
  piece: string
) {
  const difficulty = Object.entries(controls).reduce(
    (score, [controlKey, isSet]) =>
      score + (isSet ? DIFFICULTIES[controlKey] : 0),
    1
  );

  const toLog: TimeLog = {
    ...controls,
    piece,
    duration: seconds,
    difficulty,
    solvedAt: Date.now(),
  };
  console.log(`Puzzle Solution`, toLog);
  timeLogService.request(toLog);
}
