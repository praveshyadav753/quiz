let category = [
  { id: 9, category: "General Knowledge" },
  { id: 10, category: "Entertainment: Books" },
  { id: 11, category: "Entertainment: Film" },
  { id: 12, category: "Entertainment: Music" },
  { id: 13, category: "Entertainment: Musicals & Theatres" },
  { id: 14, category: "Entertainment: Television" },
  { id: 15, category: "Entertainment: Video Games" },
  { id: 16, category: "Entertainment: Board Games" },
  { id: 17, category: "Science & Nature" },
  { id: 18, category: "Science: Computers" },
  { id: 19, category: "Science: Mathematics" },
  { id: 20, category: "Mythology" },
  { id: 21, category: "Sports" },
  { id: 22, category: "Geography" },
  { id: 23, category: "History" },
  { id: 24, category: "Politics" },
  { id: 25, category: "Art" },
  { id: 26, category: "Celebrities" },
  { id: 27, category: "Animals" },
  { id: 28, category: "Vehicles" },
  { id: 29, category: "Entertainment: Comics" },
  { id: 30, category: "Science: Gadgets" },
  { id: 31, category: "Entertainment: Japanese Anime & Manga" },
  { id: 32, category: "Entertainment: Cartoon & Animations" },
];

let url = "https://opentdb.com/api.php?amount=10";
let url2 = "";
let questions = [];
let currentIndex = 0;
let timer;
let timeLeft = 15;
let score = 0;

// -------------------- Setup Category & Difficulty Selection --------------------
document.addEventListener("DOMContentLoaded", function () {
  let categoryDropdown = document.getElementById("category_dropdown");
  let difficultyDropdown = document.getElementById("difficulty_dropdown");
  let startQuizBtn = document.getElementById("startquiz");
  let header = document.getElementById("header1");
  let playagain = document.getElementById("playagain");
  let scoreelement =document.getElementById("scoreelement")
  // Populate category dropdown
  category.forEach((cat) => {
    let option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.category;
    categoryDropdown.appendChild(option);
  });
  let categorySelected;
  let selectedDifficulty;
  let selectedText;
  // Category selection
  categoryDropdown.addEventListener("change", function () {
    categorySelected = categoryDropdown.value;
    selectedText =
      categoryDropdown.options[categoryDropdown.selectedIndex].text; // Corrected here
    if (categorySelected) {
      url2 = url + "&category=" + categorySelected;
    }
  });

  // Difficulty selection
  difficultyDropdown.addEventListener("change", function () {
    selectedDifficulty = difficultyDropdown.value;
    if (selectedDifficulty) {
      url2 += "&difficulty=" + selectedDifficulty + "&type=multiple";
    }
  });
  nextBtn.addEventListener("click", function () {
    currentIndex++;
    showQuestion();
  });
  playagain.style.display = "none";
  playagain.addEventListener("click", function () {
    window.location.href("index.html");
  });
  let alertMsg = document.getElementById("alertmsg");
  let customAlert = document.getElementById("customAlert");
  // Start Quiz Button Click Event
  startQuizBtn.addEventListener("click", function () {
    if (!selectedDifficulty || !categorySelected) {
      customAlert.style.display = "block";
      document.getElementById("quizSelection").style.opacity = "0.4";

      alertMsg.innerText =
        !selectedDifficulty && !categorySelected
          ? "Please Select Category & Difficulty level before starting."
          : !selectedDifficulty
          ? "Please Select Difficulty level before starting."
          : "Please Select Category before starting.";

      document.getElementById("quizSelection").style.opacity = "0.4";
      setTimeout(() => {
        document.getElementById("customAlert").style.display = "none";
        document.getElementById("quizSelection").style.opacity = "1";
      }, 1000);
      return;
    }

    console.log(categoryDropdown.textContent);
    document.getElementById("quizSelection").style.display = "none";
    document.getElementById("quizpage").style.display = "flex";
    header.style.display = "flex";
    document.getElementById("type").textContent = selectedText;

    fetchQuestions();
  });
});

// -------------------- Fetch Questions --------------------
async function fetchQuestions() {
  currentIndex = 0; // Reset question index
  score = 0; // Reset score

  let questionContainer = document.getElementById("question");
  let optionsContainer = document.getElementById("options");
  let nextBtn = document.getElementById("nextBtn");
  document.getElementById("shimmer").style.display=("block");

  nextBtn.style.display = "none"; // Hide "Next" button while loading
  if (!url2) {
    console.error("URL is empty. Cannot fetch questions.");
    return;
  }

  try {
    const response = await fetch(url2);
    const data = await response.json();

    questions = data.results;
    if (questions.length > 0) {
      nextBtn.style.display = "block";
      showQuestion();
      document.getElementById("shimmer").removeAttribute("style");
    } else {
      questionContainer.innerText = "Oops! No questions found.";
      optionsContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    questionContainer.innerText = "Error loading questions. Try again!";
    optionsContainer.innerHTML = "";
  }
}

// -------------------- Show Question --------------------
async function showQuestion() {
  timerDisplay.removeAttribute("style");

  if (currentIndex >= questions.length) {
    document.getElementById(
      "question"
    ).innerHTML = `Quiz Finished! <span> You scored ${score} out of 10</span>`;
    document.getElementById("options").innerHTML = "";
    document.getElementById("nextBtn").style.display = "none";
    playagain.style.display="block"
    timerDisplay.style.display="none"
    return;
  }

  let questionContainer = document.getElementById("question");
  let optionsContainer = document.getElementById("options");

  let questionData = questions[currentIndex];

  questionContainer.innerHTML = `<span class="quesnum">${
    currentIndex + 1
  }. </span> <span class="question-text">${questionData.question}</span>`;

  let answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];
  answers.sort(() => Math.random() - 0.5);

  optionsContainer.innerHTML = "";

  answers.forEach((answer, index) => {
    let button = document.createElement("button");
    button.className = "option";
    button.id = "option-" + index;
    button.textContent = answer;
    button.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(button);
  });

  await startTimer();
}

// -------------------- Timer Function --------------------
async function startTimer() {
  return new Promise((resolve) => {
    timeLeft = 15;
    let timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;
      if(timeLeft<5){
        timerDisplay.style.color="red"
      }
      if (timeLeft <= 0) {
        clearInterval(timer);
        resolve();
        showCorrectAnswer();
        
      }
    }, 1000);
  });
}

// -------------------- Check Answer --------------------
function checkAnswer(selectedIndex) {
  let optionsContainer = document.getElementById("options");
  let buttons = Array.from(optionsContainer.children);
  let currentQuestion = questions[currentIndex];

  clearInterval(timer);

  buttons.forEach((button, index) => {
    if (index === selectedIndex) {
      if (button.textContent === currentQuestion.correct_answer) {
        button.style.background = "rgb(131 195 137)";
        score++;
        scoreelement.innerHTML=`score:${score}`
      } else {
        button.style.background = "rgb(217 114 114)";
        showAnswer();
      }
    }
    button.disabled = true;
  });

  buttons.forEach((button) => {
    if (button.textContent === currentQuestion.correct_answer) {
      button.style.background = "rgb(131 195 137)";
    }
  });

}

// -------------------- Show Correct Answer --------------------
function showCorrectAnswer() {
  let optionsContainer = document.getElementById("options");
  let buttons = Array.from(optionsContainer.children);
  let currentQuestion = questions[currentIndex];

  buttons.forEach((button) => {
    if (button.textContent === currentQuestion.correct_answer) {
      button.style.background = "rgb(131 195 137)";
    }
    button.disabled = true;
  });

  showAnswer();

  // setTimeout(() => {
  //   currentIndex++;
  //   showQuestion();
  // }, 2000);
}

// Show Answer
function showAnswer() {
  let correctAnswer = document.getElementById("show_answer");
  correctAnswer.innerHTML = `Correct Answer: ${questions[currentIndex].correct_answer}`;
  setTimeout(() => {
    correctAnswer.innerHTML = "";
  }, 2000);
}
