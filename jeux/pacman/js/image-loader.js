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

let PACMAN_IMAGE = new Array();
let FRUIT_IMAGES = new Object();
let GHOSTS_IMAGES = new Object();

let BUBBLE_IMAGE;
let SUPER_BUBBLE_IMAGE;
let BACKGROUND_IMAGE;


async function preloadRequiredImages() {
  const FRUITS = ["cherry", "strawberry", "orange", "apple", "melon", "galboss", "bell", "key"];

  for (let i = 1; i < 5; i++) {
    PACMAN_IMAGE.push(await loadImage("img/pacman/" + i + ".png"));
  }

  BACKGROUND_IMAGE = await loadImage("img/background.png");
  SUPER_BUBBLE_IMAGE = await loadImage("img/bubbles/superbubble.png");
  BUBBLE_IMAGE = await loadImage("img/bubbles/bubble.png");

  for (let fruit of FRUITS) {
    FRUIT_IMAGES[fruit] = await loadImage(`img/fruits/${fruit}.png`);
  }

  GHOSTS_IMAGES = {
    blinky: {
      image: await loadImage("img/ghosts/ghost1.png"),
      1: await loadImage("img/ghosts/ghost1Right.png"),
      2: await loadImage("img/ghosts/ghost1Down.png"),
      3: await loadImage("img/ghosts/ghost1Left.png"),
      4: await loadImage("img/ghosts/ghost1Up.png")
    },
    pinky: {
      image: await loadImage("img/ghosts/ghost2.png"),
      1: await loadImage("img/ghosts/ghost2Right.png"),
      2: await loadImage("img/ghosts/ghost2Down.png"),
      3: await loadImage("img/ghosts/ghost2Left.png"),
      4: await loadImage("img/ghosts/ghost2Up.png")
    },
    inky: {
      image: await loadImage("img/ghosts/ghost3.png"),
      1: await loadImage("img/ghosts/ghost3Right.png"),
      2: await loadImage("img/ghosts/ghost3Down.png"),
      3: await loadImage("img/ghosts/ghost3Left.png"),
      4: await loadImage("img/ghosts/ghost3Up.png")
    },
    clyde: {
      image: await loadImage("img/ghosts/ghost4.png"),
      1: await loadImage("img/ghosts/ghost4Right.png"),
      2: await loadImage("img/ghosts/ghost4Down.png"),
      3: await loadImage("img/ghosts/ghost4Left.png"),
      4: await loadImage("img/ghosts/ghost4Up.png")
    },
    affraid: {
      image: await loadImage("img/ghosts/ghostAffraid.png"),
      1: await loadImage("img/ghosts/ghostAffraidRight.png"),
      2: await loadImage("img/ghosts/ghostAffraidDown.png"),
      3: await loadImage("img/ghosts/ghostAffraidLeft.png"),
      4: await loadImage("img/ghosts/ghostAffraidUp.png")
    }
  }
}
preloadRequiredImages();
