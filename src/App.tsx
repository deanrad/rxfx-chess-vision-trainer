import { ChakraProvider } from "@chakra-ui/react";
import { useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";
import "./App.css";
import { BLINDFOLD_ON } from "./events/controls";
import { handleSquareClick } from "./handlers/handleSquareClick";
import { Board } from "./ui/components/Board";
import { Controls } from "./ui/components/Controls";

function App() {
  useWhileMounted(() =>
    defaultBus.listen(BLINDFOLD_ON, ({ payload: checked }) => {
      const visibility = checked ? "hidden" : "visible";

      (document.querySelector("#root") as HTMLElement).style.setProperty(
        "--piece-visibility",
        visibility
      );
    })
  );

  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
}

export default App;
