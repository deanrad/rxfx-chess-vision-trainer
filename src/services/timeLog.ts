import { createBlockingService, defaultBus } from "@rxfx/service";
import { interval } from "rxjs";
import { map } from "rxjs/operators";

const TICK_DURATION_MSEC = 500;

const elapsedSeconds = interval(TICK_DURATION_MSEC).pipe(
  map((i) => ((i + 1) * TICK_DURATION_MSEC) / 1000)
);

export const timeLogService = createBlockingService<
  void,
  number,
  Error,
  number
>(
  "timeLog",
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

export function saveTimeLog(seconds: number) {
  console.log(`TODO Log that solving the puzzle took ${seconds}s`);
}

// Object.assign(window, { timeLogService, defaultBus });
// defaultBus.spy(({ type, payload }) => console.log(type, payload));
