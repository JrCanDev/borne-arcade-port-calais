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

async function preloadRequiredImages(){
    BACKGROUND_IMAGE = await loadImage("img/background.png");
    SUPER_BUBBLE_IMAGE = await loadImage("img/bubbles/superbubble.png");
    BUBBLE_IMAGE = await loadImage("img/bubbles/bubble.png");
}
preloadRequiredImages();