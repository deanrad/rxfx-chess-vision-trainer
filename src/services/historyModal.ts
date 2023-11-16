import { Observable, createBlockingService } from "@rxfx/service";

export const historyModal = createBlockingService<void>(
  "modal/history",
  () => new Observable()
);
