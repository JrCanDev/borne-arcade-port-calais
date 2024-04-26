let PACMAN_IMAGE = new Array();
let FRUIT_IMAGES = new Object();
let GHOSTS_IMAGES = new Object();

let BUBBLE_IMAGE;
let SUPER_BUBBLE_IMAGE;
let BACKGROUND_IMAGE;

async function preloadRequiredImages() {
  const FRUITS = ["cherry", "strawberry", "orange", "apple", "melon", "galboss", "bell", "key"];

  for (let i = 1; i < 5; i++) {
    PACMAN_IMAGE.push(await getImageWithAvailableExtension("img/pacman/" + i));
  }

  BACKGROUND_IMAGE = await getImageWithAvailableExtension("img/background");
  SUPER_BUBBLE_IMAGE = await getImageWithAvailableExtension("img/bubbles/superbubble");
  BUBBLE_IMAGE = await getImageWithAvailableExtension("img/bubbles/bubble");

  for (let fruit of FRUITS) {
    FRUIT_IMAGES[fruit] = await getImageWithAvailableExtension(`img/fruits/${fruit}`);
  }

  GHOSTS_IMAGES = {
    blinky: {
      image: await getImageWithAvailableExtension("img/ghosts/ghost1"),
      1: await getImageWithAvailableExtension("img/ghosts/ghost1Right"),
      2: await getImageWithAvailableExtension("img/ghosts/ghost1Down"),
      3: await getImageWithAvailableExtension("img/ghosts/ghost1Left"),
      4: await getImageWithAvailableExtension("img/ghosts/ghost1Up")
    },
    pinky: {
      image: await getImageWithAvailableExtension("img/ghosts/ghost2"),
      1: await getImageWithAvailableExtension("img/ghosts/ghost2Right"),
      2: await getImageWithAvailableExtension("img/ghosts/ghost2Down"),
      3: await getImageWithAvailableExtension("img/ghosts/ghost2Left"),
      4: await getImageWithAvailableExtension("img/ghosts/ghost2Up")
    },
    inky: {
      image: await getImageWithAvailableExtension("img/ghosts/ghost3"),
      1: await getImageWithAvailableExtension("img/ghosts/ghost3Right"),
      2: await getImageWithAvailableExtension("img/ghosts/ghost3Down"),
      3: await getImageWithAvailableExtension("img/ghosts/ghost3Left"),
      4: await getImageWithAvailableExtension("img/ghosts/ghost3Up")
    },
    clyde: {
      image: await getImageWithAvailableExtension("img/ghosts/ghost4"),
      1: await getImageWithAvailableExtension("img/ghosts/ghost4Right"),
      2: await getImageWithAvailableExtension("img/ghosts/ghost4Down"),
      3: await getImageWithAvailableExtension("img/ghosts/ghost4Left"),
      4: await getImageWithAvailableExtension("img/ghosts/ghost4Up")
    },
    affraid: {
      image: await getImageWithAvailableExtension("img/ghosts/ghostAffraid"),
      1: await getImageWithAvailableExtension("img/ghosts/ghostAffraidRight"),
      2: await getImageWithAvailableExtension("img/ghosts/ghostAffraidDown"),
      3: await getImageWithAvailableExtension("img/ghosts/ghostAffraidLeft"),
      4: await getImageWithAvailableExtension("img/ghosts/ghostAffraidUp")
    }
  }
}
preloadRequiredImages();
