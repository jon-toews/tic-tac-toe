import React, { Component } from 'react';


class GameInfo extends Component {
  // determines which square was played between two boards
  findSquarePlayed(history, move) {
    const prev = (move > 0) ? history[move-1].squares : Array(9);
    const current = history[move].squares;

    return current.findIndex((square, index) => {
      return square !== prev[index]
    });
  }

  render() {
    const history = this.props.history;
    // status text
    let status;
    if (this.props.winner) {
      status = 'Winner: ' + this.props.winner;
    } else {
      status = 'Next player: ' + ((this.props.stepNum % 2) ? 'O - AI':'X - Human');
    }

    // create array of game moves
    const moves = history.map((step, move) => {
      // find square played
      const squarePlayed = this.findSquarePlayed(history, move)
      // transform cell value to coordinates
      const coords = [Math.floor(squarePlayed / 3) + 1, squarePlayed % 3 + 1];
      let player = (move % 2) ? 'X' : 'O';

      const desc = move ? player + ' Move (' + coords + ")" : 'Game start';

      return(
        <li key={move}>
          <a className={(move === this.props.stepNum) ? 'current-move':''}
            href="#" onClick={() => this.props.onClick(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    );
  }
}

export default GameInfo;
