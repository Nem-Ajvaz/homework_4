// Query selectors for appending
const startBtn = document.querySelector("#startbtn");
const highScoreBtn = document.querySelector("#high-scoresbtn");
const timerElem = document.querySelector("#timer");
const contentEl = document.querySelector("#content");

//Current question index
let currentQuestionIndex = 0;
let correct = 0;

// timer variables
const wrongAnswerDuration = 10; // Penalty time doesn't change
let timeRemaining = 60; // Time remaining changes by an increment of -1 every 1000ms

// Timer
let interval;

//Questions being stored in an array
const questions = [
  {
    question: "What tag do you need to add a JS file to HTML",
    choices: ["<script>", "<source>", "<javascript>", "<div>"],
    answer: "<script>",
  },
  {
    question:
      "What is the output of the following function: <br /><code>let a = 3; <br />let b = 2 <br />let myFunc = function(a,b){ <br />let c = a * b <br />return c <br />} </code>",
    choices: ["6", "5", "1", "9"],
    answer: "6",
  },
  {
    question: "Which method would you use to remove the first item in an array",
    choices: [
      "array.push()",
      "array.pop()",
      "array.unshift()",
      "array.shift()",
    ],
    answer: "array.shift()",
  },
  {
    question: "Which of these is not a datatype in Javascript",
    choices: ["number", "character", "boolean", "object"],
    answer: "character",
  },
  {
    question: "What is the difference between '=', '==' and '==='",
    choices: [
      "'=' compares the value and the data type, '==' is an assigner operator, '===' compares the value but not the data type",
      "'=' is an assigner operator, '==' compares the value but not the data type, '===' compares the value and the data type",
      "There is no difference between '==' and '==='",
      "There is no difference between '=' and '=='",
    ],
    answer:
      "'=' is an assigner operator, '==' compares the value but not the data type, '===' compares the value and the data type",
  },
  {
    question: "What does NaN stand for",
    choices: ["Not a number", "Not a numeral", "Not a name", "Not a navbar"],
    answer: "Not a number",
  },
];

// Random sorting of the questions array
let randomQuestionOrder;

//On click start the timer and render the questions to the screen
startBtn.addEventListener("click", function () {
  // Randomly sorting the array
  randomQuestionOrder = questions.sort(function () {
    return 0.5 - Math.random();
  });
  // Score starts at 0
  correct = 0;

  // Assigning the time to an element
  timerElem.textContent = timeRemaining;
  // If time is greater than 0 print to screen
  timer = setInterval(() => {
    if (timeRemaining > 1) {
      timeRemaining--;
      timerElem.textContent = timeRemaining;
    }
    // Otherwise clear the inteval and don't print anything to the timerElem
    //and take me to the high scores page
    else {
      clearInterval(timer);
      timerElem.textContent = "";
      renderHighScores();
    }
    // Decrease the interval by 1000ms
  }, 1000);
  // Render the questions to the screen
  renderQuestions();
});

// Get highscores from local storage
function getScoresFromLocalStorage() {
  return JSON.parse(localStorage.getItem("highScores"));
}

// Set highscores to local storage
function setScoresInLocalStorage(highScoreArray) {
  localStorage.setItem("highScores", JSON.stringify(highScoreArray));
}
// Clear local storage
function resetScoresInLocalStorage() {
  localStorage.clear();
}

// Rendering high scores
function renderHighScores() {
  // Render the screen blank
  contentEl.innerHTML = "";
  // Create element, add context and class
  const highscoreHeading = document.createElement("h1");
  highscoreHeading.textContent = "High Score!";
  contentEl.appendChild(highscoreHeading);
  highscoreHeading.className = "high-score";
  const highScores = getScoresFromLocalStorage();
  // If local storage is empty than print the message
  if (!highScores) {
    const noScoreElm = document.createElement("p");
    noScoreElm.textContent = "No highscores at the moment.";
    contentEl.appendChild(noScoreElm);
  }
  // Otherwise print each high score to the screen in a paragraph
  else {
    for (let i = 0; i < highScores.length; i++) {
      j = i + 1;
      const pElm = document.createElement("p");
      pElm.textContent =
        j + ". " + highScores[i].initials + ": " + highScores[i].score;
      pElm.className = "high-scores-list";
      contentEl.appendChild(pElm);
    }
  }

  // Creating a button to reset high scores.
  const resetHighScores = document.createElement("button");
  resetHighScores.textContent = "Reset High Scores";
  resetHighScores.className = "reset-score";
  contentEl.appendChild(resetHighScores);
  // If clicked clear the local storage and render the high scores page
  resetHighScores.addEventListener("click", function () {
    resetScoresInLocalStorage();
    renderHighScores();
  });

  // Creating a button to refresh the page.
  const homePage = document.createElement("button");
  homePage.textContent = "Home Page";
  homePage.className = "home-page";
  contentEl.appendChild(homePage);
  homePage.addEventListener("click", function () {
    location.reload();
  });
}

// Function to submit a score
function submitScore() {
  // clearing the screen once the function is executed
  contentEl.innerHTML = "";
  // Create element, add context and class
  const highscoreHeading = document.createElement("h1");
  highscoreHeading.textContent = "Please enter your initials";
  highscoreHeading.className = "high-score";
  contentEl.appendChild(highscoreHeading);

  // Create element, add context and class
  let inputElm = document.createElement("input");
  let submitHighScoresElm = document.createElement("button");
  inputElm.type = "text";
  inputElm.className = "inputcls";
  submitHighScoresElm.textContent = "Submit score";
  submitHighScoresElm.className = "submit-score";

  contentEl.appendChild(inputElm);
  contentEl.appendChild(submitHighScoresElm);

  submitHighScoresElm.addEventListener("click", function (event) {
    let scores = getScoresFromLocalStorage();
    // If there is a value in inputElm when submit is clicked added to local storage
    if (scores) {
      scores.push({ initials: inputElm.value, score: correct });
      // Sort the high scores by value
      scores.sort(function (a, b) {
        return b.score - a.score;
      });
      setScoresInLocalStorage(scores);
    } else {
      let newScores = [{ initials: inputElm.value, score: correct }];
      setScoresInLocalStorage(newScores);
    }
    // Render the high scores page
    renderHighScores();
  });
}

function renderQuestions() {
  // If the current question index matches the length of the questions array
  // render the input score
  if (currentQuestionIndex === randomQuestionOrder.length) {
    clearInterval(timer);
    timerElem.textContent = "";
    submitScore();
  } else {
    // Clearing the screen
    contentEl.innerHTML = "";

    const currentQuestion = randomQuestionOrder[currentQuestionIndex];
    // Create element, add context and class
    const containerEle = document.createElement("div");
    const questionHeading = document.createElement("h1");
    questionHeading.innerHTML = currentQuestion.question;
    containerEle.appendChild(questionHeading);

    const answerContainer = document.createElement("div");
    answerContainer.className = "container";
    containerEle.appendChild(answerContainer);
    // for each question in the array create a button.
    for (let i = 0; i < currentQuestion.choices.length; i++) {
      const btn = document.createElement("button");
      btn.textContent = currentQuestion.choices[i];
      btn.className = "btn-ans";
      answerContainer.appendChild(btn);
    }
    contentEl.appendChild(containerEle);

    // If the correct question is selected add to correct otherwise remove 10 seconds
    containerEle.addEventListener("click", function (event) {
      if (event.target.matches("button")) {
        const value = event.target.textContent;
        if (value === randomQuestionOrder[currentQuestionIndex].answer) {
          correct++;
        } else {
          timeRemaining -= wrongAnswerDuration;
        }
        // Once the button is clicked wait 0.5 seconds before moving to another question in the array.
        setTimeout(function () {
          currentQuestionIndex++;
          renderQuestions();
        }, 500);
      }
    });
  }
}

// Render high scores page
highScoreBtn.addEventListener("click", function () {
  renderHighScores();
});
