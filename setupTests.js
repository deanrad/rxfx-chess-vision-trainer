import { afterEach } from "vitest";
import { defaultBus } from "@rxfx/service";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const spies = [];

function stopSpying() {
  spies.map((spy) => spy.unsubscribe());
}

function getSeenEvents(bus = defaultBus) {
  const seen = [];

  const spy = bus.spy((e) => {
    seen.push(e);
  });

  spies.push(spy);

  return seen;
}

Object.assign(global, { getSeenEvents });

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  stopSpying();
  cleanup();
});
