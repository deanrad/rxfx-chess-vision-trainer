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
  events: {} as { type: "activate" },
};

export const trainer = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAlgOzKgdAK7boDGymAbuspAMRkXW0DaADALqKgAOA9rEwU+2biAAeiAIwAOAEz4pAFgDMcqQDYA7HK0BOFXo0AaEAE9pbJfgCsGo0pl69NpVqlyAvp9NosuAkYqGnp2LiQQfkFhUQjJBCU5ay0bQzYpKS0NQxkVUwsEKTYNfDYtNjlnFVyNKT0tbx8QbD4IODE-HDwxKKFMETF4gFoTc0QR718MLoJiIOZIHoE+gbjERPzLZJUs3Xq9OTknGUmQToD8eZCIJej+2NB4lQr8GS0ZJw0k2rYDzcKrPgtDsvvp9IcnDZTuc8PgoIQ4IJsFBbisHhJEDY6opakpXFo3Gpgf8ZFJ8GpKuo2NTtHIsY1PEA */
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
      },
    },
    predictableActionArguments: true,
  },

  {
    actions: {
      beginChallenge() {
        const piece = getRandomPiece();
        const square = getRandomSquare();
        positionService
          .send({
            piece,
            square,
          })
          .then(() => {
            const target = positionService.state.value.moves.target;

            const challenge = `How can you move a
             ${pronouncePiece(piece)} 
             from
             ${pronounceSquare(square)} 
             to ${pronounceSquare(target)}?`;

            say(challenge);
          });
      },
    },
  }
);
