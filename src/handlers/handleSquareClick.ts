import { after } from "@rxfx/service";
import { trainer } from "@src/machines/trainer";
import {
  isSolution,
  squareColor,
  pronounceSquare,
  positionService,
} from "@src/services/position";
import { say, speechEffect } from "@src/effects/speech";
import { moveEffect } from "@src/effects/move";

const getState = () => trainer.getSnapshot();

export const handleSquareClick = async (guess: string) => {
  const { position, moves, target } = positionService.state.value;

  const piece = Object.values(position)[0] as string;

  if (getState().matches("unactivated")) {
    trainer.send("activate");
    return;
  }

  if (getState().matches("explained")) {
    trainer.send("challenge.new");
    return;
  }

  if (getState().matches("guessable")) {
    const isCorrect = isSolution(guess);
    const msg = isCorrect
      ? `${pronounceSquare(guess)}, 
      a ${squareColor(guess)} square, is correct`
      : `${pronounceSquare(guess)} is not correct`;

    if (isCorrect) {
      speechEffect.cancelCurrent();
      say(msg);
    } else if (!speechEffect.isActive.value) {
      say(msg);
    }

    if (!isCorrect) return;
    await after(500);

    // Change state to where the next click starts a new challenge
    trainer.send("guess.correct");

    // Animate the moves
    moveEffect.request({ piece, moves: [guess, target] });

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
