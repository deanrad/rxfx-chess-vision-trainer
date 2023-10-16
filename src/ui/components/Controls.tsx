import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

import { defaultBus, createEvent } from "@rxfx/service";

defaultBus.spy(({ type, payload }) => console.log(type, payload));

export const BLINDFOLD_TOGGLE = createEvent<boolean>("control/blindfold");

export function Controls() {
  return (
    <div>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="blindfold-mode" mb="0">
          Blindfold Mode
        </FormLabel>
        <Switch
          id="blindfold-mode"
          onChange={({ target }) =>
            defaultBus.trigger(BLINDFOLD_TOGGLE(target.checked))
          }
        />
      </FormControl>
    </div>
  );
}
