import {
  BehaviorSubject,
  createService,
  defaultBus,
  ReducerProducer,
} from "@rxfx/service";
import { NB_ONLY } from "@src/events/controls";
import { Chess } from "chess.js";
import { controlsService } from "./controls";

let PIECES = "QRNB";
const RANKS = "12345678";
const FILES = "abcdefgh";
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const COLOR = "w";
const chessjs = new Chess();
export const pronounceSquare = (square) => {
  const file = square[0].toUpperCase();
  const rank = square[1];
  return `${file} ${rank}`;
};

/* ChatGPT wrote this function for me, mostly ! */
export const pronouncePiece = ([_, abbrev]) => {
  const pieceAbbreviations = {
    K: "King",
    Q: "Queen",
    R: "Rook",
    N: "Knight",
    B: "Bishop",
  };

  return pieceAbbreviations[abbrev] || "Pawn";
};

export const squareColor = (square) => chessjs.squareColor(square);

export const getRandomSquare = () => `${random(FILES)}${random(RANKS)}`;
export const getRandomPiece = () => `${COLOR}${random(PIECES)}`;

export const currentPiece = new BehaviorSubject<string>("");

const initialState = {
  position: {},
  moves: {
    first: [],
    second: [],
    solutions: [],
  },
  target: null,
  puzzleTitle: null,
};

const positionReducer: ReducerProducer<
  {
    piece: string;
    square: string;
    setTitle?: boolean;
    expo?: true;
    final?: true;
  },
  null,
  null,
  typeof initialState
> =
  ({ request }) =>
  (state = initialState, event) => {
    if (request.match(event)) {
      const { piece, square, setTitle, expo, final } = event.payload;
      const firstMoves = movesOfSoloPiece(piece, square);
      const secondMoves = getSecondMoves(piece, square, firstMoves);
      const target = expo ? state.target : random(secondMoves);

      const solutions = firstMoves.filter((from) =>
        movesOfSoloPiece(piece, from).includes(target)
      );

      const { HIDE_TARGET, ORIENTATION_BLACK } = controlsService.state.value;

      const newTitle = setTitle
        ? `Move ${pronouncePiece(piece)} from ${square} to ${target}`
        : state.puzzleTitle;

      return {
        position: {
          [square]: piece,
          ...(final || HIDE_TARGET
            ? {}
            : { [target]: `${ORIENTATION_BLACK ? "w" : "b"}P` }),
        },
        moves: {
          first: firstMoves,
          second: secondMoves,
          solutions,
        },
        target,
        puzzleTitle: newTitle,
      };
    }
    // else
    return state;
  };

const positionEffect = () => Promise.resolve();

export const positionService = createService(
  "position",
  positionEffect,
  positionReducer
);

export function isSolution(guess) {
  const { solutions } = positionService.state.value.moves;
  return solutions.includes(guess);
}

function movesOfSoloPiece(piece, square) {
  const [color, type] = piece;

  const chessjs = new Chess();
  chessjs.clear();
  chessjs.put({ type: type.toLowerCase(), color }, square);
  return chessjs.moves({ square, verbose: true }).map((m) => m.to);
}

function getSecondMoves(piece, initialSquare, firstMoves) {
  return firstMoves
    .reduce((all, square) => {
      const nextMoves = movesOfSoloPiece(piece, square);
      return [...all, ...nextMoves];
    }, [])
    .filter((m) => m !== initialSquare)
    .filter((m) => !firstMoves.includes(m))
    .filter((value, index, array) => array.indexOf(value) === index);
}

positionService.state.subscribe(console.log);
controlsService.state.subscribe((state) => {
  PIECES = state.NB_ONLY ? "NB" : "QRNB";
});
