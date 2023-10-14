import { createMachine } from "xstate";
import {
  getRandomPiece,
  getRandomSquare,
  positionService,
  pronouncePiece,
  pronounceSquare,
} from "../services/position";

import { say } from "@src/services/speech";

const schema = {
  events: {} as
    | { type: "activate" }
    | { type: "guess.correct" }
    | { type: "challenge.new" },
};

export const trainer = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAlgOzKgdAK7boDGymAbuspAMRkXW0DaADALqKgAOA9rEwU+2biAAeiAIwAOAEz4pAFgDMcqQDYA7HK0BOFXo0AaEAE9pbJfgCsGo0pl69NpVqlyAvp9NosuAkYqGnp2LiQQfkFhUQjJBCU5ay0bQzYpKS0NQxkVUwsEKTYNfDYtNjlnFVyNKT0tb18MHDx8KEI4QWwoOnbO-FI+VFQwcjCxKKFMETF41JtbeXs5JyUPVPzpBQyDJJti5bYVRpA-FoIwcR4AG396UgALdGvrsG6wfFwAd3GIyZjZogtPJ8DINGDqlZtDYZFJNoU5CV9rUNGw9ElgTZ0d4fCBsHwIHAxGcAhMBFMZnFEABaEzmGkpWwqOwpdyuAzY3Ek1rEILMSBk6LTWKgeKJeFFZIqLK6erolZ6GQnbmBcjBWgQQUUkUSRAqCqg4FODRJWpouQSqz4LTSk36fRyBU2ZXNAJtDqwLpQLUAqkIGx1RS1JSuLRuNQ2+Gw-BqSrqNgJ7RyAMuu4XK63Fqav7k32ioHqGMyMFlQyxpR6CVSa0yHTowy1XJaG04zxAA */
    id: "trainer",
    initial: "unactivated",
    schema,
    context: {},
    states: {
      unactivated: {
        on: {
          activate: "activated",
        },
      },
      activated: {
        always: "guessing",
      },
      guessing: {
        entry: ["beginChallenge"],
        on: {
          "guess.correct": "explained",
        },
      },
      explained: {
        on: { "challenge.new": "guessing" },
      },
    },
    predictableActionArguments: true,
  },

  {
    actions: {
      async beginChallenge() {
        const [piece, square] = [getRandomPiece(), getRandomSquare()];

        await positionService.send({
          piece,
          square,
        });

        const target = positionService.state.value.moves.target;

        say(`How can you move a
          ${pronouncePiece(piece)} 
          from
          ${pronounceSquare(square)} 
          to ${pronounceSquare(target)}?`);
      },
    },
  }
);
