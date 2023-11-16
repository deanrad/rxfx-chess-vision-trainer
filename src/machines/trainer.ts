import { createMachine, interpret } from "xstate";

import {
  getRandomPiece,
  getRandomSquare,
  positionService,
  pronouncePiece,
  pronounceSquare,
} from "@src/services/position";

import { saveTimeLog, timeLogService } from "@src/services/timeLog";
import { say } from "@src/effects/speech";

const schema = {
  events: {} as
    | { type: "activate" }
    | { type: "guess.correct" }
    | { type: "challenge.new" },
};

const trainerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAlgOzKgdAK7boDGymAbuspAMRkXW0DaADALqKgAOA9rEwU+2biAAeiAIwAOAEz4pAFgDMcqQDYA7HK0BOFXo0AaEAE9pbJfgCsGo0pl69NpVqlyAvp9NosuAkYqGnp2LiQQfkFhUQjJBCU5ay0bQzYpKS0NQxkVUwsEKTYNfDYtNjlnFVyNKT0tb18MHDx8KEI4WHQAIwAbMDp2zvxSPlRUMHIwsSihTBExeNqpfHKbFzs5JzY880RXUqlUtjKPDXVDDUaQPxaCMHEeXv96UgALdF7+7Bh8XAB3aYRWYxRaIGRaFSKNguAxKWROPRKfKIdQ2UrZGQaVJHJxyGwNa7YPgQOBiW4BGYCOYLOKIAC0Jj2CHpKVsKjsqjcymxRmuFNaxCCzEgVOi81ioHiiRRhSsqxUWV09T0ci2ehk-OaAXwwpCEDFNMlEkQKgq+AhMic5yUtRhcllRWSivO+n0aqcNi1LwIQ1gXT6YENoLpCFc6KUVltjkyUhUGhkjo8pW2WPWbkM3ru+AeTxeBuB1JDUsQOhW1SxZUMaiSeiTqwhlTkl1kish3m8QA */
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
        always: "guessable",
      },
      guessable: {
        entry: ["beginChallenge"],
        on: {
          "guess.correct": "explained",
        },
      },
      explained: {
        entry: ["logTime"],
        on: { "challenge.new": "guessable" },
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
          setTitle: true,
        });

        const { target } = positionService.state.value;

        await say(`How can you move a
          ${pronouncePiece(piece)} 
          from
          ${pronounceSquare(square)} 
          to ${pronounceSquare(target)}?`);

        timeLogService.request();
      },
      logTime() {
        timeLogService.cancelCurrent();
        // TODO include the state of the controls in the time log
        saveTimeLog(timeLogService.state.value);
      },
    },
  }
);

export const trainer = interpret(trainerMachine);
trainer.start();
