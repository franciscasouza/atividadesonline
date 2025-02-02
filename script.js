const questions = [
  {
    question: "O que significa HTML?",
    answer: "HyperText Markup Language",
  },
  {
    question: "Qual a linguagem principal para estilizar páginas web?",
    answer: "CSS",
  },
  {
    question: "Qual linguagem é usada para interatividade em páginas web?",
    answer: "JavaScript",
  },
];

let currentQuestion = 0;
let answers = [];
let userIP = "";

async function getUserIP() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    userIP = data.ip;

    let previousAttempt = localStorage.getItem(`quiz_attempt_${userIP}`);
    if (previousAttempt) {
      showPreviousResults();
    } else {
      loadQuestion();
    }
  } catch (error) {
    console.error("Erro ao capturar IP:", error);
  }
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    document.getElementById("question").innerText =
      questions[currentQuestion].question;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
  } else {
    showResults();
  }
}

function nextQuestion() {
  let userAnswer = document.getElementById("answer").value.trim();
  answers.push({
    question: questions[currentQuestion].question,
    userAnswer: userAnswer,
    correctAnswer: questions[currentQuestion].answer,
    isCorrect:
      userAnswer.toLowerCase() ===
      questions[currentQuestion].answer.toLowerCase(),
  });
  currentQuestion++;
  loadQuestion();
}

function showResults() {
  localStorage.setItem(`quiz_attempt_${userIP}`, JSON.stringify(answers));

  let resultHTML = "<h2>Resultado do Quiz</h2>";
  answers.forEach((ans) => {
    resultHTML += `
              <p><strong>Pergunta:</strong> ${ans.question}</p>
              <p><strong>Sua Resposta:</strong> ${ans.userAnswer} ${
      ans.isCorrect ? "✅" : "❌"
    }</p>
              ${
                !ans.isCorrect
                  ? `<p><strong>Resposta Correta:</strong> ${ans.correctAnswer}</p>`
                  : ""
              }
              <hr>
          `;
  });

  document.querySelector(".container").innerHTML = resultHTML;
}

function showPreviousResults() {
  let storedAnswers = JSON.parse(
    localStorage.getItem(`quiz_attempt_${userIP}`)
  );

  let resultHTML = "<h2>Você já respondeu este quiz!</h2>";
  storedAnswers.forEach((ans) => {
    resultHTML += `
              <p><strong>Pergunta:</strong> ${ans.question}</p>
              <p><strong>Sua Resposta:</strong> ${ans.userAnswer} ${
      ans.isCorrect ? "✅" : "❌"
    }</p>
              ${
                !ans.isCorrect
                  ? `<p><strong>Resposta Correta:</strong> ${ans.correctAnswer}</p>`
                  : ""
              }
              <hr>
          `;
  });

  document.querySelector(".container").innerHTML = resultHTML;
}

getUserIP();
