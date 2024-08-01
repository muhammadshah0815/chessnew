# React Chess Game
## Note
This repository is a cleaned-up version of my original chess game project, named [chessGame](https://github.com/muhammadshah0815/chessGame), which is actively being developed with other collaborators. I created this repository to separate my work, clean up the codebase, and manage it more independently. If you wish to see the original workflow, feel free to navigate to that repository!

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Running the Game](#running-the-game)
- [Code Structure](#code-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This project is a simple yet functional React-based implementation of a chess game. It features a responsive UI, draggable pieces, and handles the complex rules of chess, including pawn promotion, en passant, castling, and checkmate detection.

## Features
- **Dynamic Chess Board**: Visual representation of the chessboard with all possible moves highlighted based on the selected piece.
- **Draggable Pieces**: Players can move pieces by dragging them across the board.
- **Turn-Based Gameplay**: Ensures that the players alternate turns, adhering to the rules of chess.
- **Move Validation**: Validates all moves according to the rules of chess, including special moves like castling and en passant.
- **State Management**: Uses React's `useState` hook to manage the game state, ensuring the UI updates reflect the latest game status.
- **Taken Pieces Display**: Shows pieces that have been captured during the game.

## Installation
To get started with this project, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-github-username/react-chess-game.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd chessnew
    ```

3. **Install the dependencies:**
    ```bash
    npm install
    ```

## Running the Game
To run the game on your local machine:

1. **Start the development server:**
    ```bash
    npm start
    ```

This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

## Code Structure
- `ChessBoard.js`: Contains the main game logic and UI rendering.
- `ChessBoard.css`: Provides styling for the chessboard and pieces.
- `pieceImages`: An object mapping chess pieces to their image files for easy access and rendering.

## Contributing
Contributions are welcome! If you have suggestions for improvements or bug fixes, please open an issue or a pull request.

## License
This project is open-sourced under the MIT license. See the `LICENSE` file for more details.
