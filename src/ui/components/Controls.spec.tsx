import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controls } from "./Controls";
import { NOTATION_TOGGLE } from "@src/events/controls";
import { defaultBus } from "@rxfx/service";

describe("Controls", () => {
  it("renders controls", () => {
    render(<Controls />);

    expect(screen.getByText("Hide Notation")).toBeInTheDocument();
    expect(screen.getByText("Blindfold Mode")).toBeInTheDocument();
  });

  // Skipped because silly react-toggle isnt accessible for click!
  it.skip("triggers events", () => {
    const seenEvents = getSeenEvents();

    render(<Controls />);
    const toggle1 = screen.getByText("Hide Notation").previousSibling;

    userEvent.click(toggle1);

    // expect(seenEvents).toContain({
    //   type: NOTATION_TOGGLE.type,
    //   value: true,
    // });
  });
});

function getSeenEvents(bus = defaultBus) {
  const seen = [];
  const sub = bus.spy((e) => {
    seen.push(e);
  });
  Object.assign(seen, {
    unsubscribe() {
      sub.unsubscribe();
    },
  });
  return seen;
}
