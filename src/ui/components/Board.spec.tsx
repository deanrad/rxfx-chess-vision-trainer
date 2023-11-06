import { describe, it, expect, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { NOTATION_HIDE } from "@src/events/controls";
import { Board } from "./Board";
import { defaultBus } from "@rxfx/service";

const mockBoard = vi.fn();

vi.mock("react-chessboard", () => ({
  Chessboard: (props) => {
    mockBoard(props);
    return <div>Showing notation: {props.showBoardNotation}</div>;
  },
}));

describe(Board, () => {
  describe("Upon a NOTATION_TOGGLE event", () => {
    it("hides the notation", async () => {
      render(<Board />);

      // Test the right props were given to show, initially
      expect(mockBoard).toHaveBeenCalledWith(
        expect.objectContaining({
          showBoardNotation: true,
        })
      );

      await act(() => {
        defaultBus.trigger(NOTATION_HIDE(true));
      });

      // Now assert, it's told not to show
      expect(mockBoard).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          showBoardNotation: false,
        })
      );

      // OR
      // Assert on the rendered output
      // const firstSquare = result.container.querySelector(`[data-boardid=chessboard] > div > div`);
      // console.log(firstSquare?.outerHTML);

      // expect(firstSquare.innerText).toEqual("");
    });
  });
});
