let questions = {};
let score = 0;
let current_question = 1;

let question_elem = null;
let question_img_elem = null;
let answers_elem = null;
let explanation_elem = null;

function onLocaleChange() {
  let i = 1;
  while (translations["game.quiz.question." + i]) {
    let question = translations["game.quiz.question." + i];
    let answers = [];
    j = 1;
    while (translations["game.quiz.question." + i + ".incorrect" + j]) {
      answers.push(translations["game.quiz.question." + i + ".incorrect" + j]);
      j++;
    }
    questions[question] = {
      correct: translations["game.quiz.question." + i + ".correct"],
      answers: answers,
      image: "img/" + i + ".jpg",
      explanation: translations["game.quiz.question." + i + ".explanation"],
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
  question_img_elem = document.getElementById("question-img");
  explanation_elem = document.getElementById("explanation");

  question_elem.addEventListener("animationend", () => {
    question_elem.classList.remove("zoomInOut");
  });

  nextQuestion();
}

function answerCallback() {
  if (
    this.innerHTML ==
    questions[Object.keys(questions)[current_question - 1]].correct
  ) {
    score++;
    question_elem.innerHTML = translations["game.quiz.correct"];
  } else {
    question_elem.innerHTML = translations["game.quiz.incorrect"];
  }
  question_elem.classList.add("zoomInOut");
  current_question++;

  explanation_text =
    questions[Object.keys(questions)[current_question - 2]].explanation;

  answers_elem.style.display = "none";
  explanation_elem.innerHTML = explanation_text;
  explanation_elem.style.display = "block";
  explanation_elem.classList.add("nextbutton");

  updateDisplay();
}

function updateDisplay() {
  let score_elem = document.getElementById("score");
  let maxscore_elem = document.getElementById("maxscore");

  score_elem.innerHTML = score;
  maxscore_elem.innerHTML = current_question - 1;
}

function nextQuestion() {
  question_elem.classList.add("zoomInOut");
  if (current_question > Object.keys(questions).length) {
    question_img_elem.style.display = "none";
    question_elem.innerHTML =
      translations["game.quiz.end"] + score + "/" + (current_question - 1);
    answers_elem.style.display = "none";
    explanation_elem.style.display = "none";
    showGameOver();
    return;
  }

  question_img_elem.src = "../../img/loading.svg";

  explanation_elem.style.display = "none";
  answers_elem.style.display = "grid";
  explanation_elem.classList.remove("nextbutton");

  question_elem.innerHTML = Object.keys(questions)[current_question - 1];

  answers_elem.innerHTML = "";
  let answers = questions[Object.keys(questions)[current_question - 1]].answers;
  let answers_elems = [];
  for (let i = 0; i < answers.length; i++) {
    let answer = document.createElement("button");
    answer.innerHTML = answers[i];
    answer.onclick = answerCallback;
    answers_elems.push(answer);
  }
  let answer = document.createElement("button");
  answer.innerHTML =
    questions[Object.keys(questions)[current_question - 1]].correct;
  answer.onclick = answerCallback;
  answers_elems.push(answer);
  answers_elems.sort(() => Math.random() - 0.5);
  for (let i = 0; i < answers_elems.length; i++) {
    answers_elem.appendChild(answers_elems[i]);
  }
  question_img_elem.src =
    questions[Object.keys(questions)[current_question - 1]].image;
}
