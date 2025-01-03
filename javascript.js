let humanScore = 0;
let computerScore = 0;
let rounds = 3;        // How many *decisive* rounds (best of N)
let winsRequired = 2;  // For a best-of-3, we need 2 wins
let completedRounds = 0; // How many decisive outcomes (no ties) so far

// Get DOM elements
const roundsInput = document.getElementById("roundsInput");
const startGameBtn = document.getElementById("startGameBtn");
const roundsToPlay = document.getElementById("roundsToPlay");
const humanScoreSpan = document.getElementById("humanScore");
const computerScoreSpan = document.getElementById("computerScore");
const choicesDiv = document.getElementById("choices");
const messageDiv = document.getElementById("message");

// Grab all three choice buttons
const choiceButtons = document.querySelectorAll(".choiceBtn");

// Computer randomly picks rock, paper, or scissors
function getComputerChoice() {
  const randomNum = Math.floor(Math.random() * 3);
  if (randomNum === 0) return "rock";
  if (randomNum === 1) return "paper";
  return "scissors";
}

// Play a single round
function playRound(humanChoice, computerChoice) {
  if (humanChoice === computerChoice) {
    // Tie
    showMessage(
      `Tie! Both chose ${humanChoice}. (Score: You ${humanScore}, Computer ${computerScore})`
    );
    return "tie";
  } else if (
    (humanChoice === "rock" && computerChoice === "scissors") ||
    (humanChoice === "paper" && computerChoice === "rock") ||
    (humanChoice === "scissors" && computerChoice === "paper")
  ) {
    // Human wins
    humanScore++;
    showMessage(
      `You win! ${humanChoice} beats ${computerChoice}. (Score: You ${humanScore}, Computer ${computerScore})`
    );
    return "human";
  } else {
    // Computer wins
    computerScore++;
    showMessage(
      `You lose! ${computerChoice} beats ${humanChoice}. (Score: You ${humanScore}, Computer ${computerScore})`
    );
    return "computer";
  }
}

// Called whenever we want to log a result to the user
function showMessage(msg) {
  const newLine = document.createElement("p");
  newLine.textContent = msg;
  messageDiv.appendChild(newLine);
}


// Update the scoreboard in the DOM
function updateScores() {
  humanScoreSpan.textContent = humanScore;
  computerScoreSpan.textContent = computerScore;
}

// Start/Restart the game
function startGame() {
  // Read the number of rounds from the input
  rounds = parseInt(roundsInput.value, 10);
  if (isNaN(rounds) || rounds <= 0) {
    showMessage("Please enter a valid positive number of rounds.");
    return;
  }

  // Calculate how many wins are required
  winsRequired = Math.floor(rounds / 2) + 1;

  // Reset everything
  humanScore = 0;
  computerScore = 0;
  completedRounds = 0;
  updateScores();

  // Update DOM
  roundsToPlay.textContent = rounds;
  choicesDiv.style.display = "block";
  showMessage(`Game started! First to ${winsRequired} wins.`);

  // Enable choice buttons
  choiceButtons.forEach(btn => (btn.disabled = false));
}

// What happens when the user clicks Rock/Paper/Scissors
function onHumanChoiceClick(e) {
  const humanChoice = e.target.getAttribute("data-choice");
  const computerChoice = getComputerChoice();
  const result = playRound(humanChoice, computerChoice);

  // If it wasn't a tie, increment the count of decisive outcomes
  if (result !== "tie") {
    completedRounds++;
  }

  // Check if someone has reached the wins required
  if (humanScore >= winsRequired) {
    endGame("human");
  } else if (computerScore >= winsRequired) {
    endGame("computer");
  }
  // OR if we've played all possible decisive rounds
  else if (completedRounds >= rounds) {
    endGame("none"); 
  }
}

// End the game
function endGame(winner) {
  // Disable the choice buttons
  choiceButtons.forEach(btn => (btn.disabled = true));

  if (winner === "human") {
    showMessage(`You got ${humanScore} wins! You win the best-of-${rounds} game!`);
  } else if (winner === "computer") {
    showMessage(`Computer got ${computerScore} wins! Computer wins the best-of-${rounds} game!`);
  } else {
    // This case means all rounds used up but no one reached the required wins
    showMessage(
      `No one reached ${winsRequired} wins in ${rounds} decisive rounds. ` + 
      `Final score: You ${humanScore} - Computer ${computerScore}.`
    );
  }
}

// Event listeners
startGameBtn.addEventListener("click", startGame);
choiceButtons.forEach(btn => {
  btn.addEventListener("click", onHumanChoiceClick);
});
