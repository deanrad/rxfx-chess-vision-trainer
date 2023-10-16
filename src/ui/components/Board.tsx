import { useService, useWhileMounted } from "@rxfx/react";
import { defaultBus } from "@rxfx/service";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

import { NOTATION_TOGGLE } from "@src/events/controls";
import { positionService } from "@src/services/position";
import { handleSquareClick } from "@src/handlers/handleSquareClick";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);

  useWhileMounted(() =>
    defaultBus.listen(NOTATION_TOGGLE, ({ payload: hide }) => {
      setHideNotation(hide);
    })
  );

  const {
    state: { position },
  } = useService(positionService);

  return (
    <Chessboard
      id="chessboard"
      position={position}
      onSquareClick={handleSquareClick}
      showBoardNotation={!hideNotation}
    />
  );
}
