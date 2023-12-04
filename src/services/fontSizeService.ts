import { createService } from "@rxfx/service";

export const fontSizeService = createService<void, void, Error, number>(
  "fontSize",
  () => {},
  (ACs) =>
    (size = 1, _event) => {
      if (!ACs.request.match(_event)) return size;
      return size === 2 ? 3 : size === 3 ? 1 : 2;
    }
);

// fontSizeService.starts.pipe(scan)
