const puzzles = [
  {
    pixelSize: 1000,
    pieceSize: 200,
    puzzleSizeWidth: 4,
    puzzleSizeHeight: 3,
    image: "img/puzzle1",
  },
  {
    pixelSize: 1000,
    pieceSize: 165,
    puzzleSizeWidth: 5,
    puzzleSizeHeight: 4,
    image: "img/puzzle2",
  },
  {
    pixelSize: 1000,
    pieceSize: 150,
    puzzleSizeWidth: 5,
    puzzleSizeHeight: 5,
    image: "img/puzzle3",
  }
];

const nextButton = document.getElementById("next-puzzle");
const puzzleContainer = document.getElementById("puzzle");

let currentPuzzleIndex = 0;

let timeToSolve = NaN;
let gameOver = false;
let score = Infinity;
let highscore = parseInt(localStorage.getItem("puzzle")) || 86399000;

function updateHighscoreDisplay() {
  let prettyTimeHighscore = new Date(highscore).toISOString().substr(11, 8);

  document.getElementById("highscore").innerHTML = prettyTimeHighscore;
}

function initPuzzle(puzzle) {
  nextButton.style.display = "none";
  puzzleContainer.style.backgroundImage = "none";

  getImageWithAvailableExtension(puzzle.image).then((puzzleImage) => {
    const background = new headbreaker.Canvas("puzzle", {
      width: puzzle.pixelSize,
      height: puzzle.pixelSize,
      pieceSize: puzzle.pieceSize,
      proximity: puzzle.pieceSize / puzzle.puzzleSizeWidth,
      borderFill: 0,
      strokeWidth: 2,
      lineSoftness: 0.0,
      image: puzzleImage,
      outline: new headbreaker.outline.Rounded(),
      preventOffstageDrag: true,
      fixed: true,
    });

    background.adjustImagesToPuzzleHeight();
    background.autogenerate({
      horizontalPiecesCount: puzzle.puzzleSizeWidth,
      verticalPiecesCount: puzzle.puzzleSizeHeight,
    });
    // background.shuffle(0.8);

    background.draw();

    document.getElementById("restart-button").addEventListener("click", () => {
      if (gameOver) {
        return;
      }
      background.shuffle(0.8);
      background.redraw();
    });

    background.onConnect(() => {
      if (isNaN(timeToSolve)) {
        timeToSolve = new Date().getTime();
      }
    });

    background.attachSolvedValidator();
    background.onValid(() => {
      nextButton.style.opacity = 0;
      puzzleContainer.style.opacity = 0;

      nextButton.style.display = "block";

      setTimeout(() => {
        background.clear();
        nextButton.style.opacity = 1;
        puzzleContainer.style.opacity = 1;
        puzzleContainer.style.backgroundImage = `url('${puzzleImage.src}')`;
      }, 1000);
    });
  });
}

nextButton.addEventListener("click", () => {
  currentPuzzleIndex++;

  if (currentPuzzleIndex >= puzzles.length) {
    nextButton.style.opacity = 0;
    gameover();
    return;
  }
  
  initPuzzle(puzzles[currentPuzzleIndex]);
});

function gameover() {
  gameOver = true;
  if (score < highscore) {
    highscore = score;
    localStorage.setItem("puzzle", score);
  }
  updateHighscoreDisplay();
  showGameOver();
}

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

updateHighscoreDisplay();
document.getElementById("score").innerHTML = "00:00:00";
initPuzzle(puzzles[currentPuzzleIndex]);