import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useService, useWhileMounted } from "@rxfx/react";
import { after, defaultBus } from "@rxfx/service";
import { useMachine } from "@xstate/react";

import { trainer } from "@src/machines/trainer";
import { NOTATION_TOGGLE } from "@src/events/controls";
import {
  positionService,
  isSolution,
  squareColor,
  pronounceSquare,
} from "@src/services/position";
import { say } from "@src/services/speech";
import { moveEffect } from "@src/effects/move";

export function Board() {
  const [hideNotation, setHideNotation] = useState(false);

  useWhileMounted(() =>
    defaultBus.listen(NOTATION_TOGGLE, ({ payload: hide }) => {
      setHideNotation(hide);
    })
  );

  const [state, send] = useMachine(trainer);
  const {
    state: { position, moves },
  } = useService(positionService);
  const piece = Object.values(position)[0];

  const handleSquareClick = async (guess) => {
    if (state.matches("unactivated")) {
      send("activate");
    }

    if (state.matches("explained")) {
      send("challenge.new");
    }

    if (state.matches("guessable")) {
      const isCorrect = isSolution(guess);
      const msg = isCorrect
        ? `${pronounceSquare(guess)}, 
        a ${squareColor(guess)} square, is correct`
        : `${pronounceSquare(guess)} is not correct`;

      say(msg);

      if (!isCorrect) return;
      await after(500);

      // Change state to where the next click starts a new challenge
      send("guess.correct");

      // Animate the moves
      moveEffect.request({ piece, moves: [guess, moves.target] });

      const alternates = moves.solutions
        .filter((solxn) => solxn !== guess)
        .filter(() => piece[1] !== "Q");

      const alternateMsg = alternates.length
        ? `${alternates.join(" and ")} ${
            alternates.length > 1 ? " are " : " is "
          } also correct.`
        : "";
      say(alternateMsg);
    }
  };

  return (
    <Chessboard
      id="chessboard"
      position={position}
      onSquareClick={handleSquareClick}
      showBoardNotation={!hideNotation}
    />
  );
}
