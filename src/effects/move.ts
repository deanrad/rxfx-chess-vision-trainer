import { after, concat, createBlockingEffect } from "@rxfx/service";
import { THRESHOLD } from "@rxfx/perception";
import { positionService } from "@src/services/position";

export const moveEffect = createBlockingEffect<{
  piece: string;
  moves: string[];
}>(({ piece, moves: [step1, step2] }) => {
  return concat(
    after(0, () => {
      positionService.request({ piece, square: step1 });
    }),
    after(THRESHOLD.Thought, () => {
      positionService.request({ piece, square: step2 });
    })
  );
});
