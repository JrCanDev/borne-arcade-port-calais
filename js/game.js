function emulateArrowClick(direction) {
    switch (direction) {
        case 'up':
            simulateKeyPress(38); // ArrowUp
            break;
        case 'left':
            simulateKeyPress(37); // ArrowLeft
            break;
        case 'down':
            simulateKeyPress(40); // ArrowDown
            break;
        case 'right':
            simulateKeyPress(39); // ArrowRight
            break;
    }
}

function updateHighScore(gamename, score) {
    const highScore = localStorage.getItem(gamename);
    if (highScore === null || score > highScore) {
        localStorage.setItem(gamename, score);
    }
}

function updateScore(gamename, score) {
    document.getElementById("score").innerHTML = score;

    highscore = document.getElementById("highscore").innerHTML;
    if (score > highscore) {
        document.getElementById("highscore").innerHTML = score;
        updateHighScore(gamename, score);
    }
}

function initScore(gamename) {
    const highScore = localStorage.getItem(gamename);
    if (!highScore) {
        localStorage.setItem(gamename, 0);
    }
    document.getElementById("highscore").innerHTML = highScore;
    document.getElementById("score").innerHTML = 0;
}