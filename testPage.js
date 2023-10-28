// Define variables to keep track of the test state and user's score.
let currentQuestionIndex = 0;
let userScore = 0;
let questions;
let userAnswers = [];
let userWorking = [];
const results = [];
let userName;
let selectedSubSubject = null; // Variable to hold the selected sub-subject
let selectedSubSubjectName = null;

// DOM elements
const startButton = document.getElementById("start-button");
const nameInputContainer = document.getElementById("name-input-container");
const nameInstructions = document.getElementById("name-instructions");
const restartTestButton = document.getElementById("restart-test-button");
const takeAnotherTestButton = document.getElementById(
  "take-another-test-button"
);
const questionContainer = document.getElementById("question-container");
const submitAnswerButton = document.getElementById("submit-answer-button");
const submitResultsButton = document.getElementById("submit-results-button");
const scoreContainer = document.getElementById("score-container");
const userScoreDisplay = document.getElementById("user-score");
const nameInput = document.getElementById("name");
const nameValidationMessage = document.getElementById(
  "name-validation-message"
);
const testTitle = document.getElementById("test-title");

// EVENT LISTENERS

// Retrieve selectedSubSubject from local storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
  selectedSubSubject = localStorage.getItem("selectedSubSubject");
  selectedSubSubjectName = localStorage.getItem("selectedSubSubjectName");
  console.log("Selected sub-subject name:", selectedSubSubjectName);
  if (!selectedSubSubject) {
    // Handle the case when no sub-subject is selected
    alert("Please select a sub-subject on the previous page.");
    window.location.href = "test.html"; // Redirect to the home page
  }
});

startButton.addEventListener("click", () => {
  if (nameInput.value.trim() === "") {
    nameValidationMessage.textContent = "Please enter your name.";
    nameValidationMessage.style.display = "inline";
  } else {
    nameInstructions.style.display = "none";
    startTest();
  }
});

// Input event listener for the name input
nameInput.addEventListener("input", () => {
  if (nameInput.checkValidity() && selectedSubSubject) {
    userName = nameInput.value;
    nameValidationMessage.style.display = "none";
    startButton.removeAttribute("disabled"); // Remove the "disabled" attribute
  } else {
    startButton.setAttribute("disabled", "false"); // Set the "disabled" attribute
  }
});

// Handle the "Submit Answer" button click event.
submitAnswerButton.addEventListener("click", () => {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  const answerValidationMessage = document.getElementById(
    "answer-validation-message"
  );

  if (selectedOption) {
    answerValidationMessage.style.display = "none";
    const workingTextArea = document.getElementById("working-textarea");
    const userWork = workingTextArea.value;
    const selectedOptionIndex = parseInt(selectedOption.value);
    const currentQuestion = questions[currentQuestionIndex];
    userAnswers.push(selectedOptionIndex);
    userWorking.push(userWork);

    const textareaId = `question${currentQuestionIndex + 1}`;
    const textarea = document.getElementById(textareaId);

    // Check correctness before adding the class
    const isCorrect =
      selectedOptionIndex === currentQuestion.correctAnswerIndex;

    // Class change added to the textarea based on correctness
    if (isCorrect) {
      textarea.classList.add("correct-answer");
    } else {
      textarea.classList.add("incorrect-answer");
    }

    if (isCorrect) {
      userScore++;
      userScoreDisplay.textContent = userScore;
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < 10) {
      displayQuestion(currentQuestionIndex);
    } else {
      questionContainer.style.display = "none";
      submitAnswerButton.style.display = "none";
      submitResultsButton.style.display = "block";
    }
  } else {
    answerValidationMessage.textContent =
      "Please select an answer before submitting.";
    answerValidationMessage.style.display = "inline";
  }
});

// Handle the "Submit Results" button click event.
submitResultsButton.addEventListener("click", () => {
  document.getElementById("test-container").style.display = "none";
  scoreContainer.style.display = "none";
  userScoreDisplay.textContent = userScore;
  submitAnswerButton.style.display = "none";

  // Display the user's answers and correct answer descriptions for the first 10 questions
  displayUserAnswersAndDescriptions();

  const quizFormContainer = document.getElementById("quiz-form-container");
  quizFormContainer.style.display = "block";
  const nameInputForm = document.getElementById("name-form");

  if (nameInputForm) {
    nameInputForm.value = userName;
  }

  const textareaIds = [
    "question1",
    "question2",
    "question3",
    "question4",
    "question5",
    "question6",
    "question7",
    "question8",
    "question9",
    "question10",
  ];

  for (let i = 0; i < 10; i++) {
    const textarea = document.getElementById(textareaIds[i]);
    const userAnswer = userAnswers[i];
    const userWork = userWorking[i];
    const question = questions[i];
    const correctAnswerDescription = question.correctAnswerDescription;

    let result = `${question.question}\nYour Answer: ${
      question.options[userAnswer]
    }\nResult: ${
      userAnswer === question.correctAnswerIndex ? "Correct" : "Incorrect"
    }\n`;

    if (userWork) {
      result += `Your Working: ${userWork}\n`;
    }

    result += `\nCorrect Answer Description:\n${correctAnswerDescription}`;
    textarea.value = result;
  }
});

restartTestButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  userScore = 0;
  userAnswers = [];
  userWorking = [];
  userScoreDisplay.textContent = userScore;
  shuffleArray(questions);
  questionContainer.style.display = "none";
  submitAnswerButton.style.display = "none";
  submitResultsButton.style.display = "none";
  takeAnotherTestButton.style.display = "none";
  startButton.style.display = "block";
  restartTestButton.style.display = "none";
});

takeAnotherTestButton.addEventListener("click", () => {
  location.reload();
});

// Handle the form submission on submit button click
const quizForm = document.getElementById("quiz-form");
quizForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Call the function to handle the form submission
  handleFormSubmission();
});

// FUNCTIONS

// Function to load questions based on the selected sub-subject
function loadSubSubjectQuestions(subSubject) {
  // Use the selected sub-subject to load the corresponding questions
  fetch(subSubject)
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions;
      shuffleArray(questions);
      currentQuestionIndex = 0;
      displayQuestion(currentQuestionIndex);

      // Dynamically load and display images if they are present in the JSON data
      if (data.images) {
        data.images.forEach((imageURL) => {
          // Create an image element and set its source and attributes
          const imageElement = document.createElement("img");
          imageElement.src = imageURL;
          imageElement.alt = "Question Image";

          // Append the image element to the question container or a specific location
          questionContainer.appendChild(imageElement); // Modify this as per your HTML structure
        });
      }
    });
}

function startTest() {
  // Hide the name input container
  nameInputContainer.style.display = "none";

  // Create a new <h1> element
  const newH1 = document.createElement("h1");

  // Set the content of the <h1> element
  newH1.textContent = `${selectedSubSubjectName} Test`;

  // Replace the existing "test-title" element with the new <h1> element
  testTitle.parentNode.replaceChild(newH1, testTitle);

  // Display the sub-subject name for test heading
  // document.getElementById("subject-heading-display").textContent = `${selectedSubSubjectName} Test`;
  document.getElementById("subject-heading-display").style.display = "block";

  // Display the user's name
  document.getElementById(
    "user-name-display"
  ).textContent = `Name: ${userName}`;
  document.getElementById("user-name-display").style.display = "block";

  // Hide the sub-subject buttons
  document.getElementById("sub-subject-buttons-container").style.display =
    "none";

  // Hide the "Start Test" button
  const startButton = document.getElementById("start-button"); // Select the button here
  startButton.style.display = "none";

  // Display the question container and submit answer button
  questionContainer.style.display = "block";
  submitAnswerButton.style.display = "block";

  loadSubSubjectQuestions(selectedSubSubject);

  // Pre-fill the user's name in the form input
  const nameInputForm = document.getElementById("name-form");
  if (nameInputForm) {
    nameInputForm.value = userName;
  }

  nameValidationMessage.style.display = "none";

  // Select the "Start Test" button after it's been created
  const startButtonAfterCreation = document.getElementById("start-button");
  startButtonAfterCreation.removeAttribute("disabled"); // Enable the button
}

function displayQuestion(index) {
  if (index < questions.length) {
    const question = questions[index];
    questionContainer.style.display = "block";
    questionContainer.innerHTML = "";

    if (question.image) {
      const imageElement = document.createElement("img");
      imageElement.src = question.image;
      imageElement.alt = "Question Image";
      questionContainer.appendChild(imageElement);
    }

    const questionTextElement = document.createElement("p");
    questionTextElement.textContent = question.question;
    questionContainer.appendChild(questionTextElement);

    question.options.forEach((option, i) => {
      const inputElement = document.createElement("input");
      inputElement.type = "radio";
      inputElement.name = "answer";
      inputElement.value = i;
      inputElement.id = `option${i}`;

      const labelElement = document.createElement("label");
      labelElement.htmlFor = `option${i}`;
      labelElement.textContent = option;

      const lineBreak = document.createElement("br");

      questionContainer.appendChild(inputElement);
      questionContainer.appendChild(labelElement);
      questionContainer.appendChild(lineBreak);
    });

    // Render the "working-textarea" for showing working
    const workingHeader = document.createElement("h3");
    workingHeader.textContent = "Show Working";
    questionContainer.appendChild(workingHeader);

    const textarea = document.createElement("textarea");
    textarea.id = "working-textarea";
    textarea.rows = "4";
    textarea.cols = "50";
    textarea.placeholder = question.working; // This is where the working content should be displayed
    textarea.classList.add("left-aligned-textarea");
    questionContainer.appendChild(textarea);
  } else {
    questionContainer.style.display = "none";
    submitAnswerButton.style.display = "none";
    submitResultsButton.style.display = "block";
  }
}

// JavaScript to adjust textarea height based on content
function adjustTextareaHeight() {
  const textareas = document.querySelectorAll(".auto-expand-textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto"; // Reset the height to auto
    textarea.style.height = `${textarea.scrollHeight}px`;
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
}

function displayUserAnswersAndDescriptions() {
  const userScoreElement = document.createElement("div");
  userScoreElement.classList.add("user-score");
  userScoreElement.innerHTML = `<h2>Your Score: ${userScore} out of 10</h2>`;
  const quizFormContainer = document.getElementById("quiz-form-container");
  quizFormContainer.insertBefore(
    userScoreElement,
    quizFormContainer.firstChild
  );
}

function displayUserAnswersAndDescriptions() {
  const userScoreElement = document.createElement("div");
  userScoreElement.classList.add("user-score");
  userScoreElement.innerHTML = `<h2>Your Score: ${userScore} out of 10</h2>`;
  const quizFormContainer = document.getElementById("quiz-form-container");
  quizFormContainer.insertBefore(
    userScoreElement,
    quizFormContainer.firstChild
  );
}

function returnHome() {
  window.location.href = "index.html"; // Redirect to the home page
}

//handle form submission function
function handleFormSubmission() {
  // Hide the form
  const quizFormContainer = document.getElementById("quiz-form-container");
  quizFormContainer.style.display = "none";

  // Show the custom submission content
  const customSubmissionPage = document.getElementById(
    "custom-submission-page"
  );
  customSubmissionPage.style.display = "block";

  // Submit the form to the hidden iframe
  const quizForm = document.getElementById("quiz-form");
  quizForm.target = "hiddenConfirm";
  quizForm.submit();

  // Automatically redirect to index.html after a delay (e.g., 3000 milliseconds = 3 seconds)
  setTimeout(function () {
    window.location.href = "index.html"; // Redirect to the home page
  }, 3000); // Adjust the delay duration as needed
}

// JavaScript to handle collapsible sections
function setupCollapsibleButtons() {
  const collapsibleButtons = document.querySelectorAll(".collapsible-button");

  collapsibleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });
}
// Call the function to set up the collapsible buttons
setupCollapsibleButtons();

// Function to shuffle an array randomly.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Call the adjustTextareaHeight function when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  adjustTextareaHeight();
});
