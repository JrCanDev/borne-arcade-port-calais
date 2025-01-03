class Score {
  constructor() {
    this.timeToSolve = NaN;
    this.score = Infinity;
    this.highscore = parseInt(localStorage.getItem("guesswho")) || 86399000;
  }

  updateHighscore() {
    if (this.score < this.highscore) {
      this.highscore = this.score;
      localStorage.setItem("guesswho", this.highscore);
      this.updateHighscoreDisplay();
    }
  }

  updateHighscoreDisplay() {
    let prettyTimeHighscore = new Date(this.highscore)
      .toISOString()
      .substr(11, 8);
    document.getElementById("highscore").innerHTML = prettyTimeHighscore;
  }

  updateScoreDisplay() {
    let prettyTime = new Date(this.score).toISOString().substr(11, 8);
    document.getElementById("score").innerHTML = prettyTime;
  }

  updateScore() {
    let delta = new Date().getTime() - this.timeToSolve;
    this.score = delta;
    this.updateScoreDisplay();
  }

  startScores() {
    this.timeToSolve = new Date().getTime();
    this.updateScore();
  }

  initScores() {
    document.getElementById("score").innerHTML = "00:00:00";
    this.updateHighscoreDisplay();
  }

  resetScores() {
    this.initScores();
  }
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class PositionedImage {
  constructor(position, image) {
    this.position = position;
    this.image = image;
    this.element = null;

    return (async () => {
      await this.initImage();
      return this;
    })();
  }

  async initImage() {
    let imageUrl = await findImageWithAvailableExtension(this.image);
    let img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = this.position.x + "px";
        div.style.top = this.position.y + "px";
        div.style.width = img.naturalWidth + "px";
        div.style.height = img.naturalHeight + "px";
        div.style.backgroundImage = `url(${imageUrl})`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        document.getElementById("game-container").appendChild(div);
        this.element = div;
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  collidesWith(other) {
    let rect1 = this.element.getBoundingClientRect();
    let rect2 = other.element.getBoundingClientRect();
    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
  }

  setZIndex(zIndex) {
    this.element.style.zIndex = zIndex;
  }

  hide() {
    this.element.style.display = "none";
  }

  show() {
    this.element.style.display = "block";
  }
}

class DraggableImage extends PositionedImage {
  constructor(position, image) {
    super(position, image).then((instance) => {
      instance.initDraggable();
      instance.container = document.getElementById("game-container");
      instance.active = false;
      instance.draggingEnabled = true;
    });
  }

  initDraggable() {
    this.element.addEventListener(
      "mousedown",
      this.dragStart.bind(this),
      false
    );
    this.element.addEventListener(
      "touchstart",
      this.dragStart.bind(this),
      false
    );

    document.addEventListener("mouseup", this.dragEnd.bind(this), false);
    document.addEventListener("touchend", this.dragEnd.bind(this), false);

    document.addEventListener("mousemove", this.drag.bind(this), false);
    document.addEventListener("touchmove", this.drag.bind(this), false);
  }

  dragStart() {
    if (!this.draggingEnabled) {
      return;
    }
    this.active = true;
  }

  dragEnd() {
    this.active = false;
  }

  drag(event) {
    if (this.active) {
      event.preventDefault();

      let x = event.clientX || event.touches[0].clientX;
      let y = event.clientY || event.touches[0].clientY;

      this.setDraggingPosition(x, y);
      if (this.draggingCallback) {
        this.draggingCallback();
      }
    }
  }

  setDraggingPosition(x, y) {
    // Adjust position to be relative to the container
    let newX = x - this.container.offsetLeft;
    let newY = y - this.container.offsetTop;
    // Center the image on the cursor
    newX -= parseFloat(this.element.style.width) / 2;
    newY -= parseFloat(this.element.style.height) / 2;
    // Check boundaries
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + parseFloat(this.element.style.width) > this.container.offsetWidth) {
      newX = this.container.offsetWidth - parseFloat(this.element.style.width);
    }
    if (newY + parseFloat(this.element.style.height) > this.container.offsetHeight) {
      newY = this.container.offsetHeight - parseFloat(this.element.style.height);
    }
    // Set the new position
    this.position.x = newX;
    this.position.y = newY;
    this.element.style.left = newX + "px";
    this.element.style.top = newY + "px";
  }

  disableDragging() {
    this.draggingEnabled = false;
    this.active = false;
  }

  enableDragging() {
    this.draggingEnabled = true;
  }
}

class Item extends DraggableImage {
  constructor(position, image, solvedPosition) {
    super(position, image).then((instance) => {
      instance.setZIndex(2);
      instance.solvedPosition = solvedPosition;
    });
  }

  setCharacter(character) {
    this.character = character;
  }

  draggingCallback() {
    if (this.character && this.collidesWith(this.character)) {
      this.disableDragging();
      this.setPosition(
        this.character.position.x + this.solvedPosition.x,
        this.character.position.y + this.solvedPosition.y
      );
      this.setCharacter(this.character);
    }
  }
}

class Clothes extends DraggableImage {
  constructor(position, image) {
    super(position, image).then((instance) => {
      instance.setZIndex(1);
      instance.character = null;
    });
  }

  setCharacter(character) {
    this.character = character;
  }

  draggingCallback() {
    if (this.character && this.collidesWith(this.character)) {
      this.disableDragging();
      this.setPosition(this.character.position.x, this.character.position.y);
      this.setCharacter(this.character);
    }
  }
}

class Character extends PositionedImage {
  constructor(position, image, name, clothes, items) {
    super(position, image).then((instance) => {
      const gameContainer = document.getElementById("game-container");

      instance.name = name;
      instance.clothes = clothes;
      instance.clothes.setCharacter(instance);
      instance.items = items;
      instance.items.forEach((item) => item.setCharacter(instance));

      let nameP = document.createElement("p");
      nameP.classList.add("character-name");
      nameP.style.left = position.x - gameContainer.offsetLeft + "px";
      nameP.innerHTML = instance.name;
      gameContainer.appendChild(nameP);
      instance.nameElement = nameP;
    });
  }

  isClothed() {
    return this.clothes.draggingEnabled === false;
  }

  isFullyDressed() {
    return (
      this.isClothed() &&
      this.items.every((item) => item.draggingEnabled === false)
    );
  }
}

class Game {
  constructor() {
    this.initializeGame();
  }

  async initializeGame() {
    this.gameScore = new Score();
    this.gameScore.initScores();
    this.gameScoreStarted = false;

    document.addEventListener("touchstart", () => {
      if (!this.gameScoreStarted) {
        this.gameScoreStarted = true;
        this.gameScore.startScores();
      }
    });

    const gameContainer = document.getElementById("game-container");
    const gameContainerWidth = gameContainer.offsetWidth;

    const CHARACTER_WIDTH = 200;
    const CHARACTER_NAMES = [getTranslation("game.guesswho.agent1"), getTranslation("game.guesswho.agent2"), getTranslation("game.guesswho.agent3")];
    const TOTAL_CHARACTERS = 3;
    const TOTAL_ITEMS = 4;

    const totalCharactersWidth = CHARACTER_WIDTH * TOTAL_CHARACTERS;
    const remainingSpace = gameContainerWidth - totalCharactersWidth;
    const spaceBetweenCharacters = remainingSpace / (TOTAL_CHARACTERS + 1);

    const solvedPositions = await fetch("solved_positions.json").then(
      (response) => response.json()
    );

    this.characters = await Promise.all(
      Array.from({ length: TOTAL_CHARACTERS }, (_, i) =>
        this.createCharacter(
          i,
          CHARACTER_NAMES[i],
          spaceBetweenCharacters,
          CHARACTER_WIDTH,
          TOTAL_ITEMS,
          solvedPositions[i]
        )
      )
    );
    this.characters.forEach((character) => {
      this.shuffle(character);
      character.items.forEach((item) => item.hide());
    });

    this.loop = setInterval(() => this.gameLoop(), 100);
  }

  async createCharacter(
    index,
    name,
    spaceBetweenCharacters,
    characterWidth,
    totalItems,
    solvedPositions
  ) {
    const clothes = await new Clothes(
      new Position(0, 0),
      `img/characters/${index + 1}/clothes`,
    );

    const items = await Promise.all(
      Array.from(
        { length: totalItems },
        (_, j) =>
          new Item(
            new Position(0, 0),
            `img/characters/${index + 1}/items/${j + 1}`,
            new Position(solvedPositions[j][0], solvedPositions[j][1])
          )
      )
    );

    const xPos =
      spaceBetweenCharacters +
      (characterWidth + spaceBetweenCharacters) * index;

    return new Character(
      new Position(xPos, 512),
      `img/characters/${index + 1}/character`,
      name,
      clothes,
      items
    );
  }

  shuffle(character) {
    const gameContainer = document.getElementById("game-container");
    const gameContainerWidth = gameContainer.offsetWidth;
    const gameContainerHeight = gameContainer.offsetHeight;

    const randomPosition = (itemWidth, itemHeight) => {
      return new Position(
        Math.ceil(Math.random() * (gameContainerWidth - itemWidth)),
        Math.ceil(Math.random() * (gameContainerHeight - itemHeight))
      );
    };

    do {
      let randomClothesPosition = randomPosition(
        character.clothes.element.offsetWidth,
        character.clothes.element.offsetHeight
      );
      character.clothes.setPosition(
        randomClothesPosition.x,
        randomClothesPosition.y
      );
    } while (
      this.characters.some((otherCharacter) =>
        character.clothes.collidesWith(otherCharacter)
      )
    );

    character.items.forEach((item) => {
      do {
        let randomItemPosition = randomPosition(
          item.element.offsetWidth,
          item.element.offsetHeight
        );
        item.setPosition(randomItemPosition.x, randomItemPosition.y);
      } while (
        this.characters.some((otherCharacter) =>
          item.collidesWith(otherCharacter)
        ) ||
        this.characters.some((otherCharacter) =>
          otherCharacter.items.some(
            (otherItem) => item.collidesWith(otherItem) && otherItem !== item
          )
        )
      );
    });
  }

  isClothingOver() {
    return this.characters.every((character) => character.isClothed());
  }

  isGameOver() {
    return this.characters.every((character) => character.isFullyDressed());
  }

  async gameLoop() {
    if (this.isGameOver()) {
      this.gameScore.updateHighscore();
      clearInterval(this.loop);
      showGameOver();
      return;
    } else if (this.isClothingOver()) {
      this.characters.forEach((character) =>
        character.items.forEach((item) => item.show())
      );
    }
    if (this.gameScoreStarted) {
      this.gameScore.updateScore();
    }
  }
}

function onLocaleChange() {
  new Game();
};
