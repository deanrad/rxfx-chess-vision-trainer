import { Chessboard } from "react-chessboard";
import { useService } from "@rxfx/react";
import { useMachine } from "@xstate/react";

import { trainer } from "@src/machines/trainer";
import { positionService } from "@src/services/position";

export function Board() {
  const [state, send] = useMachine(trainer);
  const {
    state: { position },
  } = useService(positionService);

  console.log(`State is`, state.value);

  return (
    <Chessboard
      position={position}
      onSquareClick={() => {
        state.matches("unactivated") && send("activate");
      }}
    />
  );
}
