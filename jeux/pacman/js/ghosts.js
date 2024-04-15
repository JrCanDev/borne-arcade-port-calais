const GHOST_POSITION_STEP = 2;
const GHOST_MOVING_SPEED = 15;
const GHOST_TUNNEL_MOVING_SPEED = 35;
const GHOST_AFFRAID_MOVING_SPEED = 40;
const GHOST_EAT_MOVING_SPEED = 6;
const GHOST_AFFRAID_TIME = 8500;
const GHOST_EAT_TIME = 5500;
const GHOST_BODY_STATE_MAX = 6;

class Ghost {
  constructor(name, positionX, positionY, direction, bodyState) {
    this.name = name;
    this.canvasContext = null;
    this.positionX = positionX;
    this.positionY = positionY;
    this.direction = direction;
    this.movingTimer = -1;
    this.moving = false;
    this.bodyState = bodyState;
    this.state = 0;
    this.eatTimer = null;
    this.afraidTimer = null;
    this.afraidState = 0;
    this.tunnel = false;

    this.initialPositionX = positionX;
    this.initialPositionY = positionY;
    this.initialDirection = direction;
    this.initialBodyState = bodyState;
  }

  init() {
    var canvas = document.getElementById("canvas-ghost-" + this.name);
    canvas.setAttribute("width", "550");
    canvas.setAttribute("height", "550");
    if (canvas.getContext) {
      this.canvasContext = canvas.getContext("2d");
    }
  }

  reset() {
    this.stop();

    this.positionX = this.initialPositionX;
    this.positionY = this.initialPositionY;
    this.direction = this.initialDirection;
    this.moving = false;
    this.bodyState = this.initialBodyState;
    this.state = 0;
    this.eatTimer = null;
    this.afraidTimer = null;
    this.afraidState = 0;
    this.tunnel = false;
  }

  draw() {
    let name = this.name;
    if (this.afraidTimer) name = "affraid";

    this.canvasContext.drawImage(GHOSTS_IMAGES[name][this.direction], this.positionX - 16, this.positionY - 16, 32, 32);
  }

  stop() {
    if (this.state === 1) {
      if (this.afraidTimer) this.afraidTimer.cancel();
      this.afraidTimer = null;
      this.afraidState = 0;
    } else if (this.state === -1) {
      if (this.eatTimer) this.eatTimer.cancel();
      this.eatTimer = null;
    }

    this.state = 0;

    if (this.movingTimer !== -1) {
      clearInterval(this.movingTimer);
      this.movingTimer = -1;
      this.moving = false;
    }
  }

  affraid() {
    if (this.afraidTimer) this.afraidTimer.cancel();
    this.afraidState = 0;
    if (this.state === 0 || this.state === 1) {
      this.stop();
      this.state = 1;
      this.move();
      this.afraidTimer = new Timer(
        () => this.cancelAffraid(),
        GHOST_AFFRAID_TIME
      );
    }
  }

  cancelAffraid() {
    if (this.state === 1) {
      this.afraidTimer.cancel();
      this.afraidTimer = null;
      this.stop();
      this.state = 0;
      this.move();
      testStateGhosts()
    }
  }
  
  startEat() {
    if (!LOCK) {
      playEatGhostSound();

      LOCK = true;

      if (this.afraidTimer) {
        this.afraidTimer.cancel();
        this.afraidTimer = null;
      }

      score(SCORE_GHOST_COMBO, this.name);

      pauseGhosts();
      PACMAN.pause();

      setTimeout(() => this.eat(), 600);
    }
  }

  eat() {
    playGhostEatenSound();

    if (this.state === 1) {
      $("#board span.combo").remove();
      this.state = -1;
      this.eatTimer = new Timer(() => this.cancelEat(), GHOST_EAT_TIME);
      this.eatTimer.pause();
    }

    LOCK = false;

    resumeGhosts();
    PACMAN.resume();
  } 

  cancelEat() {
    if (this.state === -1) {
      this.eatTimer.cancel();
      this.eatTimer = null;
      this.stop();
      this.state = 0;
      this.move();
      testStateGhosts();
    }
  }

  move() {
    if (!this.moving) {
      this.moving = true;

      var speed = -1;
      if (this.state === 1) {
        speed = GHOST_AFFRAID_MOVING_SPEED;
      } else if (this.state === 0) {
        if (!this.tunnel) {
          speed = GHOST_MOVING_SPEED;
        } else {
          speed = GHOST_TUNNEL_MOVING_SPEED;
        }
      } else {
        speed = GHOST_EAT_MOVING_SPEED;
      }

      this.movingTimer = setInterval(() => {this.move()}, speed);
    } else {
      this.changeDirection();

      if (this.afraidTimer) {
        var remain = this.afraidTimer.remain();
        if (
          (remain >= 2500 && remain < 3000) ||
          (remain >= 1500 && remain <= 2000) ||
          (remain >= 500 && remain <= 1000) ||
          remain < 0
        ) {
          this.afraidState = 1;
        } else if (
          (remain > 2000 && remain < 2500) ||
          (remain > 1000 && remain < 1500) ||
          (remain >= 0 && remain < 500)
        ) {
          this.afraidState = 0;
        }
      }

      if (this.canMove()) {
        this.erase();

        if (this.bodyState < GHOST_BODY_STATE_MAX) {
          this.bodyState++;
        } else {
          this.bodyState = 0;
        }

        if (this.direction === 1) {
          this.positionX += GHOST_POSITION_STEP;
        } else if (this.direction === 2) {
          this.positionY += GHOST_POSITION_STEP;
        } else if (this.direction === 3) {
          this.positionX -= GHOST_POSITION_STEP;
        } else if (this.direction === 4) {
          this.positionY -= GHOST_POSITION_STEP;
        }

        if (this.positionX === 2 && this.positionY === 258) {
          this.positionX = 548;
          this.positionY = 258;
        } else if (this.positionX === 548 && this.positionY === 258) {
          this.positionX = 2;
          this.positionY = 258;
        }

        this.draw();

        if (this.bodyState === 3 && this.state != -1) {
          if (!PACMAN.moving) {
            this.testPacman();
          }
          this.testTunnel();
        }
      } else {
        this.direction = oneDirection();
      }
    }
  }

  testTunnel() {
    if (this.state === 0) {
      if (this.isInTunnel() && !this.tunnel) {
        this.stop();
        this.tunnel = true;
        this.move();
      } else if (!this.isInTunnel() && this.tunnel) {
        this.stop();
        this.tunnel = false;
        this.move();
      }
    }
  }

  isInTunnel() {
    return (
      this.positionX >= 2 &&
      this.positionX <= 106 &&
      this.positionY === 258
    ) || (
      this.positionX >= 462 &&
      this.positionX <= 548 &&
      this.positionY === 258
    ) 
  }

  changeDirection() {
    let tryDirection = oneDirection();

    if (this.state === 0 || this.state === 1) {
      if (this.positionX != 276 && this.positionY != 258) {
        var pacmanX = PACMAN.positionX;
        var pacmanY = PACMAN.positionY;
        var axe = oneAxe();
        if (this.name === "blinky") {
          var nothing = whatsYourProblem();
          if (nothing < 6) {
            tryDirection = getRightDirection(
              axe,
              this.positionX,
              this.positionY,
              pacmanX,
              pacmanY
            );
            if (
              !(
                this.canMove(tryDirection) &&
                this.direction != tryDirection - 2 &&
                this.direction != tryDirection + 2
              )
            ) {
              axe++;
              if (axe > 2) axe = 1;
              tryDirection = getRightDirection(
                axe,
                this.positionX,
                this.positionY,
                pacmanX,
                pacmanY
              );
            }
          }
        } else if (this.name === "pinky") {
          var nothing = whatsYourProblem();
          if (nothing < 3) {
            tryDirection = getRightDirection(
              axe,
              this.positionX,
              this.positionY,
              pacmanX,
              pacmanY
            );
            if (
              !(
                this.canMove(tryDirection) &&
                this.direction != tryDirection - 2 &&
                this.direction != tryDirection + 2
              )
            ) {
              axe++;
              if (axe > 2) axe = 1;
              tryDirection = getRightDirection(
                axe,
                this.positionX,
                this.positionY,
                pacmanX,
                pacmanY
              );
            }
            tryDirection = reverseDirection(tryDirection);
          }
        } else if (this.name === "inky") {
          var good = anyGoodIdea();
          if (good < 3) {
            tryDirection = getRightDirection(
              axe,
              this.positionX,
              this.positionY,
              pacmanX,
              pacmanY
            );
            if (
              !(
                this.canMove(tryDirection) &&
                this.direction != tryDirection - 2 &&
                this.direction != tryDirection + 2
              )
            ) {
              axe++;
              if (axe > 2) axe = 1;
              tryDirection = getRightDirection(
                axe,
                this.positionX,
                this.positionY,
                pacmanX,
                pacmanY
              );
            }
          }
        }
      }
      if (this.state === 1) {
        tryDirection = reverseDirection(tryDirection);
      }
    } else {
      var axe = oneAxe();
      tryDirection = getRightDirectionForHome(axe, this.positionX, this.positionY);
      if (
        this.canMove(tryDirection) &&
        this.direction != tryDirection - 2 &&
        this.direction != tryDirection + 2
      ) {
      } else {
        axe++;
        if (axe > 2) axe = 1;
        tryDirection = getRightDirectionForHome(axe, this.positionX, this.positionY);
      }
    }

    if (
      this.canMove(tryDirection) &&
      this.direction != tryDirection - 2 &&
      this.direction != tryDirection + 2
    ) {
      this.direction = tryDirection;
    }
  }

  erase() {
    this.canvasContext.clearRect(this.positionX - 17, this.positionY - 17, 34, 34);
  }

  canMove(direction) {
    if (!direction) direction = this.direction;

    if (this.positionX === 276 && this.positionY === 204 && direction === 2 && this.state === 0)
      return false;

    let testPositionX = this.positionX;
    let testPositionY = this.positionY;

    if (direction === 1) {
      testPositionX += GHOST_POSITION_STEP;
    } else if (direction === 2) {
      testPositionY += GHOST_POSITION_STEP;
    } else if (direction === 3) {
      testPositionX -= GHOST_POSITION_STEP;
    } else if (direction === 4) {
      testPositionY -= GHOST_POSITION_STEP;
    }

    for (var i = 0, imax = PATHS.length; i < imax; i++) {
      var p = PATHS[i];

      var startX = p.split("-")[0].split(",")[0];
      var startY = p.split("-")[0].split(",")[1];
      var endX = p.split("-")[1].split(",")[0];
      var endY = p.split("-")[1].split(",")[1];

      if (
        testPositionX >= startX &&
        testPositionX <= endX &&
        testPositionY >= startY &&
        testPositionY <= endY
      ) {
        return true;
      }
    }

    return false;
  }

  pause() {
    if (this.state === 1) {
      if (this.afraidTimer) this.afraidTimer.pause();
    } else if (this.state === -1) {
      if (this.eatTimer) this.eatTimer.pause();
    }

    if (this.movingTimer !== -1) {
      clearInterval(this.movingTimer);
      this.movingTimer = -1;
      this.moving = false;
    }
  }

  resume() {
    if (this.state === 1) {
      if (this.afraidTimer) this.afraidTimer.resume();
    } else if (this.state === -1) {
      if (this.eatTimer) this.eatTimer.resume();
    }

    if (this.movingTimer === -1) {
      this.moving = false;
      this.move();
    }
  }

  testPacman() {
    if (
      this.positionX <= PACMAN.positionX + PACMAN.ghostGap &&
      this.positionX >= PACMAN.positionX - PACMAN.ghostGap &&
      this.positionY <= PACMAN.positionY + PACMAN.ghostGap &&
      this.positionY >= PACMAN.positionY - PACMAN.ghostGap
    ) {
      if (this.state === 0) {
        PACMAN.kill();
      } else if (this.state === 1) {
        this.startEat();
      }
    }
  }
}

const GHOSTS = {
  blinky: new Ghost('blinky', 276, 204, 1, 0),
  pinky: new Ghost('pinky', 276, 258, 2, 1),
  inky: new Ghost('inky', 238, 258, 3, 2),
  clyde: new Ghost('clyde', 314, 258, 4, 3)
};

function initGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.init());
}

function resetGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.reset());
}
function drawGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.draw());
}

function affraidGhosts() {
  playWazaSound();

  SCORE_GHOST_COMBO = 200;

  Object.values(GHOSTS).forEach((ghost) => ghost.affraid());
}

function testStateGhosts() {
  if (
    Object.values(GHOSTS).some((ghost) => ghost.state === 1)
  ) {
    playWazaSound();
  } else if (
    Object.values(GHOSTS).some((ghost) => ghost.state === -1)
  ) {
    playGhostEatenSound();
  } else {
    playSirenSound();
  }
}

function moveGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.move());
}

function getRightDirectionForHome(axe, ghostX, ghostY) {
  var homeX = 276;
  var homeY = 204;

  if (ghostY === 204 && ghostX === 276) {
    return 2;
  } else if (ghostX === 276 && ghostY === 258) {
    return oneDirectionX();
  } else {
    if (axe === 1) {
      if (ghostX > homeX) {
        return 3;
      } else {
        return 1;
      }
    } else {
      if (ghostY > homeY) {
        return 4;
      } else {
        return 2;
      }
    }
  }
}
function getRightDirection(axe, ghostX, ghostY, pacmanX, pacmanY) {
  if (axe === 1) {
    if (ghostX > pacmanX) {
      return 3;
    } else {
      return 1;
    }
  } else {
    if (ghostY > pacmanY) {
      return 4;
    } else {
      return 2;
    }
  }
}
function reverseDirection(direction) {
  if (direction > 2) return direction - 2;
  else return direction + 2;
}

function eraseGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.erase());
}

function oneDirection() {
  return Math.floor(Math.random() * (4 - 1 + 1) + 1);
}
function oneDirectionX() {
  var direction = oneDirection();
  if (direction === 4 || direction === 2) direction -= 1;
  return direction;
}
function oneDirectionY() {
  var direction = oneDirection();
  if (direction === 3 || direction === 1) direction -= 1;
  return direction;
}

function stopGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.stop());
}

function pauseGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.pause());
}

function resumeGhosts() {
  Object.values(GHOSTS).forEach((ghost) => ghost.resume());
}