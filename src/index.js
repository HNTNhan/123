import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button id={props.id} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                id={'sq'+i}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        let squares = [];
        for (let i=0; i < 3; i++){
            for (let j = i*3; j < (i+1)*3; j++){
                squares = squares.concat(this.renderSquare(j));
            }
            rows = rows.concat(<div className="board-row">{squares}</div>);
            squares = [];
        }
        return (
            <div>{rows}</div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            position: [],
            asc: true,
        }
    }

    handleClick(i) {
        if(document.getElementById(this.state.stepNumber).className === 'button-active'){
            document.getElementById(this.state.stepNumber).className = 'button';
        }
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const position = this.state.position.slice(0, this.state.stepNumber);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            position: position.concat(i),
        });
    }

    jumpTo(step) {
        const move = document.getElementsByClassName('button-active');
        if(move.length){
            move[0].className = 'button';
        }

        const sq = document.getElementsByClassName('square-win');
        if(sq.length){
            for (let j = sq.length-1; j >= 0; j--) {
                sq[j].className = 'square';
            }
        }

        document.getElementById(step).className = 'button-active';
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            if(this.state.asc){
                const  asc = move ?
                    'Go to move #' + move + (move%2 ? ' X: ' : ' O: ') +
                    (this.state.position[move - 1]%3+1) + ', ' + parseInt(this.state.position[move - 1]/3+1):
                    'Go to game start';
                return (
                    <li key={move}>
                        <button id={move} className="button" onClick={() => this.jumpTo(move)}>{asc}</button>
                    </li>
                )
            } else {
                const desc = (history.length-1-move) ?
                    'Go to move #' + (history.length-move) + (move%2 ? ' X: ' : ' O: ') +
                    (this.state.position[history.length-move-2]%3+1) + ', ' +
                    parseInt(this.state.position[history.length-move-2]/3+1):
                    'Go to game start';
                return (
                    <li key={history.length-1-move}>
                        <button
                            id={history.length-1-move}
                            className="button"
                            onClick={() => this.jumpTo(history.length-1-move)}>{desc}</button>
                    </li>
                )
            }
        });

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
            document.getElementById("sq"+winner[0]).className = 'square-win';
            document.getElementById("sq"+winner[1]).className = 'square-win';
            document.getElementById("sq"+winner[2]).className = 'square-win';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            if(this.state.stepNumber === 9) status = 'Draw';
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-info">
                    <button onClick={() => this.setState({asc: true})}>Ascending</button>
                    <button onClick={() => this.setState({asc: false})}>Descending</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
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
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}