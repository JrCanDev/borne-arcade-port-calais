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

function getHighScore(gamename) {
    return parseInt(localStorage.getItem(gamename));
}

function setHighScore(gamename, score) {
    localStorage.setItem(gamename, score);
    document.getElementById("highscore").innerHTML = score;
}

function getScore() {
    return parseInt(document.getElementById("score").innerHTML);
}

function setScore(score) {
    document.getElementById("score").innerHTML = score;
}

function updateScore(gamename, score) {
    setScore(score);

    const highScore = getHighScore(gamename);
    if (!highScore || score > highScore) {
        setHighScore(gamename, score);
    }
}

function initScore(gamename) {
    const highScore = getHighScore(gamename);
    setHighScore(gamename, highScore ? highScore : 0);
    setScore(0);
}