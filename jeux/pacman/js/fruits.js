var FRUITS_CANVAS_CONTEXT = null;
var LEVEL_FRUITS_CANVAS_CONTEXT = null;
var FRUITS_SIZE = 30;

var FRUITS_POSITION_X = 276;
var FRUITS_POSITION_Y = 310;

var FRUIT_MINIMUM_START = 15;
var FRUIT_CANCEL_TIMER = null;
var FRUIT_CANCEL_SPEED = 7500;
var FRUIT = null;

function initFruits() {
  var canvas = document.getElementById("canvas-fruits");
  canvas.setAttribute("width", "550");
  canvas.setAttribute("height", "550");
  if (canvas.getContext) {
    FRUITS_CANVAS_CONTEXT = canvas.getContext("2d");
  }

  var levelCanvas = document.getElementById("canvas-level-fruits");
  if (levelCanvas.getContext) {
    LEVEL_FRUITS_CANVAS_CONTEXT = levelCanvas.getContext("2d");
  }

  var ctx = getLevelFruitsCanvasContext();
  const FRUITS = ["cherry", "strawberry", "orange", "apple", "melon", "galboss", "bell", "key"];
  const FRUIT_CANVAS_HEIGHT = 60;
  const FRUIT_CANVAS_WIDTH = FRUIT_CANVAS_HEIGHT * FRUITS.length;
  const FRUIT_CANVAS_SIZE = 50;
  const FRUIT_CANVAS_GAP = 8;

  ctx.clearRect(0, 0, FRUIT_CANVAS_WIDTH, FRUIT_CANVAS_HEIGHT);
  
  var x = FRUIT_CANVAS_WIDTH - FRUIT_CANVAS_SIZE;
  var y = FRUIT_CANVAS_HEIGHT/2;
  
  for (let i = 0; i < LEVEL; i++) {
    const fruit = FRUITS[i] || FRUITS[FRUITS.length - 1];
    drawFruit(ctx, fruit, x - (i + 0.5) % 7 * (FRUIT_CANVAS_SIZE + FRUIT_CANVAS_GAP), y, FRUIT_CANVAS_SIZE);
  }
}

function getFruitsCanvasContext() {
  return FRUITS_CANVAS_CONTEXT;
}
function getLevelFruitsCanvasContext() {
  return LEVEL_FRUITS_CANVAS_CONTEXT;
}

function eatFruit() {
  playEatFruitSound();

  var s = 0;
  if (FRUIT === "cherry") s = 100;
  else if (FRUIT === "strawberry") s = 300;
  else if (FRUIT === "orange") s = 500;
  else if (FRUIT === "apple") s = 700;
  else if (FRUIT === "melon") s = 1000;
  else if (FRUIT === "galboss") s = 2000;
  else if (FRUIT === "bell") s = 3000;
  else if (FRUIT === "key") s = 5000;

  score(s, "fruit");
  cancelFruit();
}

function fruit() {
  if (TIME_FRUITS === 2 && $("#board .fruits").length > 0) {
    $("#board .fruits").remove();
  }
  if (TIME_FRUITS > FRUIT_MINIMUM_START) {
    if (anyGoodIdea() > 3) {
      oneFruit();
    }
  }
}
function oneFruit() {
  if (FRUIT_CANCEL_TIMER === null) {
    var ctx = getFruitsCanvasContext();

    if (LEVEL === 1) FRUIT = "cherry";
    else if (LEVEL === 2) FRUIT = "strawberry";
    else if (LEVEL === 3 || LEVEL === 4) FRUIT = "orange";
    else if (LEVEL === 5 || LEVEL === 6) FRUIT = "apple";
    else if (LEVEL === 7 || LEVEL === 8) FRUIT = "melon";
    else if (LEVEL === 9 || LEVEL === 10) FRUIT = "galboss";
    else if (LEVEL === 11 || LEVEL === 12) FRUIT = "bell";
    else if (LEVEL === 13) FRUIT = "key";

    drawFruit(ctx, FRUIT, FRUITS_POSITION_X, FRUITS_POSITION_Y, FRUITS_SIZE);
    FRUIT_CANCEL_TIMER = new Timer("cancelFruit()", FRUIT_CANCEL_SPEED);
  }
}
function cancelFruit() {
  eraseFruit();
  FRUIT_CANCEL_TIMER.cancel();
  FRUIT_CANCEL_TIMER = null;
  TIME_FRUITS = 0;
}

function eraseFruit() {
  var ctx = getFruitsCanvasContext();
  ctx.clearRect(
    FRUITS_POSITION_X - FRUITS_SIZE,
    FRUITS_POSITION_Y - FRUITS_SIZE,
    FRUITS_SIZE * 2,
    FRUITS_SIZE * 2
  );
}

function drawFruit(ctx, f, x, y, size) {
  ctx.save();

  ctx.drawImage(
    FRUIT_IMAGES[f],
    x - size / 2,
    y - size / 2,
    size,
    size
  );

  ctx.restore();
}
