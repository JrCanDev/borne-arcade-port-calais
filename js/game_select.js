const SWIPE_HINT_COOLDOWN = 5000;

const setSwipeAnimationOpacity = (opacity, delay = 0) =>
  delay === 0
    ? ((swipeAnimationElement.style.opacity = opacity), -1)
    : setTimeout(() => (swipeAnimationElement.style.opacity = opacity), delay);

window.onload = () => {
  window.swipeAnimationElement = document.getElementById("swipe-animation");
  window.mainElement = document.querySelector("main");

  let timeout = setSwipeAnimationOpacity(1, SWIPE_HINT_COOLDOWN);

  mainElement.addEventListener("scroll", () => {
    clearTimeout(timeout);
    setSwipeAnimationOpacity(0);
    timeout = setSwipeAnimationOpacity(1, SWIPE_HINT_COOLDOWN);
  });
};

function onLocaleChange() {
  let prevLang = document.getElementById("selected-language");
  if (prevLang) prevLang.id = "";
  document.querySelector(`img[src="img/${locale}-flag.svg"]`).id =
    "selected-language";
}

const chooseBetweenGames = (event, game1, game2) => {
  event.stopPropagation();

  var element =
    document.getElementById(`${game1}-${game2}`) ||
    document.getElementById(`${game2}-${game1}`);

  element.style.display = "block";
};
