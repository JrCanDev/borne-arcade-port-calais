const BACKGROUND_IMAGE = findImageWithAvailableExtension("img/bg");
const PATH_IMAGE = findImageWithAvailableExtension("img/path");
const CHARACTER_IMAGE = findImageWithAvailableExtension("img/character");
const DEBUG = true;
// Path image:
// Black = wall
// Red = start
// Green = goal
// Other = path
// The path image is invisible to the player, but the game uses it to determine the maze layout.

/**
 * Represents a maze game where you can drag the character to the goal.
 */
class Maze {
  constructor(bg_image, maze_image, onGoalReached) {
    this.gameOver = false;
    this.position = { x: 0, y: 0 };
    this.currentGoal = 0;
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

  loadImages(bg_image, maze_image) {
    this.maze_path_image = new Image();
    this.maze_path_image.src = maze_image;
    this.maze_path_image.onload = () => {
      this.createMazeCanvas();
      this.findStartPosition();
    };
  
    this.maze_bg_image = new Image();
    this.maze_bg_image.src = bg_image;
    this.maze_bg_image.onload = this.setBackgroundImage.bind(this);
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
          top: Math.floor((i / 4) / this.mazeCanvas.width)
        });
      }
    }
  
    if (startPositions.length > 0) {
      let minLeft = Math.min(...startPositions.map(p => p.left));
      let maxLeft = Math.max(...startPositions.map(p => p.left));
      let minTop = Math.min(...startPositions.map(p => p.top));
      let maxTop = Math.max(...startPositions.map(p => p.top));
  
      let startPosition = {
        left: minLeft + (maxLeft - minLeft) / 2 - this.characterElement.width / 2,
        top: minTop + (maxTop - minTop) / 2 - this.characterElement.height / 2
      }
  
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
      this.onGoalReached = () => {};
      this.gameOver = true;
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
    return {
      topLeftPixelData: this.mazeContext.getImageData(
        position.left,
        position.top,
        1,
        1
      ).data,
      topRightPixelData: this.mazeContext.getImageData(
        position.left + characterRect.width,
        position.top,
        1,
        1
      ).data,
      bottomLeftPixelData: this.mazeContext.getImageData(
        position.left,
        position.top + characterRect.height,
        1,
        1
      ).data,
      bottomRightPixelData: this.mazeContext.getImageData(
        position.left + characterRect.width,
        position.top + characterRect.height,
        1,
        1
      ).data,
    };
  }

  isOnPath(position) {
    const { topLeftPixelData, topRightPixelData, bottomLeftPixelData, bottomRightPixelData } = this.getPixelData(position);
    return (
      !this.isWall(topLeftPixelData) &&
      !this.isWall(topRightPixelData) &&
      !this.isWall(bottomLeftPixelData) &&
      !this.isWall(bottomRightPixelData)
    );
  }

  isOnGoal(position) {
    const { topLeftPixelData, topRightPixelData, bottomLeftPixelData, bottomRightPixelData } = this.getPixelData(position);
    return (
      this.isGoal(topLeftPixelData) ||
      this.isGoal(topRightPixelData) ||
      this.isGoal(bottomLeftPixelData) ||
      this.isGoal(bottomRightPixelData)
    );
  }
  
  updateCharacterPosition(position) {
    let containerRect = this.gameContainer.getBoundingClientRect();
    this.characterElement.style.left = position.left + containerRect.left + "px";
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
}

window.onload = function () {

  function onGoalReached() {
    alert("You reached the goal!");
  }

  let maze = new Maze(DEBUG ? PATH_IMAGE : BACKGROUND_IMAGE, PATH_IMAGE, onGoalReached);

  window.maze = maze;
};
