let timer;
let timeLeft = 15;
let score = 0;
let currentQuestion;

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    fetchQuestion();
}

function fetchQuestion() {
    let category = document.getElementById('category').value;
    let difficulty = document.getElementById('difficulty').value;
    
    fetch(`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            currentQuestion = data.results[0];
            displayQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
        });
}

function displayQuestion() {
    document.getElementById('question').innerText = currentQuestion.question;
    let options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    options.sort(() => Math.random() - 0.5);

    let optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    options.forEach(option => {
        let btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timeLeft = 15;
    document.getElementById('time').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}

function checkAnswer(answer) {
    clearInterval(timer);
    if (answer === currentQuestion.correct_answer) {
        score++;
        document.getElementById('score-value').innerText = score;
    }
    showCorrectAnswer();
}

function showCorrectAnswer() {
    alert(`Correct Answer: ${currentQuestion.correct_answer}`);
    fetchQuestion();
}

function restartGame() {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    score = 0;
    document.getElementById('score-value').innerText = score;
}
