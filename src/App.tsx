import { ChakraProvider } from "@chakra-ui/react";
import { useService, useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";
import { BLINDFOLD_ON } from "@src/events/controls";
import { handleSquareClick } from "@src/handlers/handleSquareClick";
import { historyModal } from "@src/services/historyModal";
import { Board } from "@src/ui/components/Board";
import { Controls } from "@src/ui/components/Controls";
import { HistoryModal } from "@src/ui/components/HistoryModal";
import "./App.css";
import { setPieceVisibility } from "@src/effects/move";

function App() {
  useWhileMounted(() =>
    defaultBus.listen(BLINDFOLD_ON, ({ payload: checked }) => {
      setPieceVisibility(!checked);
    })
  );

  const { isActive: showingModal } = useService(historyModal);

  return (
    <ChakraProvider>
      <h1>Chess Vision Trainer</h1>
      <span
        style={{ float: "right", fontSize: "200%" }}
        onClick={() => {
          showingModal ? historyModal.cancelCurrent() : historyModal.request();
        }}
      >
        🕓
      </span>
      {showingModal && <HistoryModal />}
      <div className="tagline" onClick={() => handleSquareClick("")}>
        Click or tap for a new puzzle!! ♛
      </div>
      <Board />
      <p className="instructions">
        Instructions: With sound on, click or tap to hear a challenge of how to
        move a piece, in algebraic chess notation. Then decide upon and click
        the square the piece must first move to in order to reach the target.
        Try hiding the notation or piece, playing blind, if you dare!
      </p>
      <header className="header">
        <Controls />
      </header>
    </ChakraProvider>
  );
}

export default App;
