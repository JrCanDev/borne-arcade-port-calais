function loadImage(imgPath) {
    const img = w;
    img.src = imgPath;
    return img;
  }

function setImageSourceWithAvailableExtension(imgElement, basePath) {
  const extensions = ["jpg", "jpeg", "png", "svg", "webp"];
  let loadAttempts = 0;
  let imageLoaded = false;

  for (const extension of extensions) {
    if (imageLoaded) break;

    const imgPath = basePath + "." + extension;
    const img = loadImage(imgPath);

    img.onload = () => {
      imageLoaded = true;
      loadAttempts = -Infinity;
      setElementImage(imgElement, imgPath);
    };

    img.onerror = () => {
      loadAttempts++;
      if (loadAttempts === extensions.length) {
        console.error(
          `No image found for ${basePath} with any of the following extensions: ${extensions.join(
            ", "
          )}`
        );
        setElementImage(imgElement, "img/fallback.svg");
      }
    };
  }
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
