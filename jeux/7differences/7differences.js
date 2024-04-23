DIFFERENCE_COUNT = 7;

window.onload = function() {
    let ACCURACY_COUNTER = document.getElementById("accuracy");
    let FOUND_COUNTER = document.getElementById("found");
    let guesses = 0;
    let found = 0;

    function updateAccuracyCounter() {
        ACCURACY_COUNTER.innerHTML = Math.round((found / guesses) * 100) + "%";
    }

    function updateFoundCounter() {
        FOUND_COUNTER.innerHTML = found;
    }

    document.getElementById("game-container").addEventListener("touchstart", function() {
        guesses += 1;
        setTimeout(function() {
            updateAccuracyCounter();
        }, 100);
    });

    let differences = []
    for (let i = 0; i < DIFFERENCE_COUNT; i++) {
        // difference1
        differences.push(document.getElementById('difference' + (i + 1)));
    }

    function checkDifference(id) {
        let difference = differences[id - 1];
        if (difference.style.opacity != '1') {
            found++;
            updateAccuracyCounter();
            updateFoundCounter();
            difference.style.opacity = '1';
        }

        if (found == DIFFERENCE_COUNT) {
            showGameOver();
        }
    }

    // Attach the checkDifference function to the global scope so it can be accessed from the HTML
    window.checkDifference = checkDifference;
}