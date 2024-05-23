let questions = {};
let score = 0;
let current_question = 1;

let question_elem = null;
let question_audio_elem = null;
let play_button_elem = null;
let answers_elem = null;
let explanation_elem = null;
let explanation_img_elem = null;

async function onLocaleChange() {
  let i = 1;
  while (translations["game.blindtest.question." + i]) {
    let question = translations["game.blindtest.question." + i];
    let answers = [];
    let images = [
      await findImageWithAvailableExtension("img/" + i),
    ]
    j = 1;
    while (translations["game.blindtest.question." + i + ".incorrect" + j]) {
      answers.push(
        translations["game.blindtest.question." + i + ".incorrect" + j]
      );
      images.push(
        await findImageWithAvailableExtension("img/" + i + "-" + j)
      )
      j++;
    }
    questions[question] = {
      correct: translations["game.blindtest.question." + i + ".correct"],
      answers: answers,
      images: images,
      audio: "audio/" + i + ".mp3",
      explanation:
        translations["game.blindtest.question." + i + ".explanation"],
    };
    i++;
  }
  let keys = Object.keys(questions);
  let shuffled = {};
  keys.sort(() => Math.random() - 0.5);
  keys.forEach((key) => {
    shuffled[key] = questions[key];
  });
  questions = shuffled;

  question_elem = document.getElementById("question");
  answers_elem = document.getElementById("answers");
  question_audio_elem = document.getElementById("question-audio");
  play_button_elem = document.getElementById("play-button");
  explanation_elem = document.getElementById("explanation");
  explanation_img_elem = document.getElementById("explanation-img");

  question_elem.addEventListener("animationend", () => {
    question_elem.classList.remove("zoomInOut");
  });

  nextQuestion();
}

function playAudio() {
  question_audio_elem.currentTime = 0;
  question_audio_elem.play();
}

function stopAudio() {
  question_audio_elem.pause();
}

function answerCallback() {
  let clicked_answer = this.children[0].innerHTML;
  if (
    clicked_answer ==
    questions[Object.keys(questions)[current_question - 1]].correct
  ) {
    score++;
    question_elem.innerHTML = translations["game.blindtest.correct"];
    explanation_img_elem.classList.add("correct-answer");
  } else {
    question_elem.innerHTML = translations["game.blindtest.incorrect"];
    explanation_img_elem.classList.add("wrong-answer");
  }
  question_elem.classList.add("zoomInOut");
  current_question++;

  explanation_text =
    questions[Object.keys(questions)[current_question - 2]].explanation;

  answers_elem.style.display = "none";
  play_button_elem.style.display = "none";
  explanation_elem.innerHTML = explanation_text;
  explanation_elem.style.display = "block";
  explanation_elem.classList.add("nextbutton");
  explanation_img_elem.src = questions[Object.keys(questions)[current_question - 2]].images[0];
  explanation_img_elem.style.display = "block";
  
  stopAudio();
  updateDisplay();
}

function updateDisplay() {
  let score_elem = document.getElementById("score");
  let maxscore_elem = document.getElementById("maxscore");

  score_elem.innerHTML = score;
  maxscore_elem.innerHTML = current_question - 1;
}

function nextQuestion() {
  explanation_img_elem.style.display = "none";
  play_button_elem.style.display = "block";
  play_button_elem.classList.remove("wrong-answer");
  play_button_elem.classList.remove("correct-answer");
  question_elem.classList.add("zoomInOut");
  if (current_question > Object.keys(questions).length) {
    play_button_elem.style.display = "none";
    question_elem.innerHTML =
      translations["game.blindtest.end"] + score + "/" + (current_question - 1);
    question_elem.style.margin = "auto";
    answers_elem.style.display = "none";
    explanation_elem.style.display = "none";
    showGameOver();
    return;
  }

  question_audio_elem.src = "";

  explanation_elem.style.display = "none";
  answers_elem.style.display = "grid";
  explanation_elem.classList.remove("nextbutton");

  question_elem.innerHTML = Object.keys(questions)[current_question - 1];

  answers_elem.innerHTML = "";
  let answers = questions[Object.keys(questions)[current_question - 1]].answers;
  let answers_elems = [];
  for (let i = 0; i < answers.length; i++) {
    let answer = document.createElement("div");
    let answer_text = document.createElement("p");
    answer_text.innerHTML = answers[i];
    answer.appendChild(answer_text);
    let image = document.createElement("img");
    image.src =
      questions[Object.keys(questions)[current_question - 1]].images[i + 1];
    answer.appendChild(image);
    answer.onclick = answerCallback;
    answers_elems.push(answer);
  }
  let answer = document.createElement("div");
  let answer_text = document.createElement("p");
  answer_text.innerHTML =
    questions[Object.keys(questions)[current_question - 1]].correct;
  answer.appendChild(answer_text);
  let image = document.createElement("img");
  image.src = questions[Object.keys(questions)[current_question - 1]].images[0];
  answer.appendChild(image);
  answer.onclick = answerCallback;
  answers_elems.push(answer);
  answers_elems.sort(() => Math.random() - 0.5);
  for (let i = 0; i < answers_elems.length; i++) {
    answers_elem.appendChild(answers_elems[i]);
  }
  question_audio_elem.src =
    questions[Object.keys(questions)[current_question - 1]].audio;
}
