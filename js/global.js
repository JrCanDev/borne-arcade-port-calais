// Time in seconds before the user is redirected to the index page
const INACTIVITY_TIME = 300;
// Events that reset the inactivity timer
const TIMER_RESET_EVENTS = [
  "click",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousemove",
  "keydown",
  "scroll",
];

// Goes back to the index page after one minute of inactivity
var inactivity_timer = 0;
setInterval(function () {
  inactivity_timer++;
  if (inactivity_timer >= INACTIVITY_TIME) {
    redirectToIndex();
    resetInactivityTimer();
  }
}, 1000);

function redirectToIndex() {
  var path = window.location.pathname;
  var pathParts = path.split("/");

  (async function checkAndRedirect() {
    for (var i = pathParts.length; i >= 0; i--) {
      var newPath = pathParts.slice(0, i).join("/") + "/index.html";
      try {
        let response = await fetch(newPath, { method: "HEAD" });
        if (response.ok) {
          window.location.href = newPath;
          break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  })();
}

function resetInactivityTimer() {
  inactivity_timer = 0;
}

TIMER_RESET_EVENTS.forEach((event) => {
  document.addEventListener(event, function () {
    resetInactivityTimer();
  });
});

// Disables the right click context menu on the site
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

function handleImageError(imgElement) {
  if (imgElement.retryCount >= 2) {
    console.error(`No image found for ${imgElement.src}`);
    return;
  }
  console.error(
    `No image found for ${imgElement.src}, trying with other extensions`
  );
  imgElement.retryCount = imgElement.retryCount + 1 || 0;
  img_base_path = imgElement.src.split(".")[0];
  setImageWithAvailableExtension(imgElement, img_base_path);
}

document.addEventListener("DOMContentLoaded", function () {
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    img.addEventListener("error", function () {
      handleImageError(img);
    });
  });
});
