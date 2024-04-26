async function tryLoadImage(imgPath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imgPath;
    });
}

async function findImageWithAvailableExtension(basePath) {
    const extensions = ["jpg", "jpeg", "png", "svg", "webp"];
    const fallbackImgPath = "img/fallback.svg";
  
    const loadPromises = extensions.map(extension => {
        const imgPath = `${basePath}.${extension}`;
        return tryLoadImage(imgPath).then(() => ({ status: 'fulfilled', value: imgPath }), () => ({ status: 'rejected' }));
    });
  
    while (loadPromises.length > 0) {
        const index = await Promise.race(loadPromises.map((p, index) => p.then(() => index)));
        const result = await loadPromises[index];
  
        loadPromises.splice(index, 1);
  
        if (result.status === 'fulfilled') {
            return result.value;
        }
    }
  
    console.error(
        `No image found for ${basePath} with any of the following extensions: ${extensions.join(", ")}`
    );
  
    return fallbackImgPath;
}

async function setImageWithAvailableExtension(imgElement, basePath) {
  const imgPath = await findImageWithAvailableExtension(basePath);
  setElementImage(imgElement, imgPath);
}

async function getImageWithAvailableExtension(basePath) {
  return new Promise(async (resolve) => {
    const imgPath = await findImageWithAvailableExtension(basePath);
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = imgPath;
  });
}

function setElementImage(imgElement, imgPath) {
  if (imgElement.tagName === "IMG") {
    imgElement.src = imgPath;
  } else {
    imgElement.style.backgroundImage = `url(${imgPath})`;
  }
}

function redirectToPage(e, url) {
  window.location.href = url;
}

function stopPropagation(e) {
  e.stopPropagation();
}

function simulateKeyPress(keyCode) {
  const event = new KeyboardEvent("keydown", {
    keyCode: keyCode,
    which: keyCode,
  });
  document.dispatchEvent(event);
}
