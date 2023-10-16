import { ToggleSlider } from "react-toggle-slider";

import { defaultBus } from "@rxfx/service";
import { NOTATION_TOGGLE, BLINDFOLD_TOGGLE } from "@src/events/controls";

export function Controls() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ToggleSlider
          onToggle={(state) => defaultBus.trigger(NOTATION_TOGGLE(state))}
        />
        <label htmlFor="blindfold-mode">&nbsp;Hide Notation</label>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ToggleSlider
          onToggle={(state) => defaultBus.trigger(BLINDFOLD_TOGGLE(state))}
        />
        <label htmlFor="blindfold-mode">&nbsp;Blindfold Mode</label>
      </div>
    </div>
  );
}
