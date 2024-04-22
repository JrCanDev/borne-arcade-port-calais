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
    this.timeToSolve = 200;
    this.solveSteps = 10;
    this.puzzleSizeWidth = 10;
    this.puzzleSizeHeight = 7;
    this.solved_fade_in = 2000;
    this.solved_positions = [];
    this.solved = true;
    this.puzzleImage = null;
    this.createPuzzleImage();
    this.fullImage = null;
    this.isSolving = false; // Add this line
    setInterval(() => {
      if (!this.isSolving) {
        // Add this line
        this.solve_random_piece();
      }
    }, this.timeToSolve);
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
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext("2d");

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

  lerp(centralPosA, centralPosB, t) {
    centralPosA.x = centralPosA.x + (centralPosB.x - centralPosA.x) * t;
    centralPosA.y = centralPosA.y + (centralPosB.y - centralPosA.y) * t;
    return centralPosA;
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
    let current_position = to_solve.piece.centralAnchor.copy();
    let t = 0;
    this.isSolving = true;
    let intervalId = setInterval(() => {
      if (t >= 1) {
        clearInterval(intervalId);
        this.isSolving = false;
      } else {
        t += this.solveSteps / this.timeToSolve;
        let newPosition = this.lerp(current_position, solved_position, t);
        to_solve.piece.recenterAround(newPosition);
        this.background.redraw();
      }
    }, this.timeToSolve / this.solveSteps);
  }

  destroy() {
    this.element.style.opacity = 0;
    setTimeout(() => {
      this.element.style.backgroundImage = "none";
    }, this.solved_fade_in);
  }

  isOver() {
    return this.solved;
  }
}
class FlappyBird extends BgAnimation {
  constructor() {
    super();
    this.elements = [
      document.getElementById("animated-background-flappy"),
      document.getElementById("animated-background-normal"),
    ];
    this.birdElement = document.getElementById("flappy-bird");
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 5, y: 0 };
    this.gravity = 0.5;
    this.flapPower = -10;
    this.intervalId = null;
    this.yGoal = HEIGHT / 2; // The y-coordinate of the center of the screen
    this.flapSprites = ["img/planeicons.png", "img/planeicons-flap.png"];
    this.currentSpriteIndex = 0;
    this.flapIntervalId = null;
  }

  init() {
    this.position = {
      x: this.birdElement.offsetLeft,
      y: Math.floor(Math.random() * HEIGHT),
    };
    this.elements.forEach((element) => {
      element.style.opacity = 1;
    });
    this.intervalId = setInterval(() => this.flap(), 20);
    this.flapIntervalId = setInterval(() => this.changeSprite(), 100);
  }

  destroy() {
    this.elements.forEach((element) => {
      element.style.opacity = 0;
    });
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isOver() {
    return this.position.x > WIDTH;
  }

  flap() {
    // Make the bird move around the center card
    if (this.position.x > 0.2 * WIDTH) {
      this.yGoal = HEIGHT / 3;
    }
    if (this.position.x > 0.7 * WIDTH) {
      this.yGoal = HEIGHT / 1.75;
    }
    setTimeout(() => {
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;
      this.position.x += this.velocity.x;

      let rotation = Math.min(Math.max(this.velocity.y, -10), 10) * 3; // Adjust the multiplier as needed

      this.birdElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${rotation}deg)`;

      if (this.position.y < 0 || this.position.y > this.yGoal) {
        this.velocity.y = this.flapPower;
      }
    }, Math.random() * 1000);
  }

  changeSprite() {
    this.currentSpriteIndex =
      (this.currentSpriteIndex + 1) % this.flapSprites.length;
    this.birdElement.src = this.flapSprites[this.currentSpriteIndex];
  }
}

class Pacman extends BgAnimation {
  constructor() {
    super();
    this.over = false;
    this.elements = [
      document.getElementById("animated-background-pacman"),
      document.getElementById("animated-background-normal"),
    ];
    this.pacman = this.getPacmanCharacter();
    this.ghost = this.getGhostCharacter();
    this.characterMovementSpeed = 2;
    this.pelletContainer = document.getElementById("pacman-pellets");
    this.pellets = [];
    this.pelletSize = 25;
    this.superPelletSize = 50;
    this.pelletGap = 10;
    this.pacmanGhostGap = 1000;
    this.paths = this.getPaths();
    this.pacmanIntervalId = null;
    this.isPacmanSuper = false;
  }

  getPacmanCharacter() {
    return {
      element: document.getElementById("pacman"),
      position: { x: 0, y: 0 },
      sprites: [
        "jeux/pacman/img/pacman/1.png", // right
        "jeux/pacman/img/pacman/2.png", // down
        "jeux/pacman/img/pacman/3.png", // left
        "jeux/pacman/img/pacman/4.png", // up
      ],
    };
  }

  getGhostCharacter() {
    const normalSprites = [
      "jeux/pacman/img/ghosts/ghost1Right.png",
      "jeux/pacman/img/ghosts/ghost1Down.png",
      "jeux/pacman/img/ghosts/ghost1Left.png",
      "jeux/pacman/img/ghosts/ghost1Up.png",
    ];
    const scaredSprites = [
      "jeux/pacman/img/ghosts/ghostAffraidRight.png",
      "jeux/pacman/img/ghosts/ghostAffraidDown.png",
      "jeux/pacman/img/ghosts/ghostAffraidLeft.png",
      "jeux/pacman/img/ghosts/ghostAffraidUp.png",
    ];
    return {
      element: document.getElementById("pacman-ghost"),
      position: { x: 0, y: 0 },
      normalSprites: normalSprites,
      scaredSprites: scaredSprites,
      sprites: normalSprites,
    };
  }

  getPaths() {
    return [
      { x: -this.pelletSize * 2, y: HEIGHT / 2 }, // Start offscreen
      { x: WIDTH / 4, y: null }, // null means the y-coordinate is not changed, so we move horizontally
      { x: null, y: HEIGHT / 3 }, // null means the x-coordinate is not changed, so we move vertically
      { x: WIDTH / 1.25, y: null },
      { x: null, y: HEIGHT / 1.5 },
      { x: WIDTH / 1.1, y: null },
      { x: null, y: HEIGHT / 5 },
    ];
  }

  init() {
    this.over = false;
    this.elements.forEach((element) => {
      element.style.opacity = 1;
    });
    this.pacman.position = { x: this.paths[0].x, y: this.paths[0].y };
    this.ghost.position = { x: this.paths[0].x, y: this.paths[0].y };
    this.updateCharacter(this.pacman);
    this.updateCharacter(this.ghost);
    this.generatePellets();
    this.pacmanIntervalId = setInterval(
      () => this.playAnimation(this.pacman),
      10
    );
    setTimeout(() => {
      this.ghostIntervalId = setInterval(
        () => this.playAnimation(this.ghost),
        10
      );
    }, this.pacmanGhostGap);
  }

  generatePellets() {
    let lastPath = this.paths[0];
    this.paths.forEach((path) => {
      if (path.x === null) {
        path.x = lastPath.x;
      }
      if (path.y === null) {
        path.y = lastPath.y;
      }
      let distance = Math.sqrt(
        Math.pow(path.x - lastPath.x, 2) + Math.pow(path.y - lastPath.y, 2)
      );
      let pellets = Math.floor(distance / (this.pelletSize + this.pelletGap));
      for (let i = 0; i < pellets; i++) {
        let pellet = document.createElement("img");
        pellet.src = "jeux/pacman/img/bubbles/bubble.png";
        pellet.style.position = "absolute";
        pellet.className = "pellet";
        pellet.style.width = `${this.pelletSize}px`;
        pellet.style.height = `${this.pelletSize}px`;
        pellet.style.left = `${
          lastPath.x +
          ((path.x - lastPath.x) / pellets) * i -
          this.pelletSize / 2
        }px`;
        pellet.style.top = `${
          lastPath.y +
          ((path.y - lastPath.y) / pellets) * i -
          this.pelletSize / 2
        }px`;
        this.pelletContainer.appendChild(pellet);
        this.pellets.push(pellet);
      }
      lastPath = path;
    });

    // Generate the last pellet which is a special one
    let pellet = document.createElement("img");
    pellet.src = "jeux/pacman/img/bubbles/superbubble.png";
    pellet.style.position = "absolute";
    pellet.className = "pellet";
    pellet.style.width = `${this.superPelletSize}px`;
    pellet.style.height = `${this.superPelletSize}px`;
    pellet.style.left = `${lastPath.x - this.superPelletSize / 2}px`;
    pellet.style.top = `${lastPath.y - this.superPelletSize / 2}px`;
    this.pelletContainer.appendChild(pellet);
    this.pellets.push(pellet);
  }

  updateCharacter(character, direction) {
    let characterSize = character.element.width;
    character.element.style.left = `${
      character.position.x - characterSize / 2
    }px`;
    character.element.style.top = `${
      character.position.y - characterSize / 2
    }px`;
    if (direction !== undefined) {
      character.element.src = character.sprites[direction];
    }
  }

  calculateDirection(currentPath, nextPath) {
    let directionX = nextPath.x - currentPath.x;
    let directionY = nextPath.y - currentPath.y;
  
    // Normalize the direction
    let distance = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= distance;
    directionY /= distance;
  
    return { directionX, directionY };
  }
  
  updatePositions(character, directionX, directionY) {
    // Update the positions
    character.position.x += directionX * this.characterMovementSpeed;
    character.position.y += directionY * this.characterMovementSpeed;
  }
  
  updateSprites(character, directionX, directionY) {
    // Update the sprites
    let spriteDirection = 0;
    if (directionX < 0) {
      spriteDirection = 2;
    } else if (directionY > 0) {
      spriteDirection = 1;
    } else if (directionY < 0) {
      spriteDirection = 3;
    }
  
    // Update the elements on the screen
    this.updateCharacter(character, spriteDirection);
  }
  
  checkNextPath(character, nextPath) {
    // If we've reached the next path, move on to the next one
    if (
      Math.abs(character.position.x - nextPath.x) < this.characterMovementSpeed &&
      Math.abs(character.position.y - nextPath.y) < this.characterMovementSpeed
    ) {
      character.currentPathIndex += this.isPacmanSuper ? -1 : 1;
    }
  }
  
  checkPelletCollision() {
    this.pellets = this.pellets.filter((pellet) => {
      const pelletRect = pellet.getBoundingClientRect();
      const pacmanRect = this.pacman.element.getBoundingClientRect();
  
      const offset = this.pellets.length > 1 ? this.pelletSize : this.superPelletSize;
  
      const collision = !(
        pelletRect.right < pacmanRect.left + offset ||
        pelletRect.left > pacmanRect.right - offset ||
        pelletRect.bottom < pacmanRect.top + offset ||
        pelletRect.top > pacmanRect.bottom - offset
      );
  
      if (collision) {
        this.pelletContainer.removeChild(pellet);
      }
  
      return !collision;
    });
  }
  
  playAnimation(character) {
    // Assuming we have a currentPathIndex to keep track of the current path
    if (character.currentPathIndex === undefined) {
      character.currentPathIndex = this.isPacmanSuper
        ? this.paths.length - 1
        : 0;
    }
  
    let currentPath = this.paths[character.currentPathIndex];
    let nextPath = this.isPacmanSuper
      ? this.paths[character.currentPathIndex - 1]
      : this.paths[character.currentPathIndex + 1];
  
    // If there's no next path, we've reached the end of the animation
    if (!nextPath) {
      if (this.isPacmanSuper) {
        this.over = true;
        return;
      }
      this.isPacmanSuper = true;
      this.ghost.sprites = this.ghost.scaredSprites;
      this.pacman.currentPathIndex = this.paths.length - 1;
      this.ghost.currentPathIndex = this.paths.length - 1;
      return;
    }
  
    const { directionX, directionY } = this.calculateDirection(currentPath, nextPath);
    this.updatePositions(character, directionX, directionY);
    this.updateSprites(character, directionX, directionY);
    this.checkNextPath(character, nextPath);
  
    // If the character is Pacman, check for collisions with pellets
    if (character === this.pacman) {
      this.checkPelletCollision();
    }
  }

  destroy() {
    this.elements.forEach((element) => {
      element.style.opacity = 0;
    });
    this.pellets.forEach((pellet) => {
      this.pelletContainer.removeChild(pellet);
    });
    this.pellets = [];
    if (this.pacmanIntervalId) {
      clearInterval(this.pacmanIntervalId);
      this.pacmanIntervalId = null;
    }
    this.ghost.sprites = this.ghost.normalSprites;
  }

  isOver() {
    return this.over;
  }
}
let animations = [new Normal(), new Puzzle(), new FlappyBird(), new Pacman()];

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
