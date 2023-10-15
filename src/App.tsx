import "./App.css";
import { Board as ChessBoard } from "./ui/components/Board";

function App() {
  return (
    <>
      <h1>Chess Vision Trainer</h1>
      <ChessBoard />
      <p>
        Instructions: With sound on, and not looking at the board, tap or click
        to hear a challenge of how to move a piece. Then without looking at the
        board, decide upon, then look at the board and click the square the
        piece must first move to in order to reach the target. For a new
        challenge, click again! For extra credit, figure out the color of the
        intermediate square!
      </p>
    </>
  );
}

export default App;
