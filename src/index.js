import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button 
      className={className}
      onClick={props.onClick}
      >
      {props.value}
    </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      const winLine = this.props.winLine;
        return (
            <Square
              key={"square " + i}
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              highlight={winLine && winLine.includes(i)}
              />
        );
    }

    renderSquares(n) {
        let squares = [];
        for (let i = n; i < n + 3; i++) {
          squares.push(this.renderSquare(i));
        }
        return squares;
      }

      renderRows(i) {
        return (
          <div className="board-row">
            {this.renderSquares(i)}
          </div>
        );
      }
      
    render() {
        return (
          <div className="board">
            {this.renderRows(0)}
            {this.renderRows(3)}
            {this.renderRows(6)}
          </div>
        );
      }
    }

  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history: [{
                squares: Array(9).fill(null),
                xScore: 0,
                oScore: 0,
              }],
              stepNumber: 0,
              xIsNext: true,
          };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
      const header = <h1>React-Tac-Toe</h1>;
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winInfo = calculateWinner(current.squares);
      const winner = winInfo.winner;

      const moves = history.map((step, move) => {
          const desc = move ?
          'go to move #' + move :
          'restart game'

      if (this.state.stepNumber === 0) {
        return (
          <div></div>
        )
      }
         else {
          return (
              <li key={move}>
                  <button className="btn-history" onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
          )
         }
      });

      let status;
      if (winner) {
        status = "Winner: " + winner +
        " - in " + this.state.stepNumber + " moves!";
      } 
      else if (this.state.stepNumber === 9 && winner === null) {
        status = "Draw: no winner"
      }
      else {
        status = "Next Player: " + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div>{header}</div>
          
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winLine={winInfo.line}
          />
          
          {/* <div className="scores">
            <p>Player X: {this.state.xScore}</p>
            <p>Player Y: {this.state.oScore}</p>
          </div> */}
          
        
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
      
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root'),
  );
  
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
        return {
         winner: squares[a],
         line: lines[i],
        };
      }
    }
    return {
      winner: null,
    };
  }