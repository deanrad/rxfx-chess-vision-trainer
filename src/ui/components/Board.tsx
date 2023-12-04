import { useService, useSubject, useWhileMounted } from "@rxfx/react";
import { after, defaultBus } from "@rxfx/service";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

import { NOTATION_HIDE, ORIENTATION_BLACK } from "@src/events/controls";
import { positionService } from "@src/services/position";
import { handleSquareClick } from "@src/handlers/handleSquareClick";
import { THRESHOLD } from "@rxfx/perception";
import { windowSizeHW } from "@src/services/windowSize";
import { fontSizeService } from "@src/services/fontSizeService";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"black" | "white">(
    "white"
  );
  const [windowHeight, windowWidth] = useSubject(windowSizeHW);
  const isLandscape = windowWidth > windowHeight;

  useWhileMounted(() =>
    defaultBus.listen(NOTATION_HIDE, ({ payload: hide }) => {
      setHideNotation(hide);
    })
  );

  useWhileMounted(() =>
    defaultBus.listen(ORIENTATION_BLACK, ({ payload: isBlack }) => {
      setBoardOrientation(isBlack ? "black" : "white");
    })
  );

  useWhileMounted(() =>
    fontSizeService.state.subscribe((size) => {
      const fontSize = isLandscape ? size * 2 : size;
      document
        .getElementById("root")!
        .style.setProperty("--notation-font-size", `${fontSize}rem`);
    })
  );

  const {
    state: { position, puzzleTitle },
  } = useService(positionService);

  return (
    <div>
      <h2 className="puzzle-title">{puzzleTitle}</h2>
      <Chessboard
        id="chessboard"
        position={position}
        onSquareClick={handleSquareClick}
        showBoardNotation={!hideNotation}
        boardOrientation={boardOrientation}
        boardWidth={(isLandscape ? windowHeight : windowWidth) - 10}
      />
    </div>
  );
}
