const Gameboard = (() => {
    let gameboard = [
        ["", "", ""], 
        ["", "", ""], 
        ["", "", ""]
    ];


  

    const resetGameboard = () => {
        for (let row = 0; row < gameboard.length; row++) {
            for (let col = 0; col < gameboard[row].length; col++) {
                gameboard[row][col] = "";
            }
        }
        createBoard();
    }




    const markBoard = (row, col, mark) => {
      if(gameboard[row][col] === "") {
        gameboard[row][col] = mark;
        console.log(gameboard)
        markPageBoard(row, col, mark)
        return true;
      }
      return false;
    }

    const createBoard = () => {
        const gameboardElement = document.querySelector('.game-board');

        while (gameboardElement.firstChild) {
            gameboardElement.removeChild(gameboardElement.firstChild);
        }

        gameboard.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {

        const squareDiv = document.createElement("div")
        squareDiv.classList.add("square");
        squareDiv.id = `square-${rowIndex}-${colIndex}`


        squareDiv.dataset.row = rowIndex;
        squareDiv.dataset.col = colIndex;
        squareDiv.addEventListener("click", handleSquareClick);

            gameboardElement.appendChild(squareDiv)
            });
        })
    }

        const handleSquareClick = (event) => {
            const squareDiv = event.target;
            const row = parseInt(squareDiv.dataset.row, 10);
            const col = parseInt(squareDiv.dataset.col, 10);
          
            Game.takeTurn(row, col);

        } 

    const markPageBoard = (row, col, mark) => {
        const squareDiv = document.querySelector(`#square-${row}-${col}`);
        if(squareDiv){
            squareDiv.textContent = mark;
        }
    }

    const getGameboard = () => gameboard

    const disableAllSquares = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.removeEventListener("click", handleSquareClick);
            
        
        });
    }
    
    const enableAllSquares = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
        square.addEventListener("click", handleSquareClick);
        });
    }

    return {
        createBoard,
        resetGameboard,
        getGameboard,
        markBoard,
        disableAllSquares,
        enableAllSquares
    }
})();

Gameboard.createBoard()


const Game = (() => {
    let currentPlayer = 'X';
    
    let gameIsOver = false;

    let inputExists = true;

    const submitPlayerbtn = document.querySelectorAll(".player-name-btn")

    const players = {
        X: { name: 'Player 1', mark: 'X', score: 0 },
        O: { name: 'Player 2', mark: 'O', score: 0 }
    };


        submitPlayerbtn.forEach(btn => {
        btn.addEventListener("click", function(){
       
        const container = btn.closest(".player-container")

        const playerMark = container.getAttribute("data-player");

        const input = container.querySelector(".player-input");
        const label = container.querySelector(".player-name");
        
        inputExists = false;

        if (input && label) {
            players[playerMark].name = input.value.trim()
            label.textContent = `${input.value}'s current score is: ${players[playerMark].score}` ;
        }


        while(container.children.length > 1){
            container.removeChild(container.children[1])
            
        }
       


        })
    })

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    const takeTurn = (row, col) => {
        if (gameIsOver) return
        const mark = players[currentPlayer].mark;
        const winner = checkForWinner(Gameboard.getGameboard());
        console.log(players['X'].score)
    if(Gameboard.markBoard(row, col, mark)) {

        const winner = checkForWinner(Gameboard.getGameboard());
                handleGameWin(winner) 
            if(players['X'].score === 2){
                gameIsOver = true
                console.log (`${players['X'].name} wins the game!`)
                Gameboard.disableAllSquares();
            } else if (players['O'].score === 2){
                gameIsOver = true
                console.log (`${players['O'].name} wins the game!`)
                Gameboard.disableAllSquares();
            } else if (winner){
                if (winner === 'X' || winner === 'O') { 
                    if (players['X'].score < 2 && players['O'].score < 2){
                       
                    console.log(`${players[winner].name} is the winner of this round!`);                   
                    console.log(players)
                    Gameboard.disableAllSquares();
                    
                    }    
            }   else if(winner === true){
                console.log("Its a tie!")
                Gameboard.disableAllSquares();
            }
            
            
        } else {
            switchPlayer()
        }
    }
}

    const checkForWinner = (board) => {
        const winningLine = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]], 
            [[2, 0], [2, 1], [2, 2]], 
            [[0, 0], [1, 0], [2, 0]], 
            [[0, 1], [1, 1], [2, 1]], 
            [[0, 2], [1, 2], [2, 2]], 
            [[0, 0], [1, 1], [2, 2]], 
            [[0, 2], [1, 1], [2, 0]]
        ];
    
        for (let i = 0; i < winningLine.length; i++) {
            const [[row1, col1], [row2, col2], [row3, col3]] = winningLine[i];
            if (board[row1][col1] && board[row1][col1] === board[row2][col2] && board[row1][col1] === board[row3][col3]) {
                return board[row1][col1];
                }
        }
        
        if (checkForTie()){
            return true;
        }

        return false;
    }


    function updateScoreLabel(playerMark) {
        const container = document.querySelector(`.player-container[data-player="${playerMark}"]`);
        const label = container.querySelector(".player-name");
        const player = players[playerMark];
        label.textContent = `${player.name}'s current score is: ${player.score}`;
    }

        function handleGameWin(winnerMark) {
        if (players[winnerMark]) {     
            players[winnerMark].score++;
            updateScoreLabel(winnerMark);
        } 
    }

    const checkForTie = () =>{
        const board = Gameboard.getGameboard()
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if(board[row][col] === ""){
                    return false;
                }
            }
        }
        console.log("Its a tie!")
        return true
    }

    const resetLabels = () => {
        const playerContainers = document.querySelectorAll('.player-container');
        playerContainers.forEach(container => {
            const playerMark = container.getAttribute("data-player");
            const label = container.querySelector(".player-name");
            if (playerMark === 'X') {
                players[playerMark].name = "Player 1: "
                label.textContent = `${players['X'].name}`;
                const newInput = document.createElement("input")
                newInput.classList.add("player-input")
                newInput.setAttribute("type", "text")
                newInput.setAttribute("name", "first-player")
                newInput.setAttribute("id", "first-player")
                const newBtn = document.createElement("button")
                newBtn.classList.add("player-one-submit")
                newBtn.classList.add("player-name-btn")
                newBtn.setAttribute("type", "button")
                newBtn.textContent = "Submit"
                container.appendChild(newInput)
                container.appendChild(newBtn)

            } else if (playerMark === 'O') {
                players[playerMark].name = "Player 2: "
                label.textContent = `${players['O'].name}`;
                const newInput = document.createElement("input")
                newInput.classList.add("player-input")
                newInput.setAttribute("type", "text")
                newInput.setAttribute("name", "second-player")
                newInput.setAttribute("id", "second-player")
                const newBtn = document.createElement("button")
                newBtn.classList.add("player-two-submit")
                newBtn.classList.add("player-name-btn")
                newBtn.setAttribute("type", "button")
                newBtn.textContent = "Submit"
                container.appendChild(newInput)
                container.appendChild(newBtn)
            }
        });
        enableSubmitBtns();
    }


    const enableSubmitBtns = () => {
        const submitPlayerbtn = document.querySelectorAll(".player-name-btn");
    
        submitPlayerbtn.forEach(btn => {
            btn.addEventListener("click", function() {
                const container = btn.closest(".player-container");
                const playerMark = container.getAttribute("data-player");
                const input = container.querySelector(".player-input");
                const label = container.querySelector(".player-name");
    
                inputExists = false;
    
                if (input && label) {
                    players[playerMark].name = input.value.trim();
                    label.textContent = `${input.value}'s current score is: ${players[playerMark].score}`;
                }
    
                while (container.children.length > 1) {
                    container.removeChild(container.children[1]);
                }
            });
        });
    };
    
    enableSubmitBtns();



        let playAgainBtn = document.querySelector(".play-again-btn")
        playAgainBtn.addEventListener("click", function(){
            if(gameIsOver == false){
            Gameboard.resetGameboard()
            Gameboard.enableAllSquares()
            } else {
            return
        }

    })


        let resetBtn = document.querySelector(".reset-btn")
        resetBtn.addEventListener("click", function(){


            if(inputExists){
            Gameboard.resetGameboard()
            Gameboard.enableAllSquares()
            } else {
            inputExists == false
            Gameboard.resetGameboard()
            Gameboard.enableAllSquares()
            resetLabels();
            }

        
        })

    return{
        takeTurn,
    }


})();








