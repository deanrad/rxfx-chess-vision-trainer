import { Chessboard } from "react-chessboard";
import { useService, use } from "@rxfx/react";
import { useMachine } from "@xstate/react";

import { trainer } from "@src/machines/trainer";
import {
  positionService,
  isSolution,
  squareColor,
} from "@src/services/position";
import { say } from "@src/services/speech";
import { after } from "@rxfx/service";

export function Board() {
  const [state, send] = useMachine(trainer);
  const {
    state: { position },
  } = useService(positionService);

  const handleSquareClick = async (guess) => {
    if (state.matches("unactivated")) {
      send("activate");
    }

    if (state.matches("explained")) {
      send("challenge.new");
    }

    if (state.matches("guessing")) {
      const isCorrect = isSolution(guess);
      const msg = isCorrect
        ? `${guess}, a ${squareColor(guess)} square, is correct`
        : `${guess} is not correct`;

      say(msg);

      if (!isCorrect) return;
      await after(500);

      send("guess.correct");

      const alternates = positionService.state.value.moves.solutions
        .filter((solxn) => solxn !== guess)
        .filter(() => Object.values(position)[0][1] !== "Q");

      const alternateMsg = alternates.length
        ? `${alternates.join(" and ")} ${
            alternates.length > 1 ? " are " : " is "
          } also correct.`
        : "";
      say(alternateMsg);
    }
  };

  return <Chessboard position={position} onSquareClick={handleSquareClick} />;
}
