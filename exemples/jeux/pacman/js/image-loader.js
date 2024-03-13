async function loadImage(imageUrl) {
    let img;
    const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = imageUrl;
    });

    await imageLoadPromise;
    //console.log("image loaded");
    return img;
}

// In order to solve some bugs related to slow image loading due to re-building the Image object each time we add something in the canva,
// I decided that custom Images are loaded once here, then used everywhere needed, as a global var
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

async function preloadRequiredImages(){
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
}
preloadRequiredImages();