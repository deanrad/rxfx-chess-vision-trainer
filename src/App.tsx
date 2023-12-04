import { ChakraProvider, IconButton } from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";
import { useService, useWhileMounted } from "@rxfx/react";
import { setPieceVisibility } from "@src/effects/move";
import { controlsService } from "@src/services/controls";
import { fontSizeService } from "@src/services/fontSizeService";
import { historyModal } from "@src/services/historyModal";
import { Board } from "@src/ui/components/Board";
import { OptionsModal } from "@src/ui/components/OptionsModal";
import "./App.css";

function App() {
  useWhileMounted(() =>
    controlsService.state.subscribe((state) => {
      setPieceVisibility(!state.BLINDFOLD_ON);
    })
  );

  const { isActive: showingModal } = useService(historyModal);

  return (
    <ChakraProvider>
      <h2>
        ♘ Vision Trainer
        <IconButton
          aria-label="Options"
          className="options-button"
          icon={<HamburgerIcon />}
          onClick={() => historyModal.request()}
        />
      </h2>
      <div className="contents">
        {showingModal && <OptionsModal />}

        <Board />
        <p className="font-button">
          <button
            onClick={() => {
              fontSizeService.request();
            }}
          >
            Font ↕️
          </button>
        </p>
        <p className="instructions">
          Instructions: With sound on, click or tap to hear a challenge of how
          to move a piece, in algebraic chess notation. Then decide upon and
          click the square the piece must first move to in order to reach the
          target. Try hiding the notation or piece, playing blind, if you dare!
        </p>
        <header className="header"></header>
      </div>
    </ChakraProvider>
  );
}

export default App;
