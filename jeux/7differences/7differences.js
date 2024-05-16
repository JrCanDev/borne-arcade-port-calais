DIFFERENCE_COUNT = 7;
COUNTDOWN_SECONDS = 5;

window.onload = async function() {
    let ORIGINAL = await findImageWithAvailableExtension("img/original");
    let MODIFIED = await findImageWithAvailableExtension("img/modified");
    let ACCURACY_COUNTER = document.getElementById("accuracy");
    let FOUND_COUNTER = document.getElementById("found");
    let SHOWN_IMAGE = document.getElementById("diff-img");
    let COUNTDOWN_COUNTER = document.getElementById("countdown");
    let guesses = 0;
    let found = 0;

    SHOWN_IMAGE.src = ORIGINAL;
    
    let countdown = COUNTDOWN_SECONDS;
    let countdownInterval = setInterval(function() {
        COUNTDOWN_COUNTER.innerHTML = getTranslation("game.7differences.memorise") + "\n" + countdown;
        countdown--;
        if (countdown < 0) {
            SHOWN_IMAGE.src = MODIFIED;
            SHOWN_IMAGE.classList.add('slide-in');
            clearInterval(countdownInterval);
            COUNTDOWN_COUNTER.innerHTML = "";
        }
    }, 1000);


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