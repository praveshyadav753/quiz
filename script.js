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
    { id: 32, category: "Entertainment: Cartoon & Animations" }
];

let url = "https://opentdb.com/api.php?amount=10";
let url2 = ""; 
let questions = [];
let currentIndex = 0;

// Page-specific logic
if (window.location.pathname.includes("index.html")) {
    let categoryDropdown = document.getElementById("category_dropdown");
    let difficultyDropdown = document.getElementById("difficulty_dropdown");

    category.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.category;
        categoryDropdown.appendChild(option);
    });

    categoryDropdown.addEventListener("change", function() {
        const categorySelected = categoryDropdown.value;
        if (categorySelected) {
            url2 = url + "&category=" + categorySelected;
            localStorage.setItem("url", url2);
        }
    });

    difficultyDropdown.addEventListener("change", function() {
        const selected_difficulty = difficultyDropdown.value;
        if (selected_difficulty) {
            url2 += "&difficulty=" + selected_difficulty + "&type=multiple";
            localStorage.setItem("url", url2);
        }
    });
}

// On "index_main.html"
if (window.location.pathname.includes("index_main.html")) {
    url2 = localStorage.getItem("url");

    if (!url2) {
        console.error("No URL found in localStorage.");
    } else {
        console.log("URL retrieved: ", url2);
        fetchQuestions();
    }
}

// Fetch questions from API
async function fetchQuestions() {
    if (!url2) {
        console.error("URL is empty. Cannot fetch questions.");
        return;
    }

    try {
        const response = await fetch(url2);
        const data = await response.json();
        questions = data.results;
        showQuestion();
    } catch (error) {
        console.error("Failed to fetch questions:", error);
    }
}

// Show question
function showQuestion() {
    if (currentIndex >= questions.length) {
        document.getElementById("question").innerText = "Quiz Finished!";
        document.getElementById("options").innerHTML = "";
        return;
    }

    const questionData = questions[currentIndex];
    document.getElementById("question").innerHTML = questionData.question;

    let answers = [...questionData.incorrect_answers, questionData.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    let optionsHtml = "";
    answers.forEach((answer,index) => {
        const button1 = document.createElement("button");
        button1.className = "option";
        button1.id=index
        button1.textContent = answer;
        button1.onclick = () => checkAnswer(index);

        optionsHtml.appendChild(button);
        // optionsHtml += `<br><button.onclick=()>${answer}</button.onclick=>`;
    });
    document.getElementById("options").innerHTML = optionsHtml;
}


//Check answer 
function checkAnswer(selectedIndex){
    const currentQuestion = questions[currentIndex]; // Get current question

    // Get all the buttons (options)
    const buttons = Array.from(optionsHTML.children);

    // Loop through the options and update button styles
    buttons.forEach((button,index) => {
        const button = document.createElement("button");
        button.className = "option";
        button.id=index
        button.textContent = option;
        button.onclick = () => checkAnswer(index);

        optionsContainer.appendChild(button);
        // Disable all buttons after one is selected
        button.disabled = true;

        // Highlight the correct and incorrect answers
        if (button.textContent === currentQuestion.correct_answer) {
            button.style.background = "green"; // Correct answer in green
        } else if (button.textContent === selectedAnswer) {
            button.style.background = "red"; // Wrong answer in red
        }
});
    // Show feedback
    let feedbackEl = document.getElementById("feedback");
    if (selectedAnswer === currentQuestion.correct_answer) {
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
    } else {
        feedbackEl.textContent = `Wrong! The correct answer is: ${currentQuestion.correct_answer}`;
        feedbackEl.style.color = "red";
    }


// Next question
document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex++;
    showQuestion();
});
}