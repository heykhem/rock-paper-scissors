const defaultModalBox = document.querySelector(".default-home-modal");
const defaultModalContain = document.querySelector(".home-modal-wrapper");
const newGameBtn = document.querySelector(".new-game");
const gameHistoryBtn = document.querySelector(".game-history");
const newGameModalBox = document.querySelector(".new-game-modal");
const newGameModalContain = document.querySelector(".modal-wrapper");
const historyModalBox = document.querySelector(".history-modal");
const historyModalContain = document.querySelector(".hisotry-modal-wrapper");
const gameBackground = document.querySelector(".hand-wrapper");
const leftHandBox = document.querySelector(".left-hand-wrapper");
const opponentThinking = document.querySelector(".para");
const rightHandBox = document.querySelector(".right-hand-wrapper");
const scoreBoardBox = document.querySelector(".score-board-wrapper");
const currentRoundResult = document.querySelector(".current-round-result-show");

// ==PLAYER SCORE DISPLAY===
const player1ScoreDisplay = document.querySelector(".player2-score");
const player2ScoreDisplay = document.querySelector(".player1-score");

// ===PLAYER CHOICE BTNS===
const playerChoiceDiv = document.querySelector(".selection-option");

let rightHand = document.querySelector(".rimg");
let leftHand = document.querySelector(".limg");
const leftHandImages = [
  "Assets/rock.png",
  "Assets/paper.png",
  "Assets/scissors.png",
];
const rightHandImages = [
  "Assets/Rrock.png",
  "Assets/Rpaper.png",
  "Assets/Rscissors.png",
];

// NEW Game Button
newGameBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(newGameModalBox, newGameModalContain);
});

// NEW GAME MODAL
// close modal if clicked outside of the content
newGameModalBox.addEventListener("click", () => {
  closeModal(newGameModalBox, newGameModalContain);
});

// new game modal content
newGameModalContain.addEventListener("click", (e) => {
  e.stopPropagation();

  // ===== OPPONENT BUTTONS =====
  const buttons = Array.from(
    newGameModalContain.children[1].children[1].children
  );

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      buttons.forEach((b) => b.classList.remove("oppobox-active"));
      btn.classList.add("oppobox-active");
    });
  });
});

// new game modal close btn
const closeBtn = newGameModalContain.children[2].children[0];
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeModal(newGameModalBox, newGameModalContain);
});

//new game play btn
const playGameBtn = newGameModalContain.querySelector(".msg-start");
playGameBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Get selected rounds
  const selectedRound = newGameModalContain.querySelector(
    'input[name="rounds"]:checked'
  ).value;

  //Get selected opponent
  const selectedOpponentBox = newGameModalContain.querySelector(
    ".oppo-box.oppobox-active"
  );

  const opponent = selectedOpponentBox
    ? selectedOpponentBox.dataset.opponent
    : "computer"; // default fallback

  // close modal
  closeModal(newGameModalBox, newGameModalContain);

  startGame({ rounds: selectedRound, opponent });
});

// HISTORY MODAL
gameHistoryBtn.addEventListener("click", () => {
  historyModalBox.style.display = "block";
});

// FUNCTIONS
// ===OPEN MODAL===
const openModal = (overlay, content, display = "flex") => {
  overlay.style.display = display;

  gsap.fromTo(
    content,
    {
      scale: 0.5,
      opacity: 0,
      y: 50,
      rotationX: -15,
      transformPerspective: 1000,
    },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    }
  );
};

// ===CLOSE MODAL===
const closeModal = (overlay, content) => {
  gsap.to(content, {
    scale: 0.7,
    opacity: 0,
    y: 40,
    duration: 0.1,
    ease: "power2.in",
    onComplete: () => {
      overlay.style.display = "none";

      // reset for next open
      gsap.set(content, { scale: 1, opacity: 1, y: 0 });
    },
  });
};

// ===START GAME===
let userScore = 0;
let computerScore = 0;
let currentRound = 1;
let numberOfRounds = 3; // default
let index = 0;
let cycleInterval;

Array.from(playerChoiceDiv.children).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    playRound(Number(btn.dataset.value));
  });
});

const startGame = function ({ rounds, opponent }) {
  // Reset game state
  userScore = 0;
  computerScore = 0;
  currentRound = 1;
  numberOfRounds = Number(rounds); // Set it here from the parameter

  // Reset displays
  player1ScoreDisplay.innerHTML = 0;
  player2ScoreDisplay.innerHTML = 0;
  currentRoundResult.innerHTML = "";
  opponentThinking.innerHTML = "";

  gameBackground.style.background = `url("./Assets/bg.jpg")`;
  gameBackground.style.backgroundPosition = "center center";
  gameBackground.style.backgroundSize = "cover";
  gameBackground.style.backgroundRepeat = "no-repeat";

  closeModal(defaultModalBox, defaultModalContain);
  closeModal(historyModalBox, historyModalContain);
  playerChoiceDiv.style.display = "flex";
  leftHandBox.style.display = "flex";
  rightHandBox.style.display = "flex";
  scoreBoardBox.style.display = "flex";

  // Choice Buttons are enabled
  enableChoiceButtons();
};

function playRound(userChoice) {
  // Check if game is already finished
  if (currentRound > numberOfRounds) {
    return; // Don't allow more plays
  }

  let choice = ["Rock", "Paper", "Scissors"];
  disableChoiceButtons();

  // Show player 1 choice with hand animation
  rightHand.src = rightHandImages[userChoice];
  gsap.fromTo(
    rightHand,
    {
      opacity: 0,
    },
    {
      duration: 0.5,
      opacity: 1,
      ease: "power1.inOut",
      transformOrigin: "right center",
    }
  );

  var cycleStop = cycleImages();

  setTimeout(() => {
    clearInterval(cycleStop);

    let computerChoice = computerThink();

    opponentThinking.innerHTML = `Opponent chose a ${choice[computerChoice]}`;

    let finalResult = winCheck(userChoice, computerChoice);

    if (finalResult === null) {
      currentRoundResult.innerHTML = "Draw";
    } else if (finalResult === true) {
      currentRoundResult.innerHTML = "You Win";
      userScore++;
    } else {
      currentRoundResult.innerHTML = "You Lose";
      computerScore++;
    }
    // Update score display
    player1ScoreDisplay.innerHTML = userScore;
    player2ScoreDisplay.innerHTML = computerScore;

    leftHand.src = leftHandImages[computerChoice];

    // Increment the round counter
    currentRound++;

    // Check if game is finished
    if (currentRound > numberOfRounds) {
      setTimeout(() => {
        showGameResult();
      }, 1000);
    } else {
      // Enable buttons for next round
      setTimeout(() => {
        enableChoiceButtons();
      }, 50);
    }
  }, 500);
}

// Add this function to show final game results
function showGameResult() {
  let finalMessage = "";

  if (userScore > computerScore) {
    finalMessage = `🎉 You Won the Game! (${computerScore}-${userScore})`;
  } else if (computerScore > userScore) {
    finalMessage = `😔 You Lost the Game! (${computerScore}-${userScore})`;
  } else {
    finalMessage = `🤝 It's a Tie! (${computerScore}-${userScore})`;
  }

  currentRoundResult.innerHTML = finalMessage;

  // Keep buttons disabled after game ends
  disableChoiceButtons();
}

function computerThink() {
  var randomIndex = Math.floor(Math.random() * 3);
  leftHand.src = leftHandImages[randomIndex];
  gsap.fromTo(
    leftHand,
    { opacity: 0.9 },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
      transformOrigin: "left center",
    }
  );
  return randomIndex;
}

function winCheck(user, computer) {
  if (user === computer) return null;
  return (user - computer + 3) % 3 === 1;
}

function cycleImages() {
  if (cycleInterval) clearInterval(cycleInterval);

  cycleInterval = setInterval(function () {
    gsap.fromTo(
      leftHand,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        transformOrigin: "left center",
      }
    );
    index = (index + 1) % leftHandImages.length;
    leftHand.src = leftHandImages[index];
  }, 120);
  return cycleInterval;
}

function playSound() {
  let audio = new Audio("Assets/Sounds/start.mp3");
  audio.play();
}

function disableChoiceButtons() {
  Array.from(playerChoiceDiv.children).forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = 0.5; // optional visual feedback
  });
}

function enableChoiceButtons() {
  Array.from(playerChoiceDiv.children).forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = 1;
  });
}
