const BACKGROUND = "img/index-bg.jpg";
const WIDTH = 1920;
const HEIGHT = 1080;

class BgAnimation {
  constructor() {
    if (new.target === BgAnimation) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  init() {
    throw new Error("Method 'init()' must be implemented.");
  }

  destroy() {
    throw new Error("Method 'destroy()' must be implemented.");
  }

  isOver() {
    throw new Error("Method 'isOver()' must be implemented.");
  }
}

class Normal extends BgAnimation {
  constructor() {
    super();
    this.element = document.getElementById("animated-background-normal");
    this.start_time = 0;
    this.duration = 20000;
  }

  init() {
    this.element.style.opacity = 1;
    this.start_time = new Date().getTime();
  }

  destroy() {
    this.element.style.opacity = 0;
  }

  isOver() {
    return new Date().getTime() - this.start_time > this.duration;
  }
}

class Puzzle extends BgAnimation {
  constructor() {
    super();
    this.element = document.getElementById("animated-background-puzzle");
    this.solve_timeout = 500;
    this.puzzleSizeWidth = 10;
    this.puzzleSizeHeight = 7;
    this.solved_fade_in = 2000;
    this.solved_positions = [];
    this.solved = true;
    this.puzzleImage = null;
    this.createPuzzleImage();
    this.fullImage = null;
    setInterval(() => this.solve_random_piece(), this.solve_timeout);
  }

  async createPuzzleImage() {
    const puzzleImage = await this.createImageFromBackground(BACKGROUND);
    this.puzzleImage = puzzleImage;
  
    if (this.background) {
      this.background.imageMetadata.content = puzzleImage;
      this.background.adjustImagesToPuzzleHeight();
      this.background.refill();
      this.background.redraw();
    }
  }
  
  async createImageFromBackground(background) {
    const puzzleImage = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
  
    const response = await fetch(background);
    const blob = await response.blob();
    const imgBitmap = await createImageBitmap(blob);
  
    context.drawImage(imgBitmap, 0, 0, WIDTH, HEIGHT);
    const dataUrl = canvas.toDataURL();
  
    puzzleImage.src = dataUrl;
  
    return puzzleImage;
  }

  init() {
    this.fullImage = document.createElement("div");
    this.element.style.opacity = 1;
    while (!this.puzzleImage) {
      cycleBackground();
      return;
    }
    this.setupBackground();
    this.setupPieces();
    this.shuffleAndDraw();
  }

  setupBackground() {
    const pieceSizeWidth = WIDTH / this.puzzleSizeWidth;
    const pieceSizeHeight = HEIGHT / this.puzzleSizeHeight;

    this.background = new headbreaker.Canvas("animated-background-puzzle", {
      width: WIDTH,
      height: HEIGHT,
      pieceSize: { x: pieceSizeWidth, y: pieceSizeHeight },
      proximity: this.pieceSize / this.puzzleSizeWidth,
      borderFill: 0,
      strokeWidth: 2,
      lineSoftness: 0.2,
      image: this.puzzleImage,
      outline: new headbreaker.outline.Rounded(),
      preventOffstageDrag: true,
      fixed: true,
      maxPiecesCount: {
        x: 2,
        y: 2,
      },
    });

    this.background.adjustImagesToPuzzleHeight();
    this.background.autogenerate({
      horizontalPiecesCount: this.puzzleSizeWidth,
      verticalPiecesCount: this.puzzleSizeHeight,
    });
  }

  setupPieces() {
    const pieceSizeWidth = WIDTH / this.puzzleSizeWidth;
    const pieceSizeHeight = HEIGHT / this.puzzleSizeHeight;
    const pieceCount = this.puzzleSizeWidth * this.puzzleSizeHeight;

    // Reframe the pieces to the center of the puzzle
    this.solved_positions = [];
    for (let i = 0; i < pieceCount; i++) {
      let piece = this.background.puzzle.pieces[i];
      piece.translate(-(pieceSizeWidth / 2), -(pieceSizeHeight / 2));

      this.solved_positions.push({
        piece: piece,
        centralAnchor: this.background.puzzle.pieces[i].centralAnchor.copy(),
      });
    }
    this.solved_positions = this.solved_positions.sort(
      () => Math.random() - 0.5
    );
  }

  shuffleAndDraw() {
    this.background.shuffle();
    this.background.draw();
    this.solved = false;
  }

  fadeInFullImage() {
    this.fullImage.style.backgroundImage = `url(${this.puzzleImage.src})`;
    this.fullImage.style.backgroundSize = "cover";
    this.fullImage.style.width = `${WIDTH}px`;
    this.fullImage.style.height = `${HEIGHT}px`;
    this.fullImage.style.opacity = "0";
    this.fullImage.style.transition =
      "opacity {this.solved_fade_in}ms ease-in-out";
    this.fullImage.style.position = "absolute";
    this.fullImage.style.top = "0";
    this.fullImage.style.left = "0";
    this.fullImage.style.zIndex = "0";
    this.element.appendChild(this.fullImage);

    // Trigger reflow to ensure the transition starts
    void this.fullImage.offsetWidth;

    // Start the fade-in
    this.fullImage.style.opacity = "1";
    setTimeout(() => {
      this.element.innerHTML = "";
      this.element.style.backgroundImage = `url(${this.puzzleImage.src})`;
      this.element.style.backgroundSize = "cover";
      this.element.removeChild(this.fullImage);
    }, this.solved_fade_in);
    this.finishPuzzle();
  }

  finishPuzzle() {
    this.solved = true;
  }

  solve_random_piece() {
    if (this.isOver()) {
      return;
    } else if (this.solved_positions.length === 0) {
      this.fadeInFullImage();
      return;
    }
    let to_solve = this.solved_positions.pop();

    let solved_position = to_solve.centralAnchor.copy();

    to_solve.piece.recenterAround(solved_position);
    this.background.redraw();
  }

  destroy() {
    this.element.style.opacity = 0;
    this.element.style.backgroundImage = "none";
  }

  isOver() {
    return this.solved;
  }
}

let animations = [new Normal(), new Puzzle()];

animations.forEach((animation) => {
  animation.destroy();
});

let currentAnimation = {
  init: () => {},
  destroy: () => {},
  isOver: () => true,
};

let lastAnimation = null;

function cycleBackground() {
  if (!currentAnimation.isOver()) {
    return;
  }
  console.log("Switching background animation");

  currentAnimation.destroy();

  let newAnimation;
  do {
    newAnimation = animations[Math.floor(Math.random() * animations.length)];
  } while (newAnimation === lastAnimation && animations.length > 1);

  lastAnimation = currentAnimation = newAnimation;
  currentAnimation.init();
  console.log("Current animation: ", currentAnimation.constructor.name);
}

function onLocaleChange() {
  document.querySelector(`img[src="img/${locale}-flag.svg"]`).id =
    "selected-language";
}

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("click", function () {
    document.querySelector("#selected-language").removeAttribute("id");
    document.querySelector(`img[src="img/${locale}-flag.svg"]`).id =
      "selected-language";
  });
});

setInterval(cycleBackground, 10000);
cycleBackground();
