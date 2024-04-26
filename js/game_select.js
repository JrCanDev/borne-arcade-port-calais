const SWIPE_HINT_COOLDOWN = 5000;

function setSwipeAnimationOpacity(opacity, delay = 0) {
    if (delay === 0) {
        document.getElementById('swipe-animation').style.opacity = opacity;
        return -1;
    }
    return setTimeout(function() {
        document.getElementById('swipe-animation').style.opacity = opacity;
    }, delay);
}

window.onload = function() {
    let timeout = setSwipeAnimationOpacity(1, SWIPE_HINT_COOLDOWN);

    document.querySelector('main').addEventListener('scroll', function() {
        clearTimeout(timeout);
        setSwipeAnimationOpacity(0);
        timeout = setSwipeAnimationOpacity(1, SWIPE_HINT_COOLDOWN);
    });
}

function onLocaleChange() {
    document.querySelector(`img[src="img/${locale}-flag.svg"]`).id = "selected-language";
    console.log("loaded")
}

// Change the id "#selected-language" to the new selected language when an img in the header is clicked
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", function () {
        document.querySelector("#selected-language").removeAttribute("id");
        document.querySelector(`img[src="img/${locale}-flag.svg"]`).id = "selected-language";
    });
});

function chooseBetweenGames(event, game1, game2) {
    event.stopPropagation();

    var element = document.getElementById(game1 + "-" + game2);
    if (!element) {
        element = document.getElementById(game2 + "-" + game1);
    }

    element.style.display = "block";
}