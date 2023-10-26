import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { defaultBus } from "@rxfx/service";
import {
  NOTATION_TOGGLE,
  BLINDFOLD_TOGGLE,
  ORIENTATION_TOGGLE,
} from "@src/events/controls";

export function Controls() {
  return (
    <div>
      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="hide-notation"
            data-testid="hide-notation"
            onChange={({ target }) =>
              defaultBus.trigger(NOTATION_TOGGLE(target.checked))
            }
          />
          <FormLabel htmlFor="hide-notation" mb="0" ml="2">
            Hide Notation
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="blindfold-mode"
            onChange={({ target }) =>
              defaultBus.trigger(BLINDFOLD_TOGGLE(target.checked))
            }
          />
          <FormLabel htmlFor="blindfold-mode" mb="0" ml="2">
            Blindfold Mode
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="orientation"
            onChange={({ target }) =>
              defaultBus.trigger(ORIENTATION_TOGGLE(target.checked))
            }
          />
          <FormLabel htmlFor="orientation" mb="0" ml="2">
            Show as Black
          </FormLabel>
        </FormControl>
      </div>
    </div>
  );
}
