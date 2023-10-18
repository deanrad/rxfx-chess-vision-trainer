import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Controls } from "./Controls";
import { NOTATION_TOGGLE } from "@src/events/controls";

describe("Controls", () => {
  it("renders controls", () => {
    render(<Controls />);

    expect(screen.getByText("Hide Notation")).toBeInTheDocument();
    expect(screen.getByText("Blindfold Mode")).toBeInTheDocument();
  });

  // Skipped because silly react-toggle isnt accessible for click!
  it("triggers events", () => {
    const seenEvents = getSeenEvents();

    const result = render(<Controls />);
    const toggle1 = result.container.querySelector(
      "#hide-notation"
    ) as HTMLInputElement;

    toggle1?.click();

    expect(seenEvents).toContainEqual({
      type: NOTATION_TOGGLE.type,
      payload: true,
    });
    // OR:  expect(seenEvents).toContainEqual(NOTATION_TOGGLE(true))
  });
});
