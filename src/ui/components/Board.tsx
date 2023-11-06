import { useService, useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

import { NOTATION_HIDE, ORIENTATION_BLACK } from "@src/events/controls";
import { positionService } from "@src/services/position";
import { handleSquareClick } from "@src/handlers/handleSquareClick";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState("white");

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

  const {
    state: { position, puzzleTitle },
  } = useService(positionService);

  return (
    <div>
      <h2 className="puzzle-title">
        {puzzleTitle ? `Challenge: ${puzzleTitle}` : ""}
      </h2>
      <Chessboard
        id="chessboard"
        position={position}
        onSquareClick={handleSquareClick}
        showBoardNotation={!hideNotation}
        boardOrientation={boardOrientation}
      />
    </div>
  );
}
