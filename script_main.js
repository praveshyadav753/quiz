// import {urll} from "./script.js";

// let questions = [];
// let currentIndex = 0;

// let url2 = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple";
// // console.log(window.urlglobal);
// // let url2 = localStorage.getItem("url");
// if (url2) {
//     console.log(url2); // You can now use the url2 value
// } else {
//     console.log("No URL found in sessionStorage.");
// }

// // Load questions on page load
// fetchQuestions();

// // Fetch quiz questions from API
// async function fetchQuestions() {
//     try {
//         const response = await fetch(url2);
//         const data = await response.json();
//         questions = data.results;
//         showQuestion(); // Display the first question
//     } catch (error) {
//         document.getElementById("question").innerHTML = "Failed to load questions!";
//     }
// }

// // Function to display a question
// function showQuestion() {
//     if (currentIndex >= questions.length) {
//         document.getElementById("question").innerText = "Quiz Finished!";
//         document.getElementById("options").innerHTML = "";
//         return;
//     }

//     const questionData = questions[currentIndex];
//     document.getElementById("question").innerHTML = questionData.question;

//     // Shuffle answers (correct + incorrect)
//     const answers = [...questionData.incorrect_answers, questionData.correct_answer];
//     answers.sort(() => Math.random() - 0.5);

//     // Display options
//     let optionsHtml = "";
//     answers.forEach(answer => {
//         optionsHtml += `<br><button><li>${answer}</li></button>`;  // Fixed template literal
//     });
//     document.getElementById("options").innerHTML = optionsHtml;
// }

// // Handle "Next" button click (placed outside showQuestion)
// document.getElementById("nextBtn").addEventListener("click", () => {
//     currentIndex++;
//     showQuestion();
// });

// console.log(document.getElementById("nextBtn"));