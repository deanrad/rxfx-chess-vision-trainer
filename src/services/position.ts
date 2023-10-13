import {
  createService,
  defaultBus as bus,
  ReducerProducer,
} from "@rxfx/service";

const initialState = {
  position: {
    // b7: "wR",
  },
};

const positionReducer: ReducerProducer<
  { piece: string; square: string },
  null,
  null,
  typeof initialState
> =
  ({ request }) =>
  (state = initialState, event) => {
    if (request.match(event)) {
      const { piece, square } = event.payload;

      return {
        position: {
          [square]: piece,
        },
      };
    }
    // else
    return state;
  };

const positionEffect = () => {};

export const positionService = createService(
  "position",
  bus,
  positionEffect,
  positionReducer
);
