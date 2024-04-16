const pixelSize = 1000;
const pieceSize = 150;
const puzzleSizeWidth = 5;
const puzzleSizeHeight = 3;

let timeToSolve = NaN;
let gameOver = false;
let score = Infinity;
let highscore = parseInt(localStorage.getItem("puzzle")) || 86399000;

function updateHighscoreDisplay() {
    let prettyTimeHighscore = new Date(highscore).toISOString().substr(11, 8);
    
    document.getElementById("highscore").innerHTML = prettyTimeHighscore;
}

let puzzle = new Image();
puzzle.src = "puzzle.jpg";
puzzle.onload = () => {
  const background = new headbreaker.Canvas("puzzle", {
    width: pixelSize,
    height: pixelSize,
    pieceSize: pieceSize,
    proximity: pieceSize / puzzleSizeWidth,
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
    horizontalPiecesCount: puzzleSizeWidth,
    verticalPiecesCount:puzzleSizeHeight,
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
      puzzle.style.backgroundImage = "url('puzzle.jpg')";
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
  }
}, 100);

updateHighscoreDisplay()
document.getElementById("score").innerHTML = "00:00:00";