var PAUSE = false;
var LOCK = false;

var HIGHSCORE = getHighScore("pacman");
var SCORE = 0;
var SCORE_BUBBLE = 10;
var SCORE_SUPER_BUBBLE = 50;
var SCORE_GHOST_COMBO = 200;

const MAX_LIFES = 4;
var LIFES = 2;
var GAMEOVER = false;

var LEVEL = 1;
var LEVEL_NEXT_TIMER = -1;
var LEVEL_NEXT_STATE = 0;

var TIME_GENERAL_TIMER = -1;
var TIME_GAME = 0;
var TIME_LEVEL = 0;
var TIME_LIFE = 0;
var TIME_FRUITS = 0;

var HELP_DELAY = 1500;
var HELP_TIMER = -1;

function initGame(newgame) {
  if (newgame) {
    GAMEOVER = false;

    $("#help").fadeOut("slow");

    score(0);
    clearMessage();
    $("#home").hide();
    $("#panel").show();
    document.getElementById("start").style.display = "none";
  }

  initBoard();
  drawBoard();
  drawBoardDoor();

  initPaths();
  drawPaths();

  initBubbles();
  drawBubbles();

  initFruits();

  PACMAN.init();
  PACMAN.draw();

  initGhosts();
  drawGhosts();

  lifes();

  ready();
}

function win() {
  LOCK = true;
  PACMAN.stop();
  stopGhosts();
  stopBlinkSuperBubbles();
  stopTimes();

  eraseGhosts();

  setTimeout("prepareNextLevel()", 1000);
}
function prepareNextLevel(i) {
  if (LEVEL_NEXT_TIMER === -1) {
    eraseBoardDoor();
    LEVEL_NEXT_TIMER = setInterval("prepareNextLevel()", 250);
  } else {
    LEVEL_NEXT_STATE++;
    drawBoard(LEVEL_NEXT_STATE % 2 === 0);

    if (LEVEL_NEXT_STATE > 6) {
      LEVEL_NEXT_STATE = 0;
      clearInterval(LEVEL_NEXT_TIMER);
      LEVEL_NEXT_TIMER = -1;
      nextLevel();
    }
  }
}
function nextLevel() {
  LOCK = false;

  LEVEL++;

  PACMAN.erase();
  eraseGhosts();

  PACMAN.reset();
  resetGhosts();

  initGame();

  TIME_LEVEL = 0;
  TIME_LIFE = 0;
  TIME_FRUITS = 0;
}

function retry() {
  stopTimes();

  PACMAN.erase();
  eraseGhosts();

  PACMAN.reset();
  resetGhosts();

  PACMAN.draw();
  drawGhosts();

  TIME_LIFE = 0;
  TIME_FRUITS = 0;

  ready();
}

function ready() {
  LOCK = true;
  message("ready!");

  setTimeout("go()", "4100");
}
function go() {
  LOCK = false;

  startTimes();

  clearMessage();
  blinkSuperBubbles();

  PACMAN.move();

  moveGhosts();
}
function startTimes() {
  if (TIME_GENERAL_TIMER === -1) {
    TIME_GENERAL_TIMER = setInterval("times()", 1000);
  }
}
function times() {
  TIME_GAME++;
  TIME_LEVEL++;
  TIME_LIFE++;
  TIME_FRUITS++;

  fruit();
}
function pauseTimes() {
  if (TIME_GENERAL_TIMER != -1) {
    clearInterval(TIME_GENERAL_TIMER);
    TIME_GENERAL_TIMER = -1;
  }
  if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.pause();
}
function resumeTimes() {
  startTimes();
  if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.resume();
}
function stopTimes() {
  if (TIME_GENERAL_TIMER != -1) {
    clearInterval(TIME_GENERAL_TIMER);
    TIME_GENERAL_TIMER = -1;
  }
  if (FRUIT_CANCEL_TIMER != null) {
    FRUIT_CANCEL_TIMER.cancel();
    FRUIT_CANCEL_TIMER = null;
    eraseFruit();
  }
}

function pauseGame() {
  if (!PAUSE) {
    PAUSE = true;

    message("pause");

    pauseTimes();
    PACMAN.pause();
    pauseGhosts();
    stopBlinkSuperBubbles();
  }
}
function resumeGame() {
  if (PAUSE) {
    PAUSE = false;

    clearMessage();

    resumeTimes();
    PACMAN.resume();
    resumeGhosts();
    blinkSuperBubbles();
  }
}

function lifes(l) {
  if (l) {
    LIFES += l;
  }

  var canvas = document.getElementById("canvas-lifes");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    image_size = canvas.width / MAX_LIFES;

    for (var i = 0, imax = LIFES; i < imax && i < MAX_LIFES; i++) {
      ctx.drawImage(PACMAN_IMAGE[0], i * image_size, 0, image_size, image_size);
    }
  }
}

function gameover() {
  GAMEOVER = true;
  showGameOver()
  document.getElementById("start").style.display = "flex";
  message("game over");
  stopTimes();

  PACMAN.erase();
  eraseGhosts();

  PACMAN.reset();
  resetGhosts();

  TIME_GAME = 0;
  TIME_LEVEL = 0;
  TIME_LIFE = 0;
  TIME_FRUITS = 0;

  LIFES = 2;
  LEVEL = 1;
  SCORE = 0;
}

function message(m) {
  $("#message").html(m);
  if (m === "game over") $("#message").addClass("red");
}
function clearMessage() {
  $("#message").html("");
  $("#message").removeClass("red");
}

function score(s, type) {
  var scoreBefore = (SCORE / 10000) | 0;

  SCORE += s;
  document.getElementById("score").innerHTML = SCORE;

  var scoreAfter = (SCORE / 10000) | 0;
  if (scoreAfter > scoreBefore) {
    lifes(+1);
  }

  if (SCORE > HIGHSCORE) {
    HIGHSCORE = SCORE;
    setHighScore("pacman", HIGHSCORE);
    document.getElementById("highscore").innerHTML = HIGHSCORE;
  }

  if (
    type &&
    (type === "clyde" ||
      type === "pinky" ||
      type === "inky" ||
      type === "blinky")
  ) {
    PACMAN.erase();
    GHOSTS[type].erase()
    $("#board").append('<span class="combo">' + SCORE_GHOST_COMBO + "</span>");
    $("#board span.combo").css(
      "top",
      GHOSTS[type].positionY - 10 + "px"
    );
    $("#board span.combo").css(
      "left",
      GHOSTS[type].positionX - 10 + "px"
    );
    SCORE_GHOST_COMBO = SCORE_GHOST_COMBO * 2;
  } else if (type && type === "fruit") {
    $("#board").append('<span class="fruits">' + s + "</span>");
    $("#board span.fruits").css("top", FRUITS_POSITION_Y - 14 + "px");
    $("#board span.fruits").css("left", FRUITS_POSITION_X - 14 + "px");
  }
}
