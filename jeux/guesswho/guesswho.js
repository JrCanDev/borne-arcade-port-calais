const PIECE_SIZE = 110;
const CANVAS_SIZE = 1026;
const CHARACTERS = 3;
const Y_POS = CANVAS_SIZE - PIECE_SIZE * 2;

let timeToSolve = NaN;
let gameOver = true;
let score = Infinity;
let highscore = parseInt(localStorage.getItem("guesswho")) || 86399000;

function updateHighscoreDisplay() {
  let prettyTimeHighscore = new Date(highscore).toISOString().substr(11, 8);

  document.getElementById("highscore").innerHTML = prettyTimeHighscore;
}

function flipbits(bits) {
  return bits.split("").reverse().join("");
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

let combinedImages = {};
let images = {};
let solvedImages = {};
let clothedImages = {};
for (let i = 0; i < CHARACTERS; i++) {
  images[i] = new Image();
  solvedImages[i] = new Image();
  clothedImages[i] = new Image();
  setImageWithAvailableExtension(images[i], `img/guesswho${i + 1}`);
  setImageWithAvailableExtension(
    solvedImages[i],
    `img/guesswho${i + 1}_solved`
  );
  setImageWithAvailableExtension(
    clothedImages[i],
    `img/guesswho${i + 1}_clothed`
  );
}

let guessed = 0b000000000000000000000000;
let clothed = [false, false, false];
function onCombined() {
  const guesswho = new headbreaker.Canvas("guesswho", {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    pieceSize: PIECE_SIZE,
    proximity: PIECE_SIZE / 3,
    borderFill: PIECE_SIZE / 10 + 1,
    strokeWidth: 0,
    lineSoftness: 0,
    image: combinedImages[guessed],
    maxPiecesCount: { x: 3, y: 2 },
    preventOffstageDrag: true,
    fixed: true,
    outline: new Flat(),
  });

  function setImage() {
    console.log("Setting image", guessed.toString(2));
    console.log(combinedImages[guessed]);
    guesswho.imageMetadata.content = combinedImages[guessed];
    guesswho.refill();
    guesswho.redraw();
  }

  function placeItems() {
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
        targetPosition: { x: PIECE_SIZE * 5 - 2, y: PIECE_SIZE - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "c2",
        targetPosition: { x: PIECE_SIZE * 7 - 2, y: PIECE_SIZE - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "d2",
        targetPosition: { x: PIECE_SIZE * 5 - 2, y: PIECE_SIZE * 2 - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "f2",
        targetPosition: { x: PIECE_SIZE * 7 - 2, y: PIECE_SIZE * 2 - 2 },
      },
    });

    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "a3",
        targetPosition: { x: PIECE_SIZE * 9 - 2, y: PIECE_SIZE - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "c3",
        targetPosition: { x: PIECE_SIZE * 11 - 2, y: PIECE_SIZE - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "d3",
        targetPosition: { x: PIECE_SIZE * 9 - 2, y: PIECE_SIZE * 2 - 2 },
      },
    });
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "f3",
        targetPosition: { x: PIECE_SIZE * 11 - 2, y: PIECE_SIZE * 2 - 2 },
      },
    });

    guesswho.puzzle.shuffle(CANVAS_SIZE, Y_POS - PIECE_SIZE * 2);
  }

  function placeClothes() {
    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "C1",
        targetPosition: { x: PIECE_SIZE * 4 - 2, y: PIECE_SIZE - 2 },
      },
    });

    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "C2",
        targetPosition: { x: PIECE_SIZE * 8 - 2, y: PIECE_SIZE - 2 },
      },
    });

    guesswho.sketchPiece({
      structure: "TTTT",
      metadata: {
        id: "C3",
        targetPosition: { x: PIECE_SIZE * 12 - 2, y: PIECE_SIZE - 2 },
      },
    });

    guesswho.puzzle.shuffle(CANVAS_SIZE, Y_POS - PIECE_SIZE * 2);
  }

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

  placeClothes();
  // placeItems();

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
    structure: "S-SS",
    metadata: {
      id: "b1",
      targetPosition: { x: PIECE_SIZE * 2 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b1"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSS-",
    metadata: {
      id: "e1",
      targetPosition: { x: PIECE_SIZE * 2 - 2, y: PIECE_SIZE * 2 - 2 },
      currentPosition: { ...FIXED_POSITIONS["e1"] },
    },
  });
  guesswho.sketchPiece({
    structure: "S-SS",
    metadata: {
      id: "b2",
      targetPosition: { x: PIECE_SIZE * 6 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b2"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSS-",
    metadata: {
      id: "e2",
      targetPosition: { x: PIECE_SIZE * 6 - 2, y: PIECE_SIZE * 2 - 2 },
      currentPosition: { ...FIXED_POSITIONS["e2"] },
    },
  });
  guesswho.sketchPiece({
    structure: "S-SS",
    metadata: {
      id: "b3",
      targetPosition: { x: PIECE_SIZE * 10 - 2, y: PIECE_SIZE - 2 },
      currentPosition: { ...FIXED_POSITIONS["b3"] },
    },
  });
  guesswho.sketchPiece({
    structure: "SSS-",
    metadata: {
      id: "e3",
      targetPosition: { x: PIECE_SIZE * 10 - 2, y: PIECE_SIZE * 2 - 2 },
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

    let old_guessed = guessed;
    guessed = 0;

    for (const i of i_indexes) {
      let valid_connections = 0;
      for (const j of j_indexes) {
        const piece = getPieceById(j + i);
        valid_connections += piece.connections.filter((c) => c).length;
      }
      let required_connections = clothed[i - 1] ? 4 : 1;

      if (valid_connections == required_connections) {
        if (!clothed[i - 1]) {
          clothed[i - 1] = true;
          getPieceById("C" + i).recenterAround(new headbreaker.Anchor(-PIECE_SIZE, -PIECE_SIZE));
          // if all clothed
          if (clothed.every((c) => c)) {
            placeItems();
          }
          return;
        } else {
          // Binary 2, 4, 8 for 1, 2, 3 (111 if 1, 2 and 3 is solved 001 if only 3 is solved, etc)
          guessed |= 1 << (i - 1);
        }
      }
    }
    for (let i = 0; i < CHARACTERS; i++) {
      if (clothed[i]) {
        guessed += 2 ** (31 - i);
      }
    }
    // flip the last 3 bits of guessed
    guessedStr = guessed.toString(2).padStart(32, "0");
    guessed = parseInt(guessedStr.slice(0, 32-CHARACTERS) + flipbits(guessedStr.slice(32-CHARACTERS), CHARACTERS), 2);
    if (old_guessed != guessed) {
      setImage();
    }

    completed = 0;
    for (let i = 0; i < CHARACTERS; i++) {
      completed += 2 ** i;
      completed += 2 ** (31 - i);
    }
    if (guessed != completed) { 
      return;
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
      }
    });

    for (let i = 0; i < CHARACTERS; i++) {
      if (clothed[i]) {
        getPieceById("C" + (i + 1)).recenterAround(new headbreaker.Anchor(-PIECE_SIZE, -PIECE_SIZE));
      }
    }
  }
  setInterval(placePersonsPiecesBack, 100);
  setInterval(checkWin, 100);

  document.getElementById("restart-button").addEventListener("click", () => {
    if (gameOver) {
      return;
    }
    guesswho.puzzle.shuffle(CANVAS_SIZE, Y_POS - PIECE_SIZE * 2);
    placePersonsPiecesBack();
    guesswho.redraw();
    timeToSolve = NaN;
    score = Infinity;
    document.getElementById("score").innerHTML = "00:00:00";
  });
}

var canvas = document.createElement("canvas");
canvas.width = 400 * 3;
canvas.height = 200;
var context = canvas.getContext("2d");

var imagesLoaded = 0;

function pickImages(key, images, otherImages) {
  let binaryKey = key.toString(2).padStart(CHARACTERS, "0");
  let pickedImages = [];
  for (let i = 0; i < CHARACTERS; i++) {
    pickedImages.push(binaryKey[i] === "0" ? images[i] : otherImages[i]);
  }
  return pickedImages;
}

var onLoadImage = () => {
  imagesLoaded++;
  if (imagesLoaded === CHARACTERS * 3) {

    for (let key = 0; key < 2**CHARACTERS; key++) {
      combinedImages[key] = new Image();
      context.clearRect(0, 0, canvas.width, canvas.height);
      pickImages(key, images, solvedImages).forEach((image, i) => {
        context.drawImage(image, i * 400, 0, 400, 200);
      });
      combinedImages[key].src = canvas.toDataURL("image/png");

      for (let clothedKey = 1; clothedKey < 2**CHARACTERS; clothedKey++) {
        let strClothedKey = clothedKey.toString(2).padStart(CHARACTERS, "0");
        let strKey = key.toString(2).padStart(CHARACTERS, "0");
        let strCombinedKey = (strClothedKey + '0'.repeat(32 - strClothedKey.length - strKey.length) + strKey);
        let combinedKey = parseInt(strCombinedKey, 2);
        combinedImages[combinedKey] = new Image();
        context.clearRect(0, 0, canvas.width, canvas.height);
        let clothedCombination = pickImages(clothedKey, images, clothedImages)
        pickImages(key, clothedCombination, solvedImages).forEach((image, i) => {
          context.drawImage(image, i * 400, 0, 400, 200);
        });
        console.log(combinedKey);
        console.log(canvas.toDataURL("image/png"));
        combinedImages[combinedKey].src = canvas.toDataURL("image/png");
      }

      if (key == 0) {
        combinedImages[key].onload = onCombined;
      }      
    }
  }
};
for (let i = 0; i < CHARACTERS; i++) {
  images[i].onload = onLoadImage;
  solvedImages[i].onload = onLoadImage;
  clothedImages[i].onload = onLoadImage;
}

document.getElementById("score").innerHTML = "00:00:00";
