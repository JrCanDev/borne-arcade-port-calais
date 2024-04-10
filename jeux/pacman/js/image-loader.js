async function loadImage(imageUrl) {
  let img;
  const imageLoadPromise = new Promise((resolve) => {
    img = new Image();
    img.onload = resolve;
    img.src = imageUrl;
  });

  await imageLoadPromise;
  return img;
}

// In order to solve some bugs related to slow image loading due to re-building the Image object each time we add something in the canva,
// I decided that custom Images are loaded once here, then used everywhere needed, as a global var
let PACMAN_IMAGE = new Array();

let BUBBLE_IMAGE;
let SUPER_BUBBLE_IMAGE;
let BACKGROUND_IMAGE;

let CHERRY_IMAGE;
let STRAWBERRY_IMAGE;
let ORANGE_IMAGE;
let APPLE_IMAGE;
let MELON_IMAGE;
let GALBOSS_IMAGE;
let BELL_IMAGE;
let KEY_IMAGE;

let GHOST_1_IMAGE;
let GHOST_1_UP_IMAGE;
let GHOST_1_RIGHT_IMAGE;
let GHOST_1_DOWN_IMAGE;
let GHOST_1_LEFT_IMAGE;
let GHOST_2_IMAGE;
let GHOST_2_UP_IMAGE;
let GHOST_2_RIGHT_IMAGE;
let GHOST_2_DOWN_IMAGE;
let GHOST_2_LEFT_IMAGE;
let GHOST_3_IMAGE;
let GHOST_3_UP_IMAGE;
let GHOST_3_RIGHT_IMAGE;
let GHOST_3_DOWN_IMAGE;
let GHOST_3_LEFT_IMAGE;
let GHOST_4_IMAGE;
let GHOST_4_UP_IMAGE;
let GHOST_4_RIGHT_IMAGE;
let GHOST_4_DOWN_IMAGE;
let GHOST_4_LEFT_IMAGE;
let GHOST_AFFRAID_IMAGE;
let GHOST_AFFRAID_UP_IMAGE;
let GHOST_AFFRAID_RIGHT_IMAGE;
let GHOST_AFFRAID_DOWN_IMAGE;
let GHOST_AFFRAID_LEFT_IMAGE;
// Yes, that's a lot of variables, that I would prefer to avoid, but I'm following what the original creator did ¯\_(ツ)_/¯

async function preloadRequiredImages() {
  for (let i = 1; i < 5; i++) {
    PACMAN_IMAGE.push(await loadImage("img/pacman/" + i + ".png"));
  }

  BACKGROUND_IMAGE = await loadImage("img/background.png");
  SUPER_BUBBLE_IMAGE = await loadImage("img/bubbles/superbubble.png");
  BUBBLE_IMAGE = await loadImage("img/bubbles/bubble.png");

  CHERRY_IMAGE = await loadImage("img/fruits/cherry.png");
  STRAWBERRY_IMAGE = await loadImage("img/fruits/strawberry.png");
  ORANGE_IMAGE = await loadImage("img/fruits/orange.png");
  APPLE_IMAGE = await loadImage("img/fruits/apple.png");
  MELON_IMAGE = await loadImage("img/fruits/melon.png");
  GALBOSS_IMAGE = await loadImage("img/fruits/galboss.png");
  BELL_IMAGE = await loadImage("img/fruits/bell.png");
  KEY_IMAGE = await loadImage("img/fruits/key.png");

  GHOST_1_IMAGE = await loadImage("img/ghosts/ghost1.png");
  GHOST_1_UP_IMAGE = await loadImage("img/ghosts/ghost1Up.png");
  GHOST_1_RIGHT_IMAGE = await loadImage("img/ghosts/ghost1Right.png");
  GHOST_1_DOWN_IMAGE = await loadImage("img/ghosts/ghost1Down.png");
  GHOST_1_LEFT_IMAGE = await loadImage("img/ghosts/ghost1Left.png");
  GHOST_2_IMAGE = await loadImage("img/ghosts/ghost2.png");
  GHOST_2_UP_IMAGE = await loadImage("img/ghosts/ghost2Up.png");
  GHOST_2_RIGHT_IMAGE = await loadImage("img/ghosts/ghost2Right.png");
  GHOST_2_DOWN_IMAGE = await loadImage("img/ghosts/ghost2Down.png");
  GHOST_2_LEFT_IMAGE = await loadImage("img/ghosts/ghost2Left.png");
  GHOST_3_IMAGE = await loadImage("img/ghosts/ghost3.png");
  GHOST_3_UP_IMAGE = await loadImage("img/ghosts/ghost3Up.png");
  GHOST_3_RIGHT_IMAGE = await loadImage("img/ghosts/ghost3Right.png");
  GHOST_3_DOWN_IMAGE = await loadImage("img/ghosts/ghost3Down.png");
  GHOST_3_LEFT_IMAGE = await loadImage("img/ghosts/ghost3Left.png");
  GHOST_4_IMAGE = await loadImage("img/ghosts/ghost4.png");
  GHOST_4_UP_IMAGE = await loadImage("img/ghosts/ghost4Up.png");
  GHOST_4_RIGHT_IMAGE = await loadImage("img/ghosts/ghost4Right.png");
  GHOST_4_DOWN_IMAGE = await loadImage("img/ghosts/ghost4Down.png");
  GHOST_4_LEFT_IMAGE = await loadImage("img/ghosts/ghost4Left.png");
  GHOST_AFFRAID_IMAGE = await loadImage("img/ghosts/ghostAffraid.png");
  GHOST_AFFRAID_UP_IMAGE = await loadImage("img/ghosts/ghostAffraidUp.png");
  GHOST_AFFRAID_RIGHT_IMAGE = await loadImage(
    "img/ghosts/ghostAffraidRight.png"
  );
  GHOST_AFFRAID_DOWN_IMAGE = await loadImage("img/ghosts/ghostAffraidDown.png");
  GHOST_AFFRAID_LEFT_IMAGE = await loadImage("img/ghosts/ghostAffraidLeft.png");
}
preloadRequiredImages();
