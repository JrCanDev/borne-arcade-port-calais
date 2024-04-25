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