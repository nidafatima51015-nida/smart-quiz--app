let current = 0;
let score = 0;
let timer;
let timeLeft;

/* ---------------- DOM Elements ---------------- */
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressBar = document.getElementById("progress-bar");
const timerDisplay = document.getElementById("timer");
const themeToggle = document.getElementById("themeToggle");

/* ---------------- Sounds ---------------- */
const correctSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
const wrongSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');

/* ---------------- Dark / Light Mode ---------------- */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

/* ---------------- Start Quiz ---------------- */
startBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  progressBar.style.width = "0%";
  resultScreen.classList.remove("active");
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // Preload sounds
  correctSound.play().then(() => correctSound.pause());
  wrongSound.play().then(() => wrongSound.pause());

  loadQuestion();
});

/* ---------------- Timer ---------------- */
function startTimer(duration) {
  timeLeft = duration;
  clearInterval(timer);
  timerDisplay.innerText = `${timeLeft}s`;

  timer = setInterval(() => {
    timerDisplay.innerText = `${timeLeft}s`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      wrongSound.play();
      goNextQuestion();
    }
  }, 1000);
}

/* ---------------- Load Question ---------------- */
function loadQuestion() {
  const q = questions[current];
  questionEl.innerText = q.question;
  optionsEl.innerHTML = "";

  const progressPercent = (current / questions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("option-btn");
    btn.onclick = () => checkAnswer(index);
    optionsEl.appendChild(btn);
  });

  startTimer(15);
}

/* ---------------- Check Answer ---------------- */
function checkAnswer(index) {
  clearInterval(timer);
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => btn.disabled = true);

  const correctIndex = questions[current].answer;

  if (index === correctIndex) {
    buttons[index].classList.add("correct");
    score++;
    correctSound.play();
  } else {
    buttons[index].classList.add("wrong");
    buttons[correctIndex].classList.add("correct");
    wrongSound.play();
  }

  setTimeout(() => goNextQuestion(), 500);
}

/* ---------------- Next Question ---------------- */
function goNextQuestion() {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

/* ---------------- Show Result ---------------- */
function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  progressBar.style.width = "100%";
  const message = getPerformanceMessage(score, questions.length);

  resultScreen.innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p>${message}</p>
    <button onclick="location.reload()">Restart</button>
  `;

  if (score === questions.length) {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* ---------------- Performance Message ---------------- */
function getPerformanceMessage(score, total) {
  const percentage = (score / total) * 100;

  if (percentage === 100) return "🎉 Perfect! You're a genius!";
  if (percentage >= 80) return "👍 Great job! Almost perfect!";
  if (percentage >= 50) return "🙂 Good effort! Keep practicing!";
  return "😅 Don't worry! Try again to improve!";
}
