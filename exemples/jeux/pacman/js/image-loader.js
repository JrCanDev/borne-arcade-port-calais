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

async function preloadRequiredImages(){
    await loadImage("img/background.png");
    await loadImage("img/bubbles/superbubble.png");
    await loadImage("img/bubbles/bubble.png");
}
preloadRequiredImages();