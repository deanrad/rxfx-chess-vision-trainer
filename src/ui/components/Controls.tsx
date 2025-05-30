import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { useService } from "@rxfx/react";
import { DIFFICULTIES, controlsService } from "@src/services/controls";

export function Controls() {
  const { state } = useService(controlsService);

  return (
    <div className="controls">
      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="use-nb"
            data-testid="use-nb"
            isChecked={state.NB_ONLY}
            onChange={({ target }) =>
              controlsService.request({
                NB_ONLY: target.checked,
              })
            }
          />
          <FormLabel htmlFor="use-nb" mb="0" ml="2">
            Use only N,B (+{DIFFICULTIES.NB_ONLY})
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="hide-target"
            data-testid="hide-target"
            isChecked={state.HIDE_TARGET}
            onChange={({ target }) =>
              controlsService.request({
                HIDE_TARGET: target.checked,
              })
            }
          />
          <FormLabel htmlFor="hide-target" mb="0" ml="2">
            Hide Target Piece (+{DIFFICULTIES.HIDE_TARGET})
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="orientation"
            isChecked={state.ORIENTATION_BLACK}
            onChange={({ target }) =>
              controlsService.request({
                ORIENTATION_BLACK: target.checked,
              })
            }
          />
          <FormLabel htmlFor="orientation" mb="0" ml="2">
            Show as Black (+{DIFFICULTIES.ORIENTATION_BLACK})
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="hide-notation"
            data-testid="hide-notation"
            isChecked={state.NOTATION_HIDE}
            onChange={({ target }) =>
              controlsService.request({
                NOTATION_HIDE: target.checked,
              })
            }
          />
          <FormLabel htmlFor="hide-notation" mb="0" ml="2">
            Hide Notation (+{DIFFICULTIES.NOTATION_HIDE})
          </FormLabel>
        </FormControl>
      </div>

      <div className="control">
        <FormControl display="flex" alignItems="center">
          <Switch
            id="blindfold-mode"
            isChecked={state.BLINDFOLD_ON}
            onChange={({ target }) =>
              controlsService.request({
                BLINDFOLD_ON: target.checked,
              })
            }
          />
          <FormLabel htmlFor="blindfold-mode" mb="0" ml="2">
            Blindfold Mode (+{DIFFICULTIES.BLINDFOLD_ON})
          </FormLabel>
        </FormControl>
      </div>
    </div>
  );
}
