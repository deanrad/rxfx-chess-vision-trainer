import { createService } from "@rxfx/service";

export const fontSizeService = createService<void, void, Error, string>(
  "fontSize",
  () => {},
  (ACs) =>
    (size = "2rem", _event) => {
      if (!ACs.request.match(_event)) return size;
      return size === "2rem" ? "4rem" : size === "4rem" ? "1rem" : "2rem";
    }
);
