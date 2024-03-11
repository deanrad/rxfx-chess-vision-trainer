import { useService, useSubject, useWhileMounted } from "@rxfx/react";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

import { handleSquareClick } from "@src/handlers/handleSquareClick";
import { controlsService } from "@src/services/controls";
import { fontSizeService } from "@src/services/fontSizeService";
import { positionService } from "@src/services/position";
import { windowSizeHW } from "@src/services/windowSize";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"black" | "white">(
    "white"
  );
  const [windowHeight, windowWidth] = useSubject(windowSizeHW);
  const isLandscape = windowWidth > windowHeight;

  useWhileMounted(() =>
    controlsService.state.subscribe((state) => {
      setHideNotation(state.NOTATION_HIDE);
      setBoardOrientation(state.ORIENTATION_BLACK ? "black" : "white");
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

  const { state } = useService(controlsService);

  const coloredPosition = Object.entries(position).reduce(
    (all, [pos, piece]) => {
      const coloredPiece =
        // The opposing pawn is already the correct color
        state.ORIENTATION_BLACK && !(piece as string).endsWith("P")
          ? (piece as string).replace("w", "b")
          : piece;
      all[pos] = coloredPiece;
      return all;
    },
    {}
  );

  return (
    <div>
      <h2 className="puzzle-title">{puzzleTitle}</h2>
      <Chessboard
        id="chessboard"
        position={coloredPosition}
        onSquareClick={handleSquareClick}
        showBoardNotation={!hideNotation}
        boardOrientation={boardOrientation}
        boardWidth={(isLandscape ? windowHeight : windowWidth) - 10}
      />
    </div>
  );
}
