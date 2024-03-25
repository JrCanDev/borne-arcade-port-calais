const PIECE_SIZE = 110;
const CANVAS_SIZE = 1026;
const Y_POS = CANVAS_SIZE - PIECE_SIZE * 2;

let timeToSolve = NaN;
let gameOver = true;
let score = Infinity;
let highscore = parseInt(localStorage.getItem("guesswho")) || 86399000;

function updateHighscoreDisplay() {
  let prettyTimeHighscore = new Date(highscore).toISOString().substr(11, 8);

  document.getElementById("highscore").innerHTML = prettyTimeHighscore;
}

updateHighscoreDisplay();

setInterval(() => {
  if (!isNaN(timeToSolve) && !gameOver) {
    delta = new Date().getTime() - timeToSolve;
    score = delta;
    let prettyTime = new Date(delta).toISOString().substr(11, 8);
    document.getElementById("score").innerHTML = prettyTime;
  }

  if (score < highscore) {
    localStorage.setItem("guesswho", score);
  }
}, 100);

class Flat {
  draw(piece, size = 50, borderFill = 0) {
    const sizeVector = headbreaker.Vector.cast(size);
    const offset = headbreaker.Vector.divide(
      headbreaker.Vector.multiply(borderFill, 5),
      sizeVector
    );

    return [
      0 - offset.x,
      0 - offset.y,
      4 + offset.x,
      0 - offset.y,
      4 + offset.x,
      4 + offset.y,
      0 - offset.x,
      4 + offset.y,
    ].map(
      (it, index) => (it * (index % 2 === 0 ? sizeVector.x : sizeVector.y)) / 5
    );
  }

  isBezier() {
    return false;
  }
}

var jobImage = new Image();
jobImage.src = "guesswho.png";
jobImage.onload = () => {
  const guesswho = new headbreaker.Canvas("guesswho", {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    pieceSize: PIECE_SIZE,
    proximity: 20,
    borderFill: PIECE_SIZE / 10 + 1,
    strokeWidth: 0,
    lineSoftness: 0,
    image: jobImage,
    maxPiecesCount: { x: 3, y: 2 },
    preventOffstageDrag: true,
    fixed: true,
    outline: new Flat(),
  });

  guesswho.adjustImagesToPuzzleHeight();
  guesswho.puzzle.forceDisconnectionWhileDragging();

  guesswho.attachValidator({
    // The validator is a bit broken, but it can still be used to detect when pieces are moved
    validate: (piece, connection) => {
      // The validator is called when a piece has been dragged or when the puzzle has been drawn for the first time
      if (gameOver) {
        gameOver = false;
        return;
      }
      if (!timeToSolve) {
        timeToSolve = new Date().getTime();
      }
    },
  });

  //Items that needs to be placed randomly
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "a1",
      targetPosition: { x: PIECE_SIZE - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "c1",
      targetPosition: { x: PIECE_SIZE * 3 - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "d1",
      targetPosition: { x: PIECE_SIZE - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "f1",
      targetPosition: { x: PIECE_SIZE * 3 - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });

  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "a2",
      targetPosition: { x: PIECE_SIZE * 4 - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "c2",
      targetPosition: { x: PIECE_SIZE * 6 - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "d2",
      targetPosition: { x: PIECE_SIZE * 4 - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "f2",
      targetPosition: { x: PIECE_SIZE * 6 - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });

  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "a3",
      targetPosition: { x: PIECE_SIZE * 7 - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "c3",
      targetPosition: { x: PIECE_SIZE * 9 - 2, y: PIECE_SIZE - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "d3",
      targetPosition: { x: PIECE_SIZE * 7 - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });
  guesswho.sketchPiece({
    structure: "TTTT",
    metadata: {
      id: "f3",
      targetPosition: { x: PIECE_SIZE * 9 - 2, y: PIECE_SIZE * 2 - 2 },
    },
  });

  guesswho.puzzle.shuffle(CANVAS_SIZE, Y_POS - PIECE_SIZE * 2); //Place items randomly

  const SPACING = PIECE_SIZE * 2;
  const FIXED_COL_COUNT = 3;
  const TOTAL_PIECE_WIDTH = FIXED_COL_COUNT * PIECE_SIZE;
  const TOTAL_SPACING_WIDTH = (FIXED_COL_COUNT - 1) * SPACING; // total width of all spaces
  const TOTAL_WIDTH = TOTAL_PIECE_WIDTH + TOTAL_SPACING_WIDTH; // total width of all pieces and spaces
  const STARTING_X_POS = (CANVAS_SIZE - TOTAL_WIDTH) / 2 + PIECE_SIZE / 2; // starting x position for the first piece

  let currentXPos = STARTING_X_POS;
  const FIXED_POSITIONS = {
    b1: { x: currentXPos, y: Y_POS - PIECE_SIZE },
    e1: { x: currentXPos, y: Y_POS },
    b2: { x: (currentXPos += PIECE_SIZE + SPACING), y: Y_POS - PIECE_SIZE },
    e2: { x: currentXPos, y: Y_POS },
    b3: { x: (currentXPos += PIECE_SIZE + SPACING), y: Y_POS - PIECE_SIZE },
    e3: { x: currentXPos, y: Y_POS },
  };
  guesswho.sketchPiece({
    structure: "SSSS",
    metadata: {
      id: "b1",
      targetPosition: { x: PIECE_SIZE * 2 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b1"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSST",
    metadata: {
      id: "e1",
      targetPosition: { x: PIECE_SIZE * 2 - 2, y: PIECE_SIZE * 2 - 2 },
      currentPosition: { ...FIXED_POSITIONS["e1"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSSS",
    metadata: {
      id: "b2",
      targetPosition: { x: PIECE_SIZE * 5 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b2"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSST",
    metadata: {
      id: "e2",
      targetPosition: { x: PIECE_SIZE * 5 - 2, y: PIECE_SIZE * 2 - 2 },
      currentPosition: { ...FIXED_POSITIONS["e2"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSSS",
    metadata: {
      id: "b3",
      targetPosition: { x: PIECE_SIZE * 8 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b3"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSST",
    metadata: {
      id: "e3",
      targetPosition: { x: PIECE_SIZE * 8 - 2, y: PIECE_SIZE * 2 - 2 },
      currentPosition: { ...FIXED_POSITIONS["e3"] },
    },
  });

  // for each key in FIXED_POSITIONS, set the piece to not draggable
  for (const key in FIXED_POSITIONS) {
    guesswho.getFigureById(key).group.setDraggable(false);
  }

  guesswho.draw();

  guesswho.attachConnectionRequirement(
    (one, other) => one.metadata.id[1] == other.metadata.id[1]
  );

  function getPieceById(id) {
    return guesswho.puzzle.pieces.find((p) => p.metadata.id === id);
  }

  function checkWin() {
    // get unique i & j indexes in FIXED_POSITIONS (i.e. 1, 2, 3 & b, e)
    const i_indexes = new Set();
    const j_indexes = new Set();
    for (const key in FIXED_POSITIONS) {
      i_indexes.add(key[1]);
      j_indexes.add(key[0]);
    }

    for (const i of i_indexes) {
      let valid_connections = 0;
      for (const j of j_indexes) {
        const piece = getPieceById(j + i);
        valid_connections += piece.connections.filter((c) => c).length;
      }
      
      if (valid_connections != 6) {
        return;
      }
    }

    gameOver = true;
    if (score < highscore) {
      highscore = score;
      localStorage.setItem("guesswho", score);
    }
    updateHighscoreDisplay();

    setTimeout(() => {
      showGameOver();
    }, 1000);
  }

  function placePersonsPiecesBack() {
    const pieceList = guesswho.puzzle.pieces;
    pieceList.forEach((element) => {
      if (element && Object.keys(FIXED_POSITIONS).includes(element.id)) {
        element.relocateTo(
          FIXED_POSITIONS[element.id].x,
          FIXED_POSITIONS[element.id].y
        );

        if (!element.connections[1] && !element.connections[3]) {
          console.log(element.connections);
          // we need to reconnect the piece to the puzzle (e3 connects to b3, e2 connects to b2, etc)
          const target = ("b" ? "e" : element.id[0] == "e") + element.id[1];
          const targetPiece = getPieceById(target);
          if (targetPiece) {
            element.connectVerticallyWith(targetPiece);
          }
          console.log(element.connections);
        }
      }
    });
  }
  setInterval(placePersonsPiecesBack, 100);
  setInterval(checkWin, 100);
};
