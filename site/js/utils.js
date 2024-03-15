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

function emulateArrowClick(direction) {
    switch (direction) {
        case 'up':
            simulateKeyPress(38); // ArrowUp
            break;
        case 'left':
            simulateKeyPress(37); // ArrowLeft
            break;
        case 'down':
            simulateKeyPress(40); // ArrowDown
            break;
        case 'right':
            simulateKeyPress(39); // ArrowRight
            break;
    }
}