document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orchid',
        'aquamarine',
        'hotpink',
        'violet',
        'lightskyblue'
    ]

    // Tetrominoes

    // L shape

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];


    // Z shape

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    // T shape

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    // O shape

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    // I shape

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]

    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];





    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select a tetromino

    let random = Math.floor(Math.random() * theTetrominoes.length);
    console.log(random);



    let current = theTetrominoes[random][0];

    // draw the first rotation 

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }


    // draw();

    // undraw a tetromino

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })

    }


    // make the tetromino move down every second

    // timerId = setInterval(moveDown, 500);

    //assign functions to keyCodes

    function control(e) {
        if (e.keyCode === 37) {
            //move left
            moveLeft();
        } else if (e.keyCode === 38) {
            //rotate
            rotate();
        } else if (e.keyCode === 39) {
            //move down
            moveRight();
        } else if (e.keyCode === 40) {
            //move down faster
            moveDown();
        }
    }
    document.addEventListener('keyup', control);



    // move down function

    function moveDown() {
        undraw()
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze function

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left unless it is at the edge or there is a blockage


    function moveLeft() {
        undraw();

        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();

    }

    // move the tetromino right unless it is at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);


        if (!isAtRightEdge) {
            currentPosition += 1;

        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }


    // rotate the tetromino

    function rotate() {
        undraw();

        currentRotation++;
        if (currentRotation === current.length) {
            // if the current rotation gets to 4, make it go back to begining and start rotating from 0 again
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }


    // show next tetromino in mini-grid

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;


    // the tetrominoes without rotation

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //L
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //Z
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //T
        [0, 1, displayWidth, displayWidth + 1], //O
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //I
    ];


    // display the shape in mini-grid display

    function displayShape() {

        // remove any trace of tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    // adding functionality to the button

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 500);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })


    // add score function

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    // game over

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End';
            clearInterval(timerId);
        }
    }







});