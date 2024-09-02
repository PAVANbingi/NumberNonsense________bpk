// Select DOM elements
const questionEl = document.getElementById("question");
const questionFormEl = document.getElementById("questionForm");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

let storedAnswer;
let score = parseInt(localStorage.getItem("score")) || 0;
let timeLeft = 10; // Time per question in seconds
let intervalId;

// Utility function to generate random numbers
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate a math question
const generateQuestion = () => {
  const randomNumber1 = randomNumber(1, 10);
  const randomNumber2 = randomNumber(1, 10);
  const questionType = randomNumber(1, 4);

  let firstNumber;
  let secondNumber;

  // Ensure firstNumber is greater for subtraction and division
  if (randomNumber1 > randomNumber2 && (questionType === 3 || questionType === 4)) {
    firstNumber = randomNumber1;
    secondNumber = randomNumber2;
  } else {
    firstNumber = randomNumber2;
    secondNumber = randomNumber1;
  }

  let question;
  let answer;

  switch (questionType) {
    case 1:
      question = `Q. What is ${firstNumber} multiplied by ${secondNumber}?`;
      answer = firstNumber * secondNumber;
      break;
    case 2:
      question = `Q. What is ${firstNumber} added to ${secondNumber}?`;
      answer = firstNumber + secondNumber;
      break;
    case 3:
      question = `Q. What is ${firstNumber} divided by ${secondNumber}?`;
      answer = (firstNumber / secondNumber).toFixed(2); // Fix to 2 decimal places
      break;
    case 4:
      question = `Q. What is ${firstNumber} subtracted from ${secondNumber}?`;
      answer = secondNumber - firstNumber;
      break;
    default:
      question = `Q. What is ${firstNumber} added to ${secondNumber}?`;
      answer = firstNumber + secondNumber;
      break;
  }

  return { question, answer: parseFloat(answer) };
};

// Display the question and score
const showQuestion = () => {
  const { question, answer } = generateQuestion();
  questionEl.innerText = question;
  scoreEl.innerText = `Score: ${score}`;
  storedAnswer = answer;
  resetTimer();
  startTimer();
};

// Check the user's answer
const checkAnswer = (event) => {
  event.preventDefault();
  const formData = new FormData(questionFormEl);
  const userAnswer = parseFloat(formData.get("answer"));

  if (userAnswer === storedAnswer) {
    score++;
    Toastify({
      text: `Correct! Your score is now ${score}. Well done!`,
      gravity: "bottom",
      position: "center",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  } else {
    score--;
    Toastify({
      text: `Incorrect. The correct answer was ${storedAnswer}. Your score is now ${score}. Keep trying!`,
      gravity: "bottom",
      position: "center",
      style: {
        background: "linear-gradient(to right, #e33217, #ff001e)",
      },
    }).showToast();
  }

  localStorage.setItem("score", score);
  showQuestion();
  event.target.reset();
};

// Timer functionality
const startTimer = () => {
  intervalId = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      score--;
      Toastify({
        text: `Time's up! Your score is now ${score}. Keep going!`,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #e33217, #ff001e)",
        },
      }).showToast();
      localStorage.setItem("score", score);
      showQuestion();
    }
  }, 1000);
};

// Reset the timer
const resetTimer = () => {
  clearInterval(intervalId);
  timeLeft = 10;
  timerEl.innerText = `Time left: ${timeLeft}s`;
};

// Initialize the game
showQuestion();

// Add event listener to the form
questionFormEl.addEventListener("submit", checkAnswer);
