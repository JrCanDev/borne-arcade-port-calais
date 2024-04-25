window.onload = function() {
    let timeout;
    document.querySelector('main').addEventListener('scroll', function() {
        clearTimeout(timeout);
        document.getElementById('swipe-animation').style.opacity = 0;
        document.getElementById('scroll-arrow').style.opacity = 0;
        timeout = setTimeout(function() {
            document.getElementById('swipe-animation').style.opacity = 1;
            document.getElementById('scroll-arrow').style.opacity = 1;
        }, 5000);
    });
}