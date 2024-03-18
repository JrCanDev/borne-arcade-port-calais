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
    if (window.location.href.indexOf("index.html") == -1) {
      window.location.href = "index.html";
    }
  }
}, 1000);

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
