let puzzle = new Image();
puzzle.src = "puzzle.png";
puzzle.onload = () => {
  const background = new headbreaker.Canvas("puzzle", {
    width: 1000,
    height: 1000,
    pieceSize: 150,
    proximity: 150 / 3,
    borderFill: 0,
    strokeWidth: 2,
    lineSoftness: 0.0,
    image: puzzle,
    outline: new headbreaker.outline.Rounded(),
    preventOffstageDrag: true,
    fixed: true,
  });

  background.adjustImagesToPuzzleHeight();
  background.autogenerate({
    horizontalPiecesCount: 4,
    verticalPiecesCount: 4,
  });
  background.shuffle(0.8);

  background.draw();

  document.getElementById("restart-button").addEventListener("click", () => {
    if (gameOver) {
      return;
    }
    background.shuffle(0.8);
    background.redraw();
    timeToSolve = NaN;
    score = Infinity;
    document.getElementById("score").innerHTML = "00:00:00";
  });

  background.onConnect(() => {
    if (isNaN(timeToSolve)) {
      timeToSolve = new Date().getTime();
    }
  });

  background.attachSolvedValidator();
  background.onValid(() => {
    gameOver = true;
    if (score < highscore) {
      highscore = score;
      localStorage.setItem("puzzle", score);
    }
    updateHighscoreDisplay();
    let puzzle = document.getElementById("puzzle");
    puzzle.style.opacity = 0;

    setTimeout(() => {
      background.clear();
      puzzle.style.opacity = 1;
      puzzle.style.backgroundImage = "url('puzzle.png')";
    }, 1000);

    setTimeout(() => {
      showGameOver();
    }, 3000);
  });
};

setInterval(() => {
  if (!isNaN(timeToSolve) && !gameOver) {
    delta = new Date().getTime() - timeToSolve;
    score = delta;
    let prettyTime = new Date(delta).toISOString().substr(11, 8);
    document.getElementById("score").innerHTML = prettyTime;
  }

  if (score < highscore) {
    localStorage.setItem("puzzle", score);
    let prettyTime = new Date(score).toISOString().substr(11, 8);
  }
}, 100);
