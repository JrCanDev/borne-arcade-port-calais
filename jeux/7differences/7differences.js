DIFFERENCE_COUNT = 7;
MEMORISE_SECONDS = 5;

window.onload = async function () {
  let ORIGINAL_IMAGE = document.getElementById("original-img");
  let MODIFIED_IMAGE = document.getElementById("modified-img");
  let ACCURACY_COUNTER = document.getElementById("accuracy");
  let FOUND_COUNTER = document.getElementById("found");
  let COUNTDOWN_COUNTER = document.getElementById("countdown");
  let guesses = 0;
  let found = 0;

  const GAME_STATES = {
    MEMORISE: 0,
    TRANSITION: 1,
    GAME: 2,
  };

  let game_state = GAME_STATES.MEMORISE;

  let countdown = MEMORISE_SECONDS;

  function updateCountdown() {
    countdown--;
    if (countdown < 0) {
      countdown = 0;
    }

    switch (game_state) {
      case GAME_STATES.MEMORISE:
        COUNTDOWN_COUNTER.innerHTML =
          getTranslation("game.7differences.memorise") + "\n" + countdown;
        if (countdown === 0) {
          onMemorisationEnd();
          game_state = GAME_STATES.TRANSITION;
          COUNTDOWN_COUNTER.innerHTML = "";
        }
        break;
      case GAME_STATES.TRANSITION:
        COUNTDOWN_COUNTER.innerHTML = countdown;
        if (countdown === 0) {
          game_state = GAME_STATES.GAME;
          COUNTDOWN_COUNTER.innerHTML = "";
        }
        break;
    }
  }

  let countdownInterval = setInterval(updateCountdown, 1000);

  function updateAccuracyCounter() {
    ACCURACY_COUNTER.innerHTML = Math.round((found / guesses) * 100) + "%";
  }

  function updateFoundCounter() {
    FOUND_COUNTER.innerHTML = found;
  }

  function onMemorisationEnd() {
    ORIGINAL_IMAGE.addEventListener("animationend", () => {
      ORIGINAL_IMAGE.style.display = "none";
    });
    ORIGINAL_IMAGE.classList.add("slide-out");
    MODIFIED_IMAGE.classList.add("slide-in");
    // make countdown the value of slide-in animation duration
    let style = window.getComputedStyle(MODIFIED_IMAGE);
    let animationDuration = style.animationDuration;
    countdown = parseFloat(animationDuration);

    let differences = [];
    for (let i = 0; i < DIFFERENCE_COUNT; i++) {
      differences.push(document.getElementById("difference" + (i + 1)));
    }

    function checkDifference(id) {
      let difference = differences[id - 1];
      if (difference.style.opacity != "1") {
        found++;
        updateAccuracyCounter();
        updateFoundCounter();
        difference.style.opacity = "1";
      }

      if (found == DIFFERENCE_COUNT) {
        showGameOver();
      }
    }

    // Attach the checkDifference function to the global scope so it can be accessed from the HTML
    window.checkDifference = checkDifference;

    document
      .getElementById("game-container")
      .addEventListener("touchstart", function () {
        guesses += 1;
        setTimeout(function () {
          updateAccuracyCounter();
        }, 100);
      });
  }
};
