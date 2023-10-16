import "./App.css";
import { Board } from "./ui/components/Board";
import { Controls } from "./ui/components/Controls";
import { BLINDFOLD_TOGGLE } from "./events/controls";
import { useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";

function App() {
  useWhileMounted(() =>
    defaultBus.listen(BLINDFOLD_TOGGLE, ({ payload: checked }) => {
      const visibility = checked ? "hidden" : "visible";

      (document.querySelector("#root") as HTMLElement).style.setProperty(
        "--piece-visibility",
        visibility
      );
    })
  );

  return (
    <>
      <h1>Chess Vision Trainer</h1>
      <p>
        <Controls />
      </p>
      <Board />
      <p>
        Instructions: With sound on, tap or click to hear a challenge of how to
        move a piece, given in algebraic chess notation. Then decide upon and
        click the square the piece must first move to in order to reach the
        target. For a new challenge, click the board again!
      </p>
      <p>
        For extra credit, try blindfold mode, guessing both the square and its
        color.
      </p>
    </>
  );
}

export default App;
