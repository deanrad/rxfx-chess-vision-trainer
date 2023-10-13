import {
  createService,
  defaultBus as bus,
  ReducerProducer,
} from "@rxfx/service";
import { Chess } from "chess.js";

const PIECES = "QRNB";
const RANKS = "12345678";
const FILES = "abcdefgh";
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const COLOR = "w";
export const pronounceSquare = (square) => `${square[0]}-${square[1]}`;

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

export const getRandomSquare = () => `${random(FILES)}${random(RANKS)}`;
export const getRandomPiece = () => `${COLOR}${random(PIECES)}`;

const initialState = {
  position: {
    // b7: "wR",
  },
  moves: {
    first: [],
    second: [],
    target: null,
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
      const firstMoves = movesOfSoloPiece(piece, square);
      const secondMoves = getSecondMoves(piece, square, firstMoves);
      const target = random(secondMoves);

      return {
        position: {
          [square]: piece,
        },
        moves: {
          first: firstMoves,
          second: secondMoves,
          target,
        },
      };
    }
    // else
    return state;
  };

const positionEffect = () => Promise.resolve();

export const positionService = createService(
  "position",
  bus,
  positionEffect,
  positionReducer
);

export const chessjs = new Chess();

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
