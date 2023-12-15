import { after, concat, createBlockingEffect } from "@rxfx/service";
import { THRESHOLD } from "@rxfx/perception";
import { positionService } from "@src/services/position";
import { controlsService } from "@src/services/controls";

export const setPieceVisibility = (isVisibile: boolean) => {
  const visibility = !isVisibile ? "hidden" : "visible";
  (document.querySelector("#root") as HTMLElement).style.setProperty(
    "--piece-visibility",
    visibility
  );
};
export const moveEffect = createBlockingEffect<{
  piece: string;
  moves: string[];
}>(({ piece, moves: [step1, step2] }) => {
  return concat(
    after(0, () => {
      setPieceVisibility(true);
      positionService.request({ piece, square: step1, expo: true });
    }),
    after(THRESHOLD.Thought, () => {
      positionService.request({
        piece,
        square: step2,
        expo: true,
        final: true,
      });
    }),
    after(THRESHOLD.DeepBreath, () => {
      setPieceVisibility(!controlsService.state.value.BLINDFOLD_ON);
    })
  );
});
