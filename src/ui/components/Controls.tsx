import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { defaultBus } from "@rxfx/service";
import {
  NOTATION_HIDE,
  BLINDFOLD_ON,
  ORIENTATION_BLACK,
  NB_ONLY,
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
              defaultBus.trigger(NOTATION_HIDE(target.checked))
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
              defaultBus.trigger(BLINDFOLD_ON(target.checked))
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
              defaultBus.trigger(ORIENTATION_BLACK(target.checked))
            }
          />
          <FormLabel htmlFor="orientation" mb="0" ml="2">
            Show as Black
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="use-nb"
            data-testid="use-nb"
            onChange={({ target }) =>
              defaultBus.trigger(NB_ONLY(target.checked))
            }
          />
          <FormLabel htmlFor="use-nb" mb="0" ml="2">
            Use only N,B
          </FormLabel>
        </FormControl>
      </div>
    </div>
  );
}
