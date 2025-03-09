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
  
  // -------------------- Page-specific Logic --------------------
  
  // If on index.html (Setup category and difficulty selection)
  if (window.location.pathname.includes("index.html")) {
    let categoryDropdown = document.getElementById("category_dropdown");
    let difficultyDropdown = document.getElementById("difficulty_dropdown");
  
    // Populate category dropdown
    category.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.category;
      categoryDropdown.appendChild(option);
    });
  
    // Category selection
    categoryDropdown.addEventListener("change", function () {
      const categorySelected = categoryDropdown.value;
      if (categorySelected) {
        url2 = url + "&category=" + categorySelected;
        localStorage.setItem("url", url2);
      }
    });
  
    // Difficulty selection
    difficultyDropdown.addEventListener("change", function () {
      const selectedDifficulty = difficultyDropdown.value;
      if (selectedDifficulty) {
        url2 += "&difficulty=" + selectedDifficulty + "&type=multiple";
        localStorage.setItem("url", url2);
      }
    });
  }
  
  // -------------------- On "index_main.html" --------------------
  var score=0
  if (window.location.pathname.includes("index_main.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      url2 = localStorage.getItem("url");
  
      if (!url2) {
        console.error("No URL found in localStorage.");
      } else {
        console.log("URL retrieved: ", url2);
        fetchQuestions();
      }
  
      // Ensure "Next" button works
      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          currentIndex++;
          console.log("Current Index: ", currentIndex);
          showQuestion();
        });
      }
    });
  }
  
  // -------------------- Fetch Questions --------------------
  async function fetchQuestions() {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const nextBtn = document.getElementById("nextBtn");

    // Hide "Next" button while loading
    if (nextBtn) nextBtn.style.display = "none";
  
    // Show loading shimmer before fetching
    document.getElementsByClassName("question-box").innerHTML = `<div class="shimmer-container"><div class="shimmer"></div></div>`;
    // optionsContainer.innerHTML = `<div class="shimmer-container1"><div class="shimmer"></div></div>`;
  
    if (!url2) {
      console.error("URL is empty. Cannot fetch questions.");
      return;
    }
  
    try {
      const response = await fetch(url2);
      const data = await response.json();
  
      // Remove shimmer effect
      questions = data.results;
      if (questions.length > 0) {
        if (nextBtn) nextBtn.style.display = "block";

        showQuestion();  // Show first question
      } else {
        questionContainer.innerText = "opps!.No questions found.";
        optionsContainer.innerHTML = "";
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      questionContainer.innerText = "Error loading questions. Try again!";
      optionsContainer.innerHTML = "";
    }
  }
  
  // -------------------- Show Question --------------------
  function showQuestion() {
    const nextBtn = document.getElementById("nextBtn");

    document.querySelector(".score").textContent = `Score: ${score}`;
    console.log("show q " + currentIndex);
  
    if (currentIndex >= questions.length) {
      document.getElementById("question").innerHTML = `Quiz Finished! <span> You scored ${score} out of 10</span>`;
      document.getElementById("options").innerHTML = "";
      if (nextBtn) nextBtn.style.display = "none";

      return;
    }
  
    let questionContainer = document.getElementById("question");
    let optionsContainer = document.getElementById("options");
  
    let questionData = questions[currentIndex];
  
    // Show actual question
    questionContainer.innerHTML = ""; // Clear previous question

    const questionNumber = document.createElement("span");
    questionNumber.className='quesnum';
    questionNumber.textContent = `${currentIndex + 1}. `;
    
    const questionText = document.createElement("span");
    questionText.className='question-text'
    questionText.innerHTML = questionData.question; // Only use if content is safe
    
    questionContainer.appendChild(questionNumber);
    questionContainer.appendChild(questionText);
      
    let answers = [...questionData.incorrect_answers, questionData.correct_answer];
    answers.sort(() => Math.random() - 0.5);
  
    optionsContainer.innerHTML = ""; // Clear previous options
  
    answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.className = "option";
      button.id = "option-" + index;
      button.textContent = answer;
      button.onclick = () => checkAnswer(index);
      optionsContainer.appendChild(button);
    });
  }
  
  // -------------------- Check Answer --------------------
  function checkAnswer(selectedIndex) {
    let optionsContainer = document.getElementById("options");
    const buttons = Array.from(optionsContainer.children);
  
    let currentQuestion = questions[currentIndex];
  
    // Check answer and update button styles
    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        //correct anss
        if (button.textContent === currentQuestion.correct_answer) {
          button.style.background = "rgb(131 195 137)";
          score++;
        } else {
          //false ans
          button.style.background = "rgb(217 114 114)";
        }
      }
      button.disabled = true; // Disable all buttons after one is selected
    });
  
    // Highlight the correct answer
    buttons.forEach((button) => {
      if (button.textContent === currentQuestion.correct_answer) {
        button.style.background = "rgb(131 195 137)";
      }
    });
  }
  