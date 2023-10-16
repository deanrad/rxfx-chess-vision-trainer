import "./App.css";
import { Board } from "./ui/components/Board";
import { Controls } from "./ui/components/Controls";
import { BLINDFOLD_TOGGLE } from "./events/controls";
import { useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";
import { handleSquareClick } from "./handlers/handleSquareClick";

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
      <header className="header">
        <Controls />
        <div className="tagline" onClick={() => handleSquareClick("")}>
          Click or tap for a new puzzle!! ♛
        </div>
      </header>
      <Board />
      <p>
        Instructions: With sound on, click or tap to hear a challenge of how to
        move a piece, in algebraic chess notation. Then decide upon and click
        the square the piece must first move to in order to reach the target.
        Try hiding the notation or piece, playing blind, if you dare!
      </p>
    </>
  );
}

export default App;
