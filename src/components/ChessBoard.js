import React, { useState } from 'react';
import './ChessBoard.css';

const initialBoardSetup = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieceImages = {
  'P': '/images/pw.svg', 'R': '/images/rw.svg', 'N': '/images/nw.svg', 'B': '/images/bw.svg', 'Q': '/images/qw.svg', 'K': '/images/kw.svg',
  'p': '/images/pb.svg', 'r': '/images/rb.svg', 'n': '/images/nb.svg', 'b': '/images/bb.svg', 'q': '/images/qb.svg', 'k': '/images/kb.svg'
};

const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('white');
  const [highlightedMoves, setHighlightedMoves] = useState([]);
  const [enPassant, setEnPassant] = useState(null);
  const [whiteTaken, setWhiteTaken] = useState([]);
  const [blackTaken, setBlackTaken] = useState([]);
  const [winner, setWinner] = useState(null);
  const [kingMoved, setKingMoved] = useState({ white: false, black: false });
  const [rookMoved, setRookMoved] = useState({
    white: { queenside: false, kingside: false },
    black: { queenside: false, kingside: false }
  });

  const isPathBlocked = (startRow, startCol, endRow, endCol, boardState) => {
    const dx = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    const dy = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    let x = startCol + dx;
    let y = startRow + dy;

    while (x !== endCol || y !== endRow) {
      if (boardState[y][x] !== '') return true;
      x += dx;
      y += dy;
    }

    return false;
  };

  const isValidMove = (piece, startRow, startCol, endRow, endCol, boardState) => {
    const dx = Math.abs(endCol - startCol);
    const dy = endRow - startRow;

    if (boardState[endRow][endCol] && ((piece.toUpperCase() === piece && boardState[endRow][endCol].toUpperCase() === boardState[endRow][endCol]) || 
                                  (piece.toLowerCase() === piece && boardState[endRow][endCol].toLowerCase() === boardState[endRow][endCol]))) {
      return false; // Cannot move to a square occupied by the same color piece
    }

    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        if (piece === 'P') { // White pawn
          if (startRow === 6 && endRow === 4 && dx === 0 && boardState[endRow][endCol] === '' && boardState[endRow + 1][endCol] === '') { // First move two squares
            return true;
          }
          if (startRow === 3 && endRow === 2 && Math.abs(startCol - endCol) === 1 && boardState[endRow][endCol] === '' && enPassant && enPassant.row === endRow && enPassant.col === endCol) { // En passant
            return true;
          }
          return (dy === -1 && dx === 0 && boardState[endRow][endCol] === '') || // Move forward
                 (dy === -1 && dx === 1 && boardState[endRow][endCol] !== ''); // Capture
        } else { // Black pawn
          if (startRow === 1 && endRow === 3 && dx === 0 && boardState[endRow][endCol] === '' && boardState[endRow - 1][endCol] === '') { // First move two squares
            return true;
          }
          if (startRow === 4 && endRow === 5 && Math.abs(startCol - endCol) === 1 && boardState[endRow][endCol] === '' && enPassant && enPassant.row === endRow && enPassant.col === endCol) { // En passant
            return true;
          }
          return (dy === 1 && dx === 0 && boardState[endRow][endCol] === '') || // Move forward
                 (dy === 1 && dx === 1 && boardState[endRow][endCol] !== ''); // Capture
        }
      case 'r': // Rook
        return (dx === 0 || Math.abs(dy) === 0) && !isPathBlocked(startRow, startCol, endRow, endCol, boardState);
      case 'n': // Knight
        return dx * Math.abs(dy) === 2;
      case 'b': // Bishop
        return dx === Math.abs(dy) && !isPathBlocked(startRow, startCol, endRow, endCol, boardState);
      case 'q': // Queen
        return (dx === 0 || Math.abs(dy) === 0 || dx === Math.abs(dy)) && !isPathBlocked(startRow, startCol, endRow, endCol, boardState);
      case 'k': // King
        if (dx <= 1 && Math.abs(dy) <= 1) return true; // Normal king move

        // Castling
        if (dx === 2 && dy === 0 && !kingMoved[turn]) {
          const kingside = endCol > startCol;
          const rookCol = kingside ? 7 : 0;
          const rookDest = kingside ? 5 : 3;
          const isPathClear = !isPathBlocked(startRow, startCol, startRow, rookCol, boardState);
          const canCastle = isPathClear && !isSquareAttacked(boardState, startRow, startCol, turn) && !isSquareAttacked(boardState, startRow, startCol + 1, turn) && !isSquareAttacked(boardState, startRow, endCol, turn);
          return canCastle;
        }
        break;
      default:
        return false;
    }
  };

  const isSquareAttacked = (boardState, row, col, attackerColor) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece && ((attackerColor === 'white' && piece.toUpperCase() === piece) || (attackerColor === 'black' && piece.toLowerCase() === piece))) {
          if (isValidMove(piece, r, c, row, col, boardState)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const findKing = (boardState, king) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (boardState[row][col] === king) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const moveResultsInCheck = (startRow, startCol, endRow, endCol) => {
    const tempBoard = board.map((r) => r.slice());
    const piece = tempBoard[startRow][startCol];
    tempBoard[startRow][startCol] = '';
    tempBoard[endRow][endCol] = piece;

    const kingPosition = findKing(tempBoard, turn === 'white' ? 'K' : 'k');
    if (!kingPosition) {
      return false; // If no king is found, cannot be in check (error case, handled by findKing)
    }
    return isSquareAttacked(tempBoard, kingPosition.row, kingPosition.col, turn === 'white' ? 'black' : 'white');
  };

  const getPossibleMoves = (piece, startRow, startCol) => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(piece, startRow, startCol, row, col, board) && !moveResultsInCheck(startRow, startCol, row, col)) {
          moves.push({ row, col });
        }
      }
    }

    // Add castling moves if the piece is a king and hasn't moved
    if (piece.toLowerCase() === 'k' && !kingMoved[turn]) {
      // Kingside castling
      if (!rookMoved[turn].kingside && !isPathBlocked(startRow, startCol, startRow, 7, board)) {
        if (!isSquareAttacked(board, startRow, startCol, turn) && !isSquareAttacked(board, startRow, startCol + 1, turn) && !isSquareAttacked(board, startRow, startCol + 2, turn)) {
          moves.push({ row: startRow, col: startCol + 2 });
        }
      }
      // Queenside castling
      if (!rookMoved[turn].queenside && !isPathBlocked(startRow, startCol, startRow, 0, board)) {
        if (!isSquareAttacked(board, startRow, startCol, turn) && !isSquareAttacked(board, startRow, startCol - 1, turn) && !isSquareAttacked(board, startRow, startCol - 2, turn)) {
          moves.push({ row: startRow, col: startCol - 2 });
        }
      }
    }

    return moves;
  };

  const isCheckmate = (color, boardState) => {
    const kingPosition = findKing(boardState, color === 'white' ? 'K' : 'k');
    if (!kingPosition) return false;

    const moves = getAllPossibleMoves(color, boardState);
    return moves.length === 0 && isSquareAttacked(boardState, kingPosition.row, kingPosition.col, color === 'white' ? 'black' : 'white');
  };

  const getAllPossibleMoves = (color, boardState) => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && ((color === 'white' && piece.toUpperCase() === piece) || (color === 'black' && piece.toLowerCase() === piece))) {
          moves.push(...getPossibleMoves(piece, row, col));
        }
      }
    }
    return moves;
  };

  const handleSquareClick = (row, col) => {
    if (selectedPiece && !winner) {
      const { piece, startRow, startCol } = selectedPiece;
      if (isValidMove(piece, startRow, startCol, row, col, board) && !moveResultsInCheck(startRow, startCol, row, col)) {
        const newBoard = board.map((r) => r.slice());
        newBoard[startRow][startCol] = '';

        // Handle castling move specifics
        if (piece.toLowerCase() === 'k' && Math.abs(startCol - col) === 2) {
          const kingside = col > startCol;
          const rookStartCol = kingside ? 7 : 0;
          const rookEndCol = kingside ? 5 : 3;
          newBoard[startRow][rookEndCol] = newBoard[startRow][rookStartCol];
          newBoard[startRow][rookStartCol] = '';
          setRookMoved({
            ...rookMoved,
            [turn]: { ...rookMoved[turn], [kingside ? 'kingside' : 'queenside']: true }
          });
        }

        // Track taken pieces
        if (board[row][col]) {
          if (turn === 'white') {
            setBlackTaken([...blackTaken, board[row][col]]);
          } else {
            setWhiteTaken([...whiteTaken, board[row][col]]);
          }
        }

        // Auto-queen for pawns
        if (piece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
          newBoard[row][col] = turn === 'white' ? 'Q' : 'q'; // Auto-queen
        } else {
          newBoard[row][col] = piece;
        }

        // Handle en passant capture
        if (piece.toLowerCase() === 'p' && enPassant && enPassant.row === row && enPassant.col === col) {
          newBoard[startRow][col] = '';
          if (turn === 'white') {
            setBlackTaken([...blackTaken, 'p']);
          } else {
            setWhiteTaken([...whiteTaken, 'P']);
          }
        }

        // Set en passant opportunities
        if (piece.toLowerCase() === 'p' && Math.abs(startRow - row) === 2) {
          setEnPassant({ row: (startRow + row) / 2, col });
        } else {
          setEnPassant(null);
        }

        setBoard(newBoard);
        setKingMoved({ ...kingMoved, [turn]: true });

        // Check if the move results in checkmate
        const opponent = turn === 'white' ? 'black' : 'white';
        if (isCheckmate(opponent, newBoard)) {
          setWinner(turn);
        } else {
          setTurn(turn === 'white' ? 'black' : 'white'); // Change turn
        }
      }
      setSelectedPiece(null);
      setHighlightedMoves([]);
    } else if (board[row][col] && ((turn === 'white' && board[row][col].toUpperCase() === board[row][col]) || (turn === 'black' && board[row][col].toLowerCase() === board[row][col]))) {
      setSelectedPiece({ piece: board[row][col], startRow: row, startCol: col });
      setHighlightedMoves(getPossibleMoves(board[row][col], row, col));
    }
  };

  const handleDragStart = (e, piece, row, col) => {
    if ((turn === 'white' && piece.toUpperCase() === piece) || (turn === 'black' && piece.toLowerCase() === piece)) {
      setSelectedPiece({ piece, startRow: row, startCol: col });
      setHighlightedMoves(getPossibleMoves(piece, row, col));
      e.dataTransfer.setDragImage(new Image(), 0, 0); // Disable default drag image
    } else {
      e.preventDefault(); // Prevent drag if it's not the player's turn
    }
  };

  const handleDragOver = (e, row, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; // Change cursor to move icon
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    handleSquareClick(row, col);
  };

  return (
    <div className="game-container">
      <h2>{turn === 'white' ? 'White' : 'Black'}'s Turn</h2>
      {winner && <h3>{winner} wins by checkmate!</h3>}
      <div className="taken-pieces">
        <div className="white-taken">
          <h3>White's Taken Pieces</h3>
          <div>{whiteTaken.map((piece, index) => <span key={index}><img src={pieceImages[piece]} alt={piece} className="small-piece" /></span>)}</div>
        </div>
        <div className="black-taken">
          <h3>Black's Taken Pieces</h3>
          <div>{blackTaken.map((piece, index) => <span key={index}><img src={pieceImages[piece]} alt={piece} className="small-piece" /></span>)}</div>
        </div>
      </div>
      <div className="chessboard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((piece, colIndex) => {
              const isHighlighted = highlightedMoves.some(move => move.row === rowIndex && move.col === colIndex);
              return (
                <div
                  key={colIndex}
                  className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {piece && <img
                    src={pieceImages[piece]}
                    alt={piece}
                    className={`piece ${selectedPiece && selectedPiece.startRow === rowIndex && selectedPiece.startCol === colIndex ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece, rowIndex, colIndex)}
                  />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;