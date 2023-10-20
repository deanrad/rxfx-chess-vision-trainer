import {
  createService,
  ReducerProducer,
} from "@rxfx/service";
import { Chess } from "chess.js";

const PIECES = "QRNB";
const RANKS = "12345678";
const FILES = "abcdefgh";
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const COLOR = "w";
const chessjs = new Chess();
export const pronounceSquare = (square) => {
  const file = square[0] === "a" ? "ae" : square[0];
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

const initialState = {
  position: {
    // b7: "wR",
  },
  moves: {
    first: [],
    second: [],
    solutions: [],
  },
  target: null,
  puzzleTitle: null,
};

const positionReducer: ReducerProducer<
  { piece: string; square: string, setTitle?: boolean },
  null,
  null,
  typeof initialState
> =
  ({ request }) =>
  (state = initialState, event) => {
    if (request.match(event)) {
      const { piece, square, setTitle } = event.payload;
      const firstMoves = movesOfSoloPiece(piece, square);
      const secondMoves = getSecondMoves(piece, square, firstMoves);
      const target = random(secondMoves);

      const solutions = firstMoves.filter((from) =>
        movesOfSoloPiece(piece, from).includes(target)
      );

            const newTitle = setTitle
        ? `Move ${pronouncePiece(piece)} from ${square} to ${target}`
        : state.puzzleTitle;

      return {
        position: {
          [square]: piece,
        },
        moves: {
          first: firstMoves,
          second: secondMoves,
          solutions,
        },
        target,
        puzzleTitle: newTitle
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
