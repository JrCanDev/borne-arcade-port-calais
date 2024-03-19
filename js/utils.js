function redirectToPage(e, url) {
    window.location.href = url;
}

function stopPropagation(e) {
    e.stopPropagation();
}

function simulateKeyPress(keyCode) {
    const event = new KeyboardEvent('keydown', {
        keyCode: keyCode,
        which: keyCode
    });
    document.dispatchEvent(event);
}
