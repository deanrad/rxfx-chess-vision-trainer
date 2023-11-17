import { BehaviorSubject, fromEvent } from "rxjs";

export const windowSizeHW = new BehaviorSubject<[number, number]>([
  window.innerHeight,
  window.innerWidth,
]);

fromEvent(window, "resize").subscribe(() => {
  windowSizeHW.next([window.innerHeight, window.innerWidth]);
});
