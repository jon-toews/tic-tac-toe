import React, { Component } from 'react';
import './App.css';
import Board from './Board'
import GameInfo from './GameInfo'


class Game extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  componentDidUpdate() {
    if (this.state.xIsNext) return;
    setTimeout(() => this.AIaction(), 300)
  }

  AIaction() {
    // truncate history if user goes back in time
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    // create simplified current state object
    const currentState = {squares:squares,
                          stepNumber:history.length,
                          xIsNext:this.state.xIsNext}
    // find all empty cells
    const emptyCells = getEmptySquares(currentState.squares)
    if (emptyCells.length === 0) return;

    // calc minimax score value for all potential AI moves
    const possibleScores = emptyCells.map(cell => {
      const state = potentialState(currentState, cell);
      // minimax value of potential state
      const minimaxVal = minimax(state);
      return {score:minimaxVal, pos:cell}
    })
    // pick best move by selecting highest possible minimax score
    const sortedScores = possibleScores.sort((a,b) => (b.score - a.score))
    const bestMove = sortedScores[0].pos;

    squares[bestMove] = this.state.xIsNext ? 'X': 'O';

    this.setState ({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext:!this.state.xIsNext,
      stepNumber: history.length
    })
  }

  handleClick(i) {
    // disallow clicks on AI's turn
    if (!this.state.xIsNext) return;

    // truncate history if user goes back in time
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    // check if game is over or square already played
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X': 'O';

    this.setState ({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext:!this.state.xIsNext,
      stepNumber: history.length
    })
  }

  // jump to point in game history
  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <GameInfo history={history}
                winner={winner}
                stepNum={this.state.stepNumber}
                onClick={(move) => this.jumpTo(move)}
        />
      </div>
    );
  }
}
export default Game;


// ================== HELPER FUNCTIONS ======================

/* generate a potential future game state
 * takes in and returns a simplified game state with no history
 * param - state: simplified current state, pos: board square
 */
function potentialState(state, pos) {
  // create copy of state
  let nextState = JSON.parse(JSON.stringify(state));

  // populate square, then update turn
  nextState.squares[pos] = nextState.xIsNext ? "X":"O";
  nextState.xIsNext = !nextState.xIsNext;
  nextState.stepNumber++;

  return nextState;
}

/* Minimax algorithm calculates best possible move for AI player
 * https://mostafa-samir.github.io/Tic-Tac-Toe-AI/
 * param: current game state object - squares, xIsNext, stepNumber
 */
function minimax(state) {

  if (calculateWinner(state.squares)) {
    return score(state);
  }
  else {
    var stateScore;

    stateScore = state.xIsNext ? 1000: -1000;
    var availablePositions = getEmptySquares(state.squares);

    var possibleStates = availablePositions.map(pos => {
      return potentialState(state, pos)
    })

    possibleStates.forEach(function(nextState) {

      var nextScore = minimax(nextState);

      if(state.xIsNext) {
        if(nextScore < stateScore) {
          stateScore = nextScore;
        }
      }
      else {
        if(nextScore > stateScore) {
          stateScore = nextScore;
        }
      }
    });
    return stateScore;
    }
}

/* scoring function used in minimax algorithm
 * returns a score for a terminal game state
 * from the perspective of the AI player 'O'
 */
function score(state) {
  const result = calculateWinner(state.squares);
  if (result === 'X') {
    return -10;
  } else if (result === 'O') {
    return 10;
  } else {
    return 0;
  }
}

/* returns a list of all empty board cells that can be used in future moves
 */
function getEmptySquares(squares) {
  const eSquares = squares.map((item, index) => {
    if (item == null) return index;
  }).filter(item => item != undefined);

  return eSquares;
}

/* calculates if there is a winner for a given board
 * returns letter of winning player, 'draw', or null if no winner
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (getEmptySquares(squares).length === 0) {
    return "Draw";
  }
  return null;
}
