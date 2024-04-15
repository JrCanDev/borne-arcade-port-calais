class Pacman {
  constructor() {
      this.direction = 3;
      this.directionTry = -1;
      this.directionTryTimer = null;
      this.directionTryCancel = 1000;
      this.positionX = 276;
      this.positionY = 416;
      this.positionStep = 2;
      this.size = 16;
      this.moving = false;
      this.movingTimer = null;
      this.movingSpeed = 15;
      this.canvasContext = null;
      this.eatGap = 15;
      this.ghostGap = 20;
      this.fruitsGap = 15;
      this.retrySpeed = 2100;
      this.dead = false;
  }

  init() {
    var canvas = document.getElementById("canvas-pacman");
    canvas.setAttribute("width", "550");
    canvas.setAttribute("height", "550");
    if (canvas.getContext) {
      this.canvasContext = canvas.getContext("2d");
    }
  }

  reset() {
    this.stop();

    this.direction = 3;
    this.directionTry = -1;
    this.directionTryTimer = null;
    this.positionX = 276;
    this.positionY = 416;
    this.moving = false;
    this.movingTimer = null;
    this.dead = false;
    this.super = false;
  }

  stop() {
    if (this.movingTimer) {
      clearInterval(this.movingTimer);
      this.movingTimer = null;
      this.moving = false;
    }
  }

  pause() {
    if (this.directionTryTimer != null) {
      this.directionTryTimer.pause();
    }

    this.stop();  
  }

  resume() {
    if (this.directionTryTimer != null) {
      this.directionTryTimer.resume();
    }

    this.move();
  }

  tryMoveCancel() {
    if (this.directionTryTimer != null) {
      this.directionTryTimer.cancel();
      this.directionTry = -1;
      this.directionTryTimer = null;
    }
  }

  tryMove(direction) {
    this.directionTry = direction;
    this.directionTryTimer = new Timer(
      () => this.tryMoveCancel(),
      this.directionTryCancel
    );
  }

  move(direction) {
    if (GAMEOVER) return;

    if (!this.moving) {
      this.moving = true;
      this.draw();
      this.movingTimer = setInterval(() => this.move(), this.movingSpeed);
    }

    var directionTry = direction;
    var quarterChangeDirection = false;

    if (!directionTry && this.directionTry != -1) {
      directionTry = this.directionTry;
    }

    if (!directionTry || this.direction !== directionTry) {
      if (directionTry) {
        if (this.canMove(directionTry)) {
          if (
            this.direction + 1 === directionTry ||
            this.direction - 1 === directionTry ||
            this.direction + 1 === directionTry ||
            (this.direction === 4 && directionTry === 1) ||
            (this.direction === 1 && directionTry === 4)
          ) {
            quarterChangeDirection = true;
          }
          this.direction = directionTry;
          this.tryMoveCancel();
        } else {
          if (directionTry !== this.directionTry) {
            this.tryMoveCancel();
          }
          if (this.directionTry === -1) {
            this.tryMove(directionTry);
          }
        }
      }

      if (this.canMove(this.direction)) {
        this.erase();

        var speedUp = 0;
        if (quarterChangeDirection) {
          speedUp = 6;
        }

        if (this.direction === 1) {
          this.positionX += this.positionStep + speedUp;
        } else if (this.direction === 2) {
          this.positionY += this.positionStep + speedUp;
        } else if (this.direction === 3) {
          this.positionX -= this.positionStep + speedUp;
        } else if (this.direction === 4) {
          this.positionY -= this.positionStep + speedUp;
        }

        if (this.positionX === 2 && this.positionY === 258) {
          this.positionX = 548;
          this.positionY = 258;
        } else if (this.positionX === 548 && this.positionY === 258) {
          this.positionX = 2;
          this.positionY = 258;
        }

        this.draw();

        this.testBubbles();
        this.testGhosts();
        this.testFruits();
      } else {
        this.stop();
      }
    } else if (direction && this.direction === direction) {
      this.tryMoveCancel();
    }
  }

  canMove(direction) {
    if (PAUSE || PACMAN.dead || LOCK) return false;
    var positionX = this.positionX;
    var positionY = this.positionY;

    if (positionX === 276 && positionY === 204 && direction === 2) return false;

    if (direction === 1) {
      positionX += this.positionStep;
    } else if (direction === 2) {
      positionY += this.positionStep;
    } else if (direction === 3) {
      positionX -= this.positionStep;
    } else if (direction === 4) {
      positionY -= this.positionStep;
    }

    for (var i = 0, imax = PATHS.length; i < imax; i++) {
      var p = PATHS[i];
      var c = p.split("-");
      var cx = c[0].split(",");
      var cy = c[1].split(",");

      var startX = cx[0];
      var startY = cx[1];
      var endX = cy[0];
      var endY = cy[1];

      if (
        positionX >= startX &&
        positionX <= endX &&
        positionY >= startY &&
        positionY <= endY
      ) {
        return true;
      }
    }

    return false;
  }

  draw() {
    this.canvasContext.drawImage(
      PACMAN_IMAGE[this.direction - 1],
      this.positionX - this.size,
      this.positionY - this.size,
      this.size * 2,
      this.size * 2
    );
  }

  erase() {
    this.canvasContext.clearRect(
      this.positionX - 2 - this.size,
      this.positionY - 2 - this.size,
      this.size * 2 + 5,
      this.size * 2 + 5
    );
  }

  kill() {
    playDieSound();

    LOCK = true;
    PACMAN.dead = true;
    stop();
    stopGhosts();
    pauseTimes();
    stopBlinkSuperBubbles();

    this.erase();
    if (LIFES > 0) {
      lifes(-1);
      setTimeout(retry, this.retrySpeed);
    } else {
      gameover();
    }
  }

  testGhosts() {
    Object.values(GHOSTS).forEach((ghost) => ghost.testPacman());
  }

  testFruits() {
    if (FRUIT_CANCEL_TIMER != null) {
      if (
        FRUITS_POSITION_X <= this.positionX + this.fruitsGap &&
        FRUITS_POSITION_X >= this.positionX - this.fruitsGap &&
        FRUITS_POSITION_Y <= this.positionY + this.fruitsGap &&
        FRUITS_POSITION_Y >= this.positionY - this.fruitsGap
      ) {
        eatFruit();
      }
    }
  }

  testBubbles() {
    var r = {
      x: this.positionX - this.size,
      y: this.positionY - this.size,
      width: this.size * 2,
      height: this.size * 2,
    };

    for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i++) {
      var bubble = BUBBLES_ARRAY[i];

      var bubbleParams = bubble.split(";");
      var testX = parseInt(bubbleParams[0].split(",")[0]);
      var testY = parseInt(bubbleParams[0].split(",")[1]);
      var p = { x: testX, y: testY };

      if (isPointInRect(p, r)) {
        if (bubbleParams[4] === "0") {
          var type = bubbleParams[3];

          eraseBubble(type, testX, testY);
          BUBBLES_ARRAY[i] = bubble.substr(0, bubble.length - 1) + "1";

          if (type === "s") {
            setSuperBubbleOnXY(testX, testY, "1");
            score(SCORE_SUPER_BUBBLE);
            playEatPillSound();
            affraidGhosts();
          } else {
            score(SCORE_BUBBLE);
            playEatingSound();
          }
          BUBBLES_COUNTER--;
          if (BUBBLES_COUNTER === 0) {
            win();
          }
        } else {
          stopEatingSound();
        }
      }
    }
  }
}

const PACMAN = new Pacman();