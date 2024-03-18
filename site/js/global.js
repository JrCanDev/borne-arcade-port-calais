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
var time = 0;
var interval = setInterval(function () {
  time++;
  if (time >= INACTIVITY_TIME) {
    redirectToIndex();
  }
}, 1000);

function redirectToIndex() {
  var path = window.location.pathname;
  var pathParts = path.split('/');
  
  (async function checkAndRedirect() {
    for (var i = pathParts.length; i >= 0; i--) {
      var newPath = pathParts.slice(0, i).join('/') + '/index.html';
      try {
        let response = await fetch(newPath, { method: 'HEAD' });
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

function resetTimer() {
  time = 0;
}

TIMER_RESET_EVENTS.forEach((event) => {
  document.addEventListener(event, function () {
    resetTimer();
  });
});

// Disables the right click context menu on the site
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
