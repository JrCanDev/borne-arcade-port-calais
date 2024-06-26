function setElementText(selector, textKey) {
  document.querySelector(selector).innerHTML = getTranslation(textKey)
}

function onLocaleChange() {
  setElementText("h1", `game.${params.game}.theme`);
  setElementText(".img-r p", `game.${params.game}.theme.topText`);
  setElementText(".img-l p", `game.${params.game}.theme.bottomText`);

  setImageWithAvailableExtension(
    document.querySelector(".img-r img"),
    `img/${params.game}-top`
  );

  setImageWithAvailableExtension(
    document.querySelector(".img-l img"),
    `img/${params.game}-bottom`
  );

  setImageWithAvailableExtension(
    document.getElementById("img-zoom"),
    `img/${params.game}-info-${locale}`
  );

  resetMagnifier();
}

function toggleFullscreen() {
  const fullscreenimg = document.getElementById("fullscreenimg");
  if (fullscreenimg.style.display === "none") {
    fullscreenimg.style.display = "flex";
    resetMagnifier();
    // For some reason, the fade-in class doesn't work if it's added immediately
    setTimeout(() => {
      fullscreenimg.classList.add("fade-in");
    }, 10);
  } else {
    fullscreenimg.classList.remove("fade-in");
    setTimeout(() => {
      fullscreenimg.style.display = "none";
      resetMagnifier();
    }, 300);
  }
}

function getObjectFitSize(imageElement) {
  var width = imageElement.naturalWidth;
  var height = imageElement.naturalHeight;
  var containerWidth = imageElement.offsetWidth;
  var containerHeight = imageElement.offsetHeight;

  var doRatio = width / height;
  var cRatio = containerWidth / containerHeight;
  var targetWidth = 0;
  var targetHeight = 0;
  var test = true ? doRatio > cRatio : doRatio < cRatio;

  if (test) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / doRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * doRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (containerWidth - targetWidth) / 2,
    y: (containerHeight - targetHeight) / 2,
  };
}

function updateMagnifierDisplay() {
  const img = document.getElementById("img-zoom");
  const rendered = getObjectFitSize(img);
  const magnifierRect = magnifier.getBoundingClientRect();

  let relativeX =
    (magnifierRect.left - rendered.x + magnifierRect.width / 3) /
    rendered.width;
  let relativeY =
    (magnifierRect.top - rendered.y + magnifierRect.height / 3) /
    rendered.height;

  magnifier.style.backgroundPositionX = relativeX * 100 + "%";
  magnifier.style.backgroundPositionY = relativeY * 100 + "%";
}

function resetMagnifier() {
  magnifier.style.cssText =
    magnifier.defaultStyle.left + " " + magnifier.defaultStyle.top;
  setImageWithAvailableExtension(
    document.getElementById("magnifier"),
    "img/" + params.game + "-info-" + locale
  );
  document.getElementById("magnifier-tutorial").style.opacity = 1;
  updateMagnifierDisplay();
}

function startDrag(event) {
  event.preventDefault();

  document.getElementById("magnifier-tutorial").style.opacity = 0;

  let shiftX =
    (event.touches ? event.touches[0].clientX : event.clientX) -
    magnifier.getBoundingClientRect().left;
  let shiftY =
    (event.touches ? event.touches[0].clientY : event.clientY) -
    magnifier.getBoundingClientRect().top;

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove);
  document.addEventListener("touchend", onEnd);

  function onMove(event) {
    // leeway is half the magnifier's size
    const leeway = magnifier.offsetWidth / 2;
    let newLeft =
      (event.touches ? event.touches[0].clientX : event.clientX) - shiftX;
    let newTop =
      (event.touches ? event.touches[0].clientY : event.clientY) - shiftY;

    if (newLeft < -leeway) newLeft = -leeway;
    if (newTop < -leeway) newTop = -leeway;

    let rightEdge =
      document.documentElement.clientWidth - magnifier.offsetWidth + leeway;
    if (newLeft > rightEdge) newLeft = rightEdge;

    let bottomEdge =
      document.documentElement.clientHeight - magnifier.offsetHeight + leeway;
    if (newTop > bottomEdge) newTop = bottomEdge;

    magnifier.style.left = newLeft + "px";
    magnifier.style.top = newTop + "px";

    updateMagnifierDisplay();
  }

  function onEnd() {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);
  }
}

window.onload = function () {
  window.params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  window.magnifier = document.getElementById("magnifier");
  magnifier.defaultStyle = {
    left: magnifier.style.left,
    top: magnifier.style.top,
  };

  magnifier.addEventListener("mousedown", startDrag);
  magnifier.addEventListener("touchstart", startDrag);
};
