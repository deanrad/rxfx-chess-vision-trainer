import { useService, useSubject, useWhileMounted } from "@rxfx/react";
import { after, defaultBus } from "@rxfx/service";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

import { NOTATION_HIDE, ORIENTATION_BLACK } from "@src/events/controls";
import { positionService } from "@src/services/position";
import { handleSquareClick } from "@src/handlers/handleSquareClick";
import { THRESHOLD } from "@rxfx/perception";
import { windowSizeHW } from "@src/services/windowSize";

const NOTATION_SIZE = window.innerWidth > 500 ? "3rem" : "0.7rem";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"black"|"white">("white");
  const [windowHeight, windowWidth] = useSubject(windowSizeHW);

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

  useEffect(() => {
    if (!hideNotation) {
      after(THRESHOLD.Blink).then(() =>
        document
          .querySelectorAll("[data-square] > div > div")
          .forEach((div) => (div.style["font-size"] = NOTATION_SIZE))
      );
    }
  }, [hideNotation]);
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
        boardWidth={Math.min(windowHeight, windowWidth) - 20}
      />
    </div>
  );
}
