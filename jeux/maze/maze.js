// Path image:
// Black = wall
// Red = start
// Green = goal
// Yellow = dangerous
// Other = path
// The path image is invisible to the player, but the game uses it to determine the maze layout.
const GOALS = 6;
const DEBUG = false;
/**
 * Represents a maze game where you can drag the character to the goal.
 */
class Maze {
  constructor(bg_image, maze_image, onGoalReached) {
    if (DEBUG) {
      bg_image = maze_image;
    }
    this.gameOver = false;
    this.position = { x: 0, y: 0 };
    this.gameContainer = document.getElementById("game-container");
    this.dimensions = this.gameContainer.getBoundingClientRect();
    this.characterElement = document.getElementById("character");
    this.characterElement.style.position = "absolute";
    this.onGoalReached = onGoalReached;
    this.addEventListeners();
    this.loadImages(bg_image, maze_image);
  }

  addEventListeners() {
    const startEvents = ["mousedown", "touchstart"];
    const endEvents = ["mouseup", "touchend"];
    const moveEvents = ["mousemove", "touchmove"];

    startEvents.forEach((event) =>
      this.characterElement.addEventListener(
        event,
        this.dragStart.bind(this),
        false
      )
    );
    endEvents.forEach((event) =>
      document.addEventListener(event, this.dragEnd.bind(this), false)
    );
    moveEvents.forEach((event) =>
      document.addEventListener(event, this.drag.bind(this), false)
    );
  }

  removeEventListeners() {
    const startEvents = ["mousedown", "touchstart"];
    const endEvents = ["mouseup", "touchend"];
    const moveEvents = ["mousemove", "touchmove"];

    startEvents.forEach((event) =>
      this.characterElement.removeEventListener(event, this.dragStart, false)
    );
    endEvents.forEach((event) =>
      document.removeEventListener(event, this.dragEnd, false)
    );
    moveEvents.forEach((event) =>
      document.removeEventListener(event, this.drag, false)
    );
  }

  async loadImages(bg_image, maze_image) {
    this.maze_path_image = await getImageWithAvailableExtension(maze_image);
    this.createMazeCanvas();
    this.findStartPosition();

    this.maze_bg_image = await getImageWithAvailableExtension(bg_image);
    this.setBackgroundImage();
  }

  findStartPosition() {
    const imageData = this.mazeContext.getImageData(
      0,
      0,
      this.mazeCanvas.width,
      this.mazeCanvas.height
    ).data;

    let startPositions = [];

    for (let i = 0; i < imageData.length; i += 4) {
      if (this.isStart([imageData[i], imageData[i + 1], imageData[i + 2]])) {
        startPositions.push({
          left: (i / 4) % this.mazeCanvas.width,
          top: Math.floor(i / 4 / this.mazeCanvas.width),
        });
      }
    }

    if (startPositions.length > 0) {
      let minLeft = Math.min(...startPositions.map((p) => p.left));
      let maxLeft = Math.max(...startPositions.map((p) => p.left));
      let minTop = Math.min(...startPositions.map((p) => p.top));
      let maxTop = Math.max(...startPositions.map((p) => p.top));

      let startPosition = {
        left:
          minLeft + (maxLeft - minLeft) / 2 - this.characterElement.width / 2,
        top: minTop + (maxTop - minTop) / 2 - this.characterElement.height / 2,
      };

      this.updateCharacterPosition(startPosition);
    }
  }

  // Create the canvas for the maze
  createMazeCanvas() {
    this.mazeCanvas = document.createElement("canvas");
    this.mazeCanvas.width = this.dimensions.width;
    this.mazeCanvas.height = this.dimensions.height;
    this.mazeContext = this.mazeCanvas.getContext("2d");
    this.mazeContext.drawImage(
      this.maze_path_image,
      0,
      0,
      this.dimensions.width,
      this.dimensions.height
    );
  }

  // Set the background image for the game container
  setBackgroundImage() {
    this.gameContainer.style.backgroundImage = `url(${this.maze_bg_image.src})`;
  }

  dragStart(event) {
    event.preventDefault();
    this.dragging = true;
    this.initialX = event.clientX || event.touches[0].clientX;
    this.initialY = event.clientY || event.touches[0].clientY;
  }

  dragEnd() {
    this.dragging = false;
  }

  drag(event) {
    if (!this.dragging || this.gameOver) return;

    event.preventDefault();

    let currentX = event.clientX || event.touches[0].clientX;
    let currentY = event.clientY || event.touches[0].clientY;

    let newPosition = this.calculateNewPosition(currentX, currentY);
    newPosition = this.adjustForContainer(newPosition);

    if (!this.isOnPath(newPosition)) {
      this.dragging = false;
      return;
    }

    this.updateCharacterPosition(newPosition);

    // Update the initial position for the next movement
    this.initialX = currentX;
    this.initialY = currentY;

    if (this.isOnGoal(newPosition)) {
      this.onGoalReached();
      this.removeEventListeners();
      this.onGoalReached = () => {};
      this.gameOver = true;
    }

    if (this.isOnDangerous(newPosition)) {
      this.dragging = false;
      this.findStartPosition();
    }
  }

  calculateNewPosition(currentX, currentY) {
    let diffX = currentX - this.initialX;
    let diffY = currentY - this.initialY;

    let newLeft = this.characterElement.offsetLeft + diffX;
    let newTop = this.characterElement.offsetTop + diffY;

    return { left: newLeft, top: newTop };
  }

  adjustForContainer(position) {
    let containerRect = this.gameContainer.getBoundingClientRect();
    position.left -= containerRect.left;
    position.top -= containerRect.top;

    return position;
  }

  getPixelData(position) {
    const characterRect = this.characterElement.getBoundingClientRect();
    const halfWidth = characterRect.width / 2;
    const halfHeight = characterRect.height / 2;

    const getPixel = (x, y) => this.mazeContext.getImageData(x, y, 1, 1).data;

    return {
        topLeftPixelData: getPixel(position.left, position.top),
        topCenterPixelData: getPixel(position.left + halfWidth, position.top),
        topRightPixelData: getPixel(position.left + characterRect.width, position.top),
        leftCenterPixelData: getPixel(position.left, position.top + halfHeight),
        rightCenterPixelData: getPixel(position.left + characterRect.width, position.top + halfHeight),
        bottomLeftPixelData: getPixel(position.left, position.top + characterRect.height),
        bottomCenterPixelData: getPixel(position.left + halfWidth, position.top + characterRect.height),
        bottomRightPixelData: getPixel(position.left + characterRect.width, position.top + characterRect.height),
        centerPixelData: getPixel(position.left + halfWidth, position.top + halfHeight),
    };
}

  checkPosition(position, callback) {
    const pixelData = this.getPixelData(position);

    return Object.values(pixelData).some(callback);
  }

  isOnPath(position) {
    return this.checkPosition(position, this.isWall) === false;
  }

  isOnGoal(position) {
    return this.checkPosition(position, this.isGoal);
  }

  isOnDangerous(position) {
    return this.checkPosition(position, this.isDangerous);
  }

  updateCharacterPosition(position) {
    let containerRect = this.gameContainer.getBoundingClientRect();
    this.characterElement.style.left =
      position.left + containerRect.left + "px";
    this.characterElement.style.top = position.top + containerRect.top + "px";
  }

  isGoal(pixelData) {
    // red
    return pixelData[0] >= 128 && pixelData[1] === 0 && pixelData[2] === 0;
  }

  isStart(pixelData) {
    // green
    return pixelData[0] === 0 && pixelData[1] >= 128 && pixelData[2] === 0;
  }

  isWall(pixelData) {
    // black
    return pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0;
  }

  isDangerous(pixelData) {
    // yellow
    return pixelData[0] >= 128 && pixelData[1] >= 128 && pixelData[2] === 0;
  }
}

window.onload = async function () {
  let backgroundImages = [];
  let pathImages = [];

  for (let i = 0; i < GOALS + 1; i++) {
    backgroundImages.push(`img/bg${i}`);
    pathImages.push(`img/path${i}`);
  }

  let currentGoal = 0;

  function onGoalReached() {
    currentGoal++;
    new Maze(
      backgroundImages[currentGoal],
      pathImages[currentGoal],
      onGoalReached
    );
    if (currentGoal >= 6) {
      showGameOver();
    }
  }
  new Maze("img/bg0", "img/path0", onGoalReached);
};
