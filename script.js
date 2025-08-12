const board = document.getElementById('board');
const winnerText = document.getElementById('winner');
const nameInput = document.getElementById('nameInput');
let currentPlayer = 'X';
let cells = Array(9).fill(null);
let playMode = '';
let playerNames = { X: 'Player X', O: 'Player O' };

function startGame(mode) {
  playMode = mode;
  if (mode === 'friend') {
    nameInput.style.display = 'flex';
  } else {
    playerNames = { X: 'You', O: 'Computer' };
    restartGame();
  }
}

function startFriendGame() {
  const name1 = document.getElementById('player1Name').value.trim();
  const name2 = document.getElementById('player2Name').value.trim();
  if (name1 && name2) {
    playerNames.X = name1;
    playerNames.O = name2;
    nameInput.style.display = 'none';
    restartGame();
  } else {
    alert("Please enter both names.");
  }
}

function createBoard() {
  board.innerHTML = '';
  cells.forEach((cell, i) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.addEventListener('click', () => makeMove(i));
    div.textContent = cells[i] || '';
    board.appendChild(div);
  });
}

function makeMove(index) {
  if (cells[index] || checkWinner()) return;
  cells[index] = currentPlayer;
  createBoard();

  const result = checkWinner();
  if (result?.winner) {
    winnerText.textContent = `${playerNames[result.winner]} Wins!`;
    highlightWinningCells(result.line);
  } else if (!cells.includes(null)) {
    winnerText.textContent = "It's a Draw!";
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (playMode === 'computer' && currentPlayer === 'O') {
      setTimeout(computerMove, 400);
    }
  }
}

function highlightWinningCells(indices) {
  const cellElements = document.querySelectorAll('.cell');
  indices.forEach(index => {
    cellElements[index].classList.add('winning-cell');
  });
}

function computerMove() {
  const bestMove = getBestMove();
  makeMove(bestMove);
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  cells.forEach((cell, i) => {
    if (cell === null) {
      cells[i] = 'O';
      let score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });
  return move;
}

function minimax(board, depth, isMaximizing) {
  const result = checkWinner();
  if (result?.winner === 'O') return 10 - depth;
  if (result?.winner === 'X') return depth - 10;
  if (!board.includes(null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    board.forEach((cell, i) => {
      if (cell === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((cell, i) => {
      if (cell === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    });
    return best;
  }
}

function checkWinner() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of winConditions) {
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] };
    }
  }
  return null;
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  winnerText.textContent = '';
  createBoard();
}
